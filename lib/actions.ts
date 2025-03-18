"use server"

import { Octokit } from "@octokit/rest"
import type { RestEndpointMethodTypes } from "@octokit/rest"

type CommitCell = {
  date: Date
  level: number
  month: number
  day: number
  formattedDate: string
  inYear: boolean
}

type CommitRequest = {
  username: string
  token: string
  repository: string
  commits: CommitCell[]
  customMessages?: string[]
  year: string
  rateLimit: number
  batchSize?: number
}

// Default commit messages if none provided
const DEFAULT_COMMIT_MESSAGES = [
  "Update documentation",
  "Fix typo",
  "Refactor code",
  "Add comments",
  "Update README",
  "Fix bug",
  "Improve performance",
  "Add tests",
  "Update dependencies",
  "Clean up code",
]

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function generateCommits(request: CommitRequest) {
  try {
    const { username, token, repository, commits, customMessages, year, rateLimit, batchSize = 10 } = request

    // Initialize Octokit with the provided token
    const octokit = new Octokit({
      auth: token,
    })

    // Calculate total commits to be generated
    const totalCommits = commits.reduce((sum, commit) => sum + commit.level, 0)
    
    // Enforce rate limits: max 666 per second, not more than 1000 per minute
    const effectiveRateLimit = Math.min(1000, Math.max(1, rateLimit));
    const estimatedMinutes = Math.ceil(totalCommits / effectiveRateLimit)
    
    console.log(`Total commits to generate: ${totalCommits}`)
    console.log(`Estimated time: ${estimatedMinutes} minutes (rate: ${effectiveRateLimit} commits/minute)`)

    // Check if repository exists
    const repoExists = true
    try {
      await octokit.repos.get({
        owner: username,
        repo: repository,
      })
    } catch (error: any) {
      if (error.status === 404) {
        // Repository doesn't exist, create it
        try {
          await octokit.repos.createForAuthenticatedUser({
            name: repository,
            auto_init: true,
          })
          console.log(`Created repository: ${repository}`)
        } catch (createError: any) {
          console.error("Repository creation error:", createError.message)
          return {
            success: false,
            error: `Failed to create repository: ${createError.message}`,
          }
        }
      } else {
        console.error("Repository check error:", error.message)
        return {
          success: false,
          error: "Repository access error: " + error.message,
        }
      }
    }

    // Get the default branch
    let defaultBranch = "main"
    try {
      const repoInfo = await octokit.repos.get({
        owner: username,
        repo: repository,
      })
      defaultBranch = repoInfo.data.default_branch
    } catch (error: any) {
      console.error("Error getting repo info:", error.message)
      return {
        success: false,
        error: "Failed to get repository information: " + error.message,
      }
    }

    // Get the latest commit SHA
    let latestCommitSha
    try {
      const refData = await octokit.git.getRef({
        owner: username,
        repo: repository,
        ref: `heads/${defaultBranch}`,
      })
      latestCommitSha = refData.data.object.sha
    } catch (error: any) {
      // If the repository is empty or reference doesn't exist
      if (error.status === 404) {
        try {
          // Create an empty tree
          const tree = await octokit.git.createTree({
            owner: username,
            repo: repository,
            tree: [],
          })

          // Create initial commit
          const commit = await octokit.git.createCommit({
            owner: username,
            repo: repository,
            message: "Initial commit",
            tree: tree.data.sha,
            parents: [],
          })

          // Create the reference
          await octokit.git.createRef({
            owner: username,
            repo: repository,
            ref: `refs/heads/${defaultBranch}`,
            sha: commit.data.sha,
          })

          latestCommitSha = commit.data.sha
        } catch (initError: any) {
          console.error("Repository initialization error:", initError.message)
          return {
            success: false,
            error: `Failed to initialize repository: ${initError.message}`,
          }
        }
      } else {
        console.error("Reference check error:", error.message)
        return {
          success: false,
          error: "Failed to get repository reference: " + error.message,
        }
      }
    }

    // Process each commit
    const messages = customMessages && customMessages.length > 0 ? customMessages : DEFAULT_COMMIT_MESSAGES

    // Sort commits by date to ensure chronological order
    const sortedCommits = [...commits].sort(
      (a, b) => new Date(a.formattedDate).getTime() - new Date(b.formattedDate).getTime(),
    )

    let successCount = 0
    let commitsInCurrentMinute = 0
    let lastMinuteStart = Date.now()
    let commitsInCurrentSecond = 0
    let lastSecondStart = Date.now()

    for (const commit of sortedCommits) {
      // Skip if level is 0 (no commits)
      if (commit.level === 0) continue

      // Generate multiple commits based on level
      for (let i = 0; i < commit.level; i += batchSize) {
        try {
          // Calculate how many commits to process in this batch
          const remainingCommits = commit.level - i;
          const currentBatchSize = Math.min(batchSize, remainingCommits);
          
          // Check per-second rate limit (666 per second max)
          const now = Date.now()
          if (now - lastSecondStart >= 1000) { // Reset counter after 1 second
            commitsInCurrentSecond = 0
            lastSecondStart = now
          }

          if (commitsInCurrentSecond >= 666) {
            const waitTime = 1000 - (now - lastSecondStart) // Wait until next second
            console.log(`Second rate limit reached. Waiting ${Math.ceil(waitTime)} ms...`)
            await delay(waitTime)
            commitsInCurrentSecond = 0
            lastSecondStart = Date.now()
          }

          // Check per-minute rate limit
          if (now - lastMinuteStart >= 60000) { // Reset counter after 1 minute
            commitsInCurrentMinute = 0
            lastMinuteStart = now
          }

          if (commitsInCurrentMinute >= effectiveRateLimit) {
            const waitTime = 60000 - (now - lastMinuteStart) // Wait until next minute
            console.log(`Minute rate limit reached. Waiting ${Math.ceil(waitTime/1000)} seconds...`)
            await delay(waitTime)
            commitsInCurrentMinute = 0
            commitsInCurrentSecond = 0
            lastMinuteStart = Date.now()
            lastSecondStart = Date.now()
          }

          // Process a batch of commits at once
          for (let j = 0; j < currentBatchSize; j++) {
            // Get random message
            const messageIndex = Math.floor(Math.random() * messages.length)
            const message = messages[messageIndex]

            // Get the latest tree
            const latestCommit: RestEndpointMethodTypes["git"]["getCommit"]["response"] = await octokit.git.getCommit({
              owner: username,
              repo: repository,
              commit_sha: latestCommitSha,
            })

            const treeSha: string = latestCommit.data.tree.sha

            // Create blob with timestamp and random content to ensure uniqueness
            const timestamp = new Date(commit.formattedDate)
            timestamp.setHours(
              Math.floor(Math.random() * 24),
              Math.floor(Math.random() * 60),
              Math.floor(Math.random() * 60),
            )

            const content = `Last updated: ${timestamp.toISOString()}\nRandom: ${Math.random()}\nCommit: ${i + j + 1} of ${commit.level}`

            const blob = await octokit.git.createBlob({
              owner: username,
              repo: repository,
              content: Buffer.from(content).toString("base64"),
              encoding: "base64",
            })

            // Create tree
            const tree: RestEndpointMethodTypes["git"]["createTree"]["response"] = await octokit.git.createTree({
              owner: username,
              repo: repository,
              base_tree: treeSha,
              tree: [
                {
                  path: `commit-${Date.now()}-${j}.txt`,
                  mode: "100644",
                  type: "blob",
                  sha: blob.data.sha,
                },
              ],
            })

            // Create commit with the specific date
            const newCommit: RestEndpointMethodTypes["git"]["createCommit"]["response"] = await octokit.git.createCommit({
              owner: username,
              repo: repository,
              message,
              tree: tree.data.sha,
              parents: [latestCommitSha],
              author: {
                name: username,
                email: `${username}@users.noreply.github.com`,
                date: timestamp.toISOString(),
              },
              committer: {
                name: username,
                email: `${username}@users.noreply.github.com`,
                date: timestamp.toISOString(),
              },
            })

            latestCommitSha = newCommit.data.sha
          }
          
          successCount += currentBatchSize;
          commitsInCurrentMinute += currentBatchSize;
          commitsInCurrentSecond += currentBatchSize;

          // Log progress in batches
          console.log(`Progress: ${successCount}/${totalCommits} commits (${Math.round((successCount/totalCommits)*100)}%)`)
        } catch (error: any) {
          console.error("Commit creation error:", error.message)
          return {
            success: false,
            error: `Failed to create commit: ${error.message}`,
          }
        }
      }
    }

    // Update reference
    try {
      await octokit.git.updateRef({
        owner: username,
        repo: repository,
        ref: `heads/${defaultBranch}`,
        sha: latestCommitSha,
        force: false,
      })
    } catch (error: any) {
      console.error("Reference update error:", error.message)
      return {
        success: false,
        error: `Failed to update reference: ${error.message}`,
      }
    }

    return {
      success: true,
      message: `Successfully generated ${successCount} commits over ${Math.ceil((Date.now() - lastMinuteStart)/60000)} minutes`,
      totalCommits: successCount,
      repositoryUrl: `https://github.com/${username}/${repository}`
    }
  } catch (error: any) {
    console.error("General error:", error.message)
    return {
      success: false,
      error: error.message,
    }
  }
}

