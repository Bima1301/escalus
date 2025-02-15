'use client'

import Image from "next/image";
import CreateForm from "./_components/form";

export default function CreatePageClient() {
    return (
        <div className="flex items-center gap-12 h-full justify-center">
            <Image
                src={'/programmer.jpg'}
                alt="programmer"
                width={500}
                height={500}
                className="w-full max-w-[300px] h-auto"
            />
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold">Link your Github Repository</h2>
                    <p className="text-sm text-gray-500">
                        Enter the URL of your Github repository to link it to your project.
                    </p>
                </div>
                <CreateForm />
            </div>
        </div >
    )
}
