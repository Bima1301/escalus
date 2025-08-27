import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import CodeReferences from '../code-references'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    answer: string
    setAnswer: Dispatch<SetStateAction<string>>
    filesReferences: { fileName: string; summary: string; sourceCode: string }[]
}

export default function QuestionDialog({ open, onOpenChange, answer, setAnswer, filesReferences }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[80vw]'>
                <DialogHeader>
                    <DialogTitle>
                        <Image
                            src={'/logo.png'}
                            alt='Escalus Logo'
                            width={40}
                            height={40}
                        />
                    </DialogTitle>
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
