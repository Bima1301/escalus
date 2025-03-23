import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAi = new GoogleGenerativeAI(env.GEMINI_API_KEY)
const model = genAi.getGenerativeModel({
    model: 'gemini-1.5-flash',
})

export const aiSummarizeCommit = async (diff: string) => {
    const res = await model.generateContent([
        `
You are an expert programmer. Summarize the following Git diff.
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
    `]);

    return res.response.text()
}
