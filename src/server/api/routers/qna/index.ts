import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";
import { requiredString } from "@/lib/validations/global";

export const qnaRouter = createTRPCRouter({
    getQuestions: protectedProcedure.input(
        z.object({
            projectId: requiredString
        })
    ).query(async ({ ctx, input }) => {
        return await ctx.db.question.findMany({
            where: {
                projectId: input.projectId
            }, include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    })
})