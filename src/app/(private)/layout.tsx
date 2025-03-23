import { SidebarProvider } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import AppSidebar from "./app-sidebar"

type Props = {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    return (
        <SidebarProvider className="bg-gray-100">
            <AppSidebar />
            <main className="w-full m-2">
                <div className="flex items-center gap-2 bg-sidebar shadow rounded-md p-2 px-4 bg-white">
                    <div className="ml-auto"></div>
                    <UserButton />
                </div>
                <div className="h-4">

                </div>
                <div className="bg-sidebar shadow rounded-md  overflow-y-scroll h-[calc(100vh-6rem)] p-4 bg-white">
                    {children}
                </div>
            </main>
        </SidebarProvider >
    )
}

export default layout
