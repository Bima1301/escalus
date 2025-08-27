'use client'

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: 'Q&A',
        url: '/qa',
        icon: Bot
    },
    {
        title: 'Meetings',
        url: '/meetings',
        icon: Presentation
    },
    {
        title: 'Billings',
        url: '/billings',
        icon: CreditCard
    },
]


export default function AppSidebar() {
    const pathname = usePathname()
    const { open } = useSidebar()
    const { projects, selectedprojectId, setSelectedProjectId } = useProject()
    return (
        <Sidebar collapsible="icon" variant="sidebar" className="bg-white">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={50} height={50} />
                    {open && (
                        <h1 className="text-3xl font-bold text-blue-900">
                            Escalus
                        </h1>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItems.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url} className={cn({
                                                '!bg-primary !text-white': pathname === item.url,
                                            })}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map((project) => {
                                return (
                                    <SidebarMenuItem key={project.id}>
                                        <SidebarMenuButton asChild>
                                            <div onClick={() => setSelectedProjectId(project.id)}>
                                                <div className={cn("rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary",
                                                    {
                                                        'bg-primary text-white': project.id === selectedprojectId,
                                                    }
                                                )}>
                                                    {project.name.charAt(0)}
                                                </div>
                                                <span>{project.name}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                            {open && (
                                <SidebarMenuItem className="mt-5">
                                    <Link href="/create" passHref>
                                        <Button variant="outline" className="w-fit " size={'sm'}>
                                            <Plus />
                                            Create Project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
