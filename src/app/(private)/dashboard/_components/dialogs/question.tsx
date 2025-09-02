import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import CodeReferences from '../code-references'
import { api } from '@/trpc/react'
import useProject from '@/hooks/use-project'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    answer: string
    question: string
    setAnswer: Dispatch<SetStateAction<string>>
    filesReferences: { fileName: string; summary: string; sourceCode: string }[]
}

export default function QuestionDialog({ open, onOpenChange, answer, question, setAnswer, filesReferences }: Props) {
    const { project } = useProject()
    const refetch = useRefetch()

    const saveAnswerMutation = api.project.saveAnswer.useMutation()

    const onSaveAnswer = () => {
        saveAnswerMutation.mutate({
            projectId: project!.id,
            question: question,
            answer: answer,
            filesReferences
        }, {
            onSuccess: () => {
                toast.success('Answer saved')
                refetch()
            },
            onError: () => {
                toast.error('Failed to save answer')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[80vw]'>
                <DialogHeader>
                    <div className='flex items-center gap-2'>
                        <DialogTitle>
                            <Image
                                src={'/logo.png'}
                                alt='Escalus Logo'
                                width={40}
                                height={40}
                            />
                        </DialogTitle>
                        <Button variant={'outline'} onClick={onSaveAnswer} disabled={saveAnswerMutation.isPending}>
                            Save Answer
                        </Button>
                    </div>
                </DialogHeader>

                <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll !bg-transparent !text-black' />
                <div className='h-4' />
                <CodeReferences fileReferences={filesReferences} />

                <Button
                    type='button'
                    onClick={() => { onOpenChange(false); setAnswer('') }}
                >
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    )
}
