'use client'

import useProject from "@/hooks/use-project"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import CommitLog from "./_components/commit-log"

export default function DashboardPageClient() {
    const { project } = useProject()

    return (
        <div className="flex items-center justify-between flex-wrap gap-y-4">
            <div className="w-fit rounded-md bg-primary px-4 py-3">
                <div className="flex items-center gap-x-2">
                    <Github className="size-5 text-white" />
                    <div className=" ml-2">
                        <p className="text-sm font-medium text-white">
                            This project is linked to {' '}
                            <Link href={project?.githubUrl ?? ''} className="inline-flex items-center text-white/80 hover:underline" target="_blank">
                                {project?.githubUrl}
                                <ExternalLink className="ml-1 size-4" />
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    Team Members
                </div>
            </div>

            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    Ask Question
                    Meeting CArd
                </div>

            </div>

            <div className="mt-8">
            </div>
            <div className="w-full">
                <CommitLog />
            </div>
        </div>
    )
}
