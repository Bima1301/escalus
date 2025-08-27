'use client'
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
    fileReferences: { fileName: string; summary: string; sourceCode: string }[]
}

const CodeReferences = ({ fileReferences }: Props) => {
    const [tab, setTab] = useState(fileReferences[0]?.fileName)
    return (
        <div className='max-w-[70vw]'>
            <Tabs value={tab} onValueChange={setTab}>
                <div className='overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md'>
                    {fileReferences.map(file => (
                        <button key={file.fileName} className={cn(
                            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted', {
                            'bg-primary text-primary-foreground hover:text-muted-foreground': tab == file.fileName
                        }
                        )}
                            onClick={() => setTab(file.fileName)}
                        >
                            {file.fileName}
                        </button>
                    ))}
                </div>
                {fileReferences.map(file => (
                    <TabsContent key={file.fileName} value={file.fileName} className='overflow-scroll max-h-[40vh] max-w-7xl'>
                        <SyntaxHighlighter language='typescript' style={lucario}>
                            {file.sourceCode}
                        </SyntaxHighlighter>
                    </TabsContent>
                ))}
            </Tabs>
        </div >
    )
}

export default CodeReferences
