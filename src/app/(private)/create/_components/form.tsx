import { FormField, FormItem, FormControl } from '@/components/ui/form'
import { Form } from '@/components/ui/form'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProjectSchema, CreateProjectValues } from '@/server/api/routers/create/validation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

export default function CreateForm() {
    const form = useForm<CreateProjectValues>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            projectName: "",
            githubUrl: "",
            githubToken: "",
        }
    })
    const createProject = api.project.create.useMutation()
    const refetch = useRefetch()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await form.handleSubmit(async (data) => {
            createProject.mutate(data, {
                onSuccess: () => {
                    toast.success('Project created successfully')
                    form.reset()
                    refetch()
                },
                onError: (e) => {
                    toast.error('Failed to create project')
                }
            })
        })();
    }
    return (
        <Form {...form}>
            <form className="w-full space-y-4" onSubmit={onSubmit}>
                <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field}
                                    placeholder='Project Name'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field}
                                    placeholder='Github URL'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="githubToken"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input {...field}
                                    placeholder='Github Token'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={createProject.isPending}>Create Project</Button>
            </form>
        </Form>
    )
}
