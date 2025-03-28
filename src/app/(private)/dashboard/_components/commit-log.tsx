import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CommitLog = () => {
    const { selectedprojectId, project } = useProject()
    const { data: commits } = api.project.getCommitLog.useQuery({ projectId: selectedprojectId })
    return (
        <>
            <ul className="space-y-6">
                {commits?.map((commit, index) => {
                    return (
                        <li key={index} className="relative flex gap-x-4 w-full">
                            <div className={cn(
                                index === commits.length - 1 ? 'h-6' : '-bottom-6',
                                'absolute left-0 top-0 flex w-6 justify-center'
                            )}>
                                <div className="w-px translate-x-1 bg-gray-200" />
                            </div>
                            <>
                                <Image
                                    src={commit.commitAuthorAvatar}
                                    alt={commit.commitAuthorName}
                                    width={100}
                                    height={100}
                                    className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
                                />
                                <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200">
                                    <div className="flex justify-between gap-x-4">
                                        <Link target="_blank" href={`${project?.githubUrl}/commits/${commit.commitHash}`} className="py-0.5 text-xs leading-5 text-gray-500 hover:text-blue-600 group">
                                            <span className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {commit.commitAuthorName}
                                            </span>{" "}
                                            <span className="inline-flex items-center">
                                                commited
                                                <ExternalLink className="ml-1 size-4" />
                                            </span>
                                        </Link>
                                    </div>
                                    <span className="font-semibold ">
                                        {commit.commitMessage}
                                    </span>
                                    <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-500 leading-6">
                                        {commit.summary}
                                    </pre>
                                </div>
                            </>
                        </li>
                    )
                })}
            </ul>
        </>
    );
}

export default CommitLog;