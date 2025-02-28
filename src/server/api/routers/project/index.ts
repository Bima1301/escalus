import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { createProjectSchema } from "./validation";

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
        return project
    }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        const projects = await ctx.db.project.findMany({
            where: {
                userToProjects: { some: { userId: ctx.user.userId } }
            }
        })
        return projects
    })
})