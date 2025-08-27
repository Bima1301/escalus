'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import useProject from "@/hooks/use-project"
import { useState } from "react"
import QuestionDialog from "./dialogs/question"
import { askQuestion } from "../action"
import { readStreamableValue } from "ai/rsc"

const AskQuestionCard = () => {
    const { project } = useProject()
    const [question, setQuestion] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filesReferences, setFilesReferences] = useState<{ fileName: string; summary: string; sourceCode: string }[]>([])
    const [answer, setAnswer] = useState<string>("")

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setAnswer('')
        setFilesReferences([])

        if (!project?.id) return

        setLoading(true)

        const { output, filesReferences } = await askQuestion(question, project.id)

        setOpen(true)
        setFilesReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setLoading(false)
    }
    return (
        <>
            <Card className="relative col-span-6">
                <CardHeader >
                    <CardTitle>
                        Ask a question
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea
                            placeholder="Which file should i edit to change the home page?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className="h-4" />
                        <Button type="submit" disabled={loading}>
                            Ask Escalus!
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <QuestionDialog
                open={open}
                onOpenChange={setOpen}
                answer={answer}
                filesReferences={filesReferences}
                setAnswer={setAnswer}
            />
        </>
    )
}

export default AskQuestionCard
