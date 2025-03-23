import { Octokit } from "octokit"
import { env } from "@/env"
import { db } from "@/server/db"
import axios from "axios"
import { aiSummarizeCommit } from "./gemini"

export const octokit = new Octokit({
    auth: env.GITHUB_TOKEN
})

const githubUrl = 'https://github.com/Bima1301/new-portofolio-website'

type Response = {
    commitHash: string
    commitMessage: string
    commitAuthorName: string
    commitAuthorAvatar: string
    commitDate: string
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)
    if (!owner || !repo) {
        throw new Error('Invalid github url')
    }

    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo,
    })

    const sortedData = data.sort((a, b) => new Date(b.commit.author?.date || '').getTime() - new Date(a.commit.author?.date || '').getTime())

    return sortedData.slice(0, 15).map(commit => ({
        commitHash: commit.sha,
        commitMessage: commit.commit.message,
        commitAuthorName: commit.commit.author?.name || '',
        commitAuthorAvatar: commit.author?.avatar_url || '',
        commitDate: commit.commit.author?.date || ''
    }))
}

export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectByGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommitHashes = await filterUnprocessedCommitHashes(projectId, commitHashes)
    const summariesRes = await Promise.allSettled(unprocessedCommitHashes.map(commit => summarizeCommit(githubUrl, commit.commitHash)))
    const summaries = summariesRes.map((res, index) => {
        if (res.status === 'fulfilled') {
            return res?.value as string
        }
        return ""
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            console.log('processing commit', index + 1)
            const commitData = unprocessedCommitHashes[index];
            if (!commitData) throw new Error(`Missing commit data at index ${index}`);

            return {
                projectId,
                commitHash: commitData.commitHash,
                commitMessage: commitData.commitMessage,
                commitAuthorName: commitData.commitAuthorName,
                commitAuthorAvatar: commitData.commitAuthorAvatar,
                commitDate: commitData.commitDate,
                summary
            };
        })
    })
    return commits
}

const summarizeCommit = async (githubUrl: string, commitHash: string) => {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })

    return await aiSummarizeCommit(data) || ""
}

const fetchProjectByGithubUrl = async (projectId: string) => {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
            githubUrl: true
        }
    })

    if (!project?.githubUrl) {
        throw new Error('Project has no github url')
    }

    return { project, githubUrl: project.githubUrl }
}

const filterUnprocessedCommitHashes = async (projectId: string, commitHashes: Response[]) => {
    const processedCommits = await db.commit.findMany({
        where: { projectId },
    })

    const unprocessedCommitHashes = commitHashes.filter(commit => !processedCommits.some(processedCommit => processedCommit.commitHash === commit.commitHash))

    return unprocessedCommitHashes
}

