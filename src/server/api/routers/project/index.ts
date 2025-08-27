import { pollCommits } from "@/lib/github";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { createProjectSchema, saveQuestionProjectSchema } from "./validation";
import { z } from "zod";
import { indexGithubRepo } from "@/lib/github-loader";
import { requiredString } from "@/lib/validations/global";

export const projectRouter = createTRPCRouter({
    create: protectedProcedure.input(
        createProjectSchema
    ).mutation(async ({ ctx, input }) => {
        const project = await ctx.db.project.create({
            data: {
                name: input.projectName,
                githubUrl: input.githubUrl,
                userToProjects: {
                    create: {
                        userId: ctx.user.userId,
                    }
                }
            }
        })
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken)
        await pollCommits(project.id)
        return project
    }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const projects = await ctx.db.project.findMany({
            where: {
                userToProjects: { some: { userId: ctx.user.userId } }
            }
        })
        return projects
    }),
    getCommitLog: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        pollCommits(input.projectId).then().catch(console.error)
        return await ctx.db.commit.findMany({ where: { projectId: input.projectId } })
    }),
    saveAnswer: protectedProcedure.input(
        saveQuestionProjectSchema
    ).mutation(async ({ ctx, input }) => {
        return await ctx.db.question.create({
            data: {
                answer: input.answer,
                filesReferences: input.filesReferences,
                projectId: input.projectId,
                question: input.question,
                userId: ctx.user.userId,
            }
        })
    })
})