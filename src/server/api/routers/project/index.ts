import { pollCommits } from "@/lib/github";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { createProjectSchema } from "./validation";
import { z } from "zod";

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
    })
})