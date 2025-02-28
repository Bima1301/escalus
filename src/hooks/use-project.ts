import { api } from "@/trpc/react"
import { useLocalStorage } from "usehooks-ts"

const useProject = () => {
    const { data: projects } = api.project.getAll.useQuery()
    const [selectedprojectId, setSelectedProjectId] = useLocalStorage('escalue-projects', ' ')
    const project = projects?.find(project => project.id === selectedprojectId)

    return {
        projects,
        project,
        selectedprojectId,
        setSelectedProjectId
    }
}

export default useProject