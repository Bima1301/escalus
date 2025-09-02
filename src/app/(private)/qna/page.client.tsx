'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import useProject from "@/hooks/use-project"
import { api } from "@/trpc/react"
import AskQuestionCard from "../dashboard/_components/ask-question-card"
import { Fragment, useState } from "react"
import Image from "next/image"
import MDEditor from "@uiw/react-md-editor"
import CodeReferences from "../dashboard/_components/code-references"

export default function QnaPageClient() {
    const { selectedprojectId } = useProject()
    const { data: questions } = api.qna.getQuestions.useQuery({ projectId: selectedprojectId })

    const [questionIndex, setQuestionIndex] = useState(0)
    const question = questions?.[questionIndex]


    return (
        <Sheet>
            <AskQuestionCard />
            <div className="h-4" />
            <h1 className="text-xl font-semibold">Saved Questions</h1>
            <div className="h-2" />
            <div className="flex flex-col gap-2">
                {questions?.map((question, index) => {
                    return <Fragment key={question.id}>
                        <SheetTrigger onClick={() => setQuestionIndex(index)}>
                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                                <Image
                                    className="rounded-full"
                                    height={30}
                                    width={30}
                                    src={question.user.imageUrl ?? ''}
                                    alt={question.user.firstName ?? ''}
                                />
                                <div className="text-left flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                                            {question.question}
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {question.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 line-clamp-1 text-sm">
                                        {question.answer}
                                    </p>
                                </div>
                            </div>
                        </SheetTrigger>
                    </Fragment>
                })}
            </div>

            {question && (
                <SheetContent className="sm:max-w-[80vw]">
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <MDEditor.Markdown source={question.answer} className='!bg-transparent !text-black' />
                        <CodeReferences fileReferences={(question.filesReferences ?? []) as any} />
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}
