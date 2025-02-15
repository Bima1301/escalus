import { requiredString } from "@/lib/validations/global";
import { z } from "zod";

export const createProjectSchema = z.object({
    projectName: requiredString,
    reportUrl: requiredString,
    githubToken: z.string().optional(),
})
export type CreateProjectValues = z.infer<typeof createProjectSchema>;