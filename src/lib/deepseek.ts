// deepseek.ts
import { env } from '@/env'
import { Document } from '@langchain/core/documents'

// Menggunakan OpenAI SDK karena DeepSeek API kompatibel dengan OpenAI
import OpenAI from 'openai'

const deepseek = new OpenAI({
    apiKey: env.DEEPSEEK_API_KEY, // Ganti dari GEMINI_API_KEY
    baseURL: 'https://api.deepseek.com/v1'
})

export const aiSummarizeCommit = async (diff: string) => {
    const response = await deepseek.chat.completions.create({
        model: 'deepseek-chat', // atau 'deepseek-coder' untuk coding tasks
        messages: [
            {
                role: 'system',
                content: 'You are an expert programmer. Summarize Git diffs in a clear and concise manner.'
            },
            {
                role: 'user',
                content: `
Summarize the following Git diff.
Reminder about git diff format:
For every file, there are a few metadata lines, like (for example):
\'\'\'
diff --git a/src/lib/utils.ts b/src/lib/utils.ts
index 1234567890..1234567891 100644
--- a/src/lib/utils.ts
+++ b/src/lib/utils.ts
\'\'\'
This means that the file \'src/lib/utils.ts\' has been modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \'+\' indicates a line that was added.
A line starting with \'-\' indicates a line that was removed.
A line starting with neither \'+\' nor \'-\' is a code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS : 
\'\'\'
* Raised the amount of returned recordings from 10 to 100 [server/recordings_api.ts]
* Fixed a typo in GitHub Action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the 'octokit' initialization to a separate file [src/octokit.ts, src/index.ts]
* Added an OpenAI API for completions [utils/apis/openai.ts]
* Lowered numeric tolerance for test files
\'\'\'
Most commits will have less comments than this example list.
The last comment doesn't include the file names.
because there where more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
Its is given only as an example of appropriate comments.

Now, summarize the following Git diff:\n\n${diff}
                `
            }
        ],
        temperature: 0.3,
        max_tokens: 1000
    })

    return response.choices[0]?.message?.content || ''
}

export async function summariseCode(doc: Document) {
    console.log('Getting summary for', doc.metadata.source)
    try {
        const code = doc.pageContent.slice(0, 10000)
        const response = await deepseek.chat.completions.create({
            model: 'deepseek-coder', // Model khusus untuk coding
            messages: [
                {
                    role: 'system',
                    content: 'You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects'
                },
                {
                    role: 'user',
                    content: `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.

Here is the code:
---
${code}
---
Give a summary no more than 100 words of the code above.`
                }
            ],
            temperature: 0.3,
            max_tokens: 200
        })

        return response.choices[0]?.message?.content || ''

    } catch (error) {
        console.error(error)
        return ''
    }
}

export async function generateEmbedding(summary: string) {
    const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY
    })

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: summary,
        })

        return response.data[0]?.embedding || []
    } catch (error) {
        console.error('Error generating embedding:', error)
        throw error
    }
}

// Alternatif untuk embedding menggunakan Hugging Face
// export async function generateEmbeddingHF(summary: string) {
//     const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${env.HUGGINGFACE_API_KEY}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             inputs: summary,
//             options: {
//                 wait_for_model: true
//             }
//         })
//     })

//     const result = await response.json()
//     return result
// }