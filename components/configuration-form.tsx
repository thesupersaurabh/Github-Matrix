"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCommitStore } from "@/lib/commit-store"
import { generateCommitsClient } from "@/lib/client-actions"
import { Loader2, InfoIcon, Terminal, ExternalLink, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import ProgressDisplay from "./progress-display"

export default function ConfigurationForm() {
  const { toast } = useToast()
  const { commitData, selectedYear, addLog, formData, updateFormData } = useCommitStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [commitsMade, setCommitsMade] = useState(0)
  const [totalCommitsToMake, setTotalCommitsToMake] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [repoUrl, setRepoUrl] = useState("")
  const [showToken, setShowToken] = useState(false)
  
  // Calculate estimated time dynamically when rate limit changes
  useEffect(() => {
    // Filter only cells with commit levels > 0 and in the selected year
    const commitsToGenerate = commitData.filter((cell) => cell.level > 0 && cell.inYear)
    const totalCommits = commitsToGenerate.reduce((sum, cell) => sum + cell.level, 0)
    const rateLimit = Math.min(1000, Math.max(1, formData.rateLimit))
    const estimated = Math.ceil(totalCommits / rateLimit)
    setEstimatedTime(estimated)
    setTotalCommitsToMake(totalCommits)
  }, [commitData, formData.rateLimit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.token || !formData.repository) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Filter only cells with commit levels > 0 and in the selected year
    const commitsToGenerate = commitData.filter((cell) => cell.level > 0 && cell.inYear)

    if (commitsToGenerate.length === 0) {
      toast({
        title: "No Commits Selected",
        description: "Please select at least one day to generate commits",
        variant: "destructive",
      })
      return
    }

    const totalCommits = commitsToGenerate.reduce((sum, cell) => sum + cell.level, 0)
    setTotalCommitsToMake(totalCommits)
    setCommitsMade(0)
    setProgress(0)
    setRepoUrl("")

    setIsGenerating(true)
    addLog(`Starting commit generation for ${commitsToGenerate.length} days...`)
    addLog(`Rate limit: ${formData.rateLimit} commits per minute`)
    addLog(`Total commits to generate: ${totalCommits}`)
    addLog(`Estimated time: ${estimatedTime} minutes (rate: ${formData.rateLimit} commits/minute)`)
    addLog(`Batch size: ${formData.batchSize} commits per batch`)

    try {
      // Prepare commit messages
      let messages: string[] = []
      if (formData.useCustomMessages && formData.customMessages.trim()) {
        messages = formData.customMessages.split("\n").filter((msg) => msg.trim())
      }

      // Use the client-side function instead of server action
      const result = await generateCommitsClient({
        username: formData.username,
        token: formData.token,
        repository: formData.repository,
        commits: commitsToGenerate,
        customMessages: messages,
        year: formData.year,
        rateLimit: formData.rateLimit,
        batchSize: formData.batchSize,
        // Add a progress callback function to update UI in real-time
        onProgress: (progressPercent, commitsMade, message) => {
          setProgress(progressPercent);
          setCommitsMade(commitsMade);
          addLog(message);
        }
      })

      // Handle the result
      if (result.success) {
        toast({
          title: "Commits Generated",
          description: `Successfully generated ${result.totalCommits} commits`,
        })
        setProgress(100)
        setCommitsMade(totalCommits)
        addLog(`✅ Successfully generated ${result.totalCommits} commits`)
        if (result.repositoryUrl) {
          setRepoUrl(result.repositoryUrl)
          addLog(`🔗 Repository URL: ${result.repositoryUrl}`)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate commits",
          variant: "destructive",
        })
        addLog(`❌ Error: ${result.error}`)
        
        // If we have partial progress information, show it
        if (result.progress) {
          setCommitsMade(result.progress.commitsMade);
          setProgress(Math.floor((result.progress.commitsMade / result.progress.totalCommits) * 100));
          addLog(`Generated ${result.progress.commitsMade}/${result.progress.totalCommits} commits before error occurred`);
          addLog(`You can try again later and the process will resume from where it left off`);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      addLog(`❌ Unexpected error occurred`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border border-green-500/30 bg-black/70 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="username" className="text-green-500 font-mono">GitHub_Username</Label>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-green-500/30 to-transparent hidden sm:block"></div>
                  </div>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => updateFormData({ username: e.target.value })}
                    placeholder="thesupersaurabh"
                    className="bg-black/90 border-green-500/50 focus:border-green-500 text-green-500 font-mono placeholder:text-green-500/40"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="token" className="text-green-500 font-mono">GitHub_Personal_Access_Token</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-green-500/70" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border-green-500 text-green-500 font-mono max-w-sm p-3">
                          <div className="space-y-3">
                            <p className="font-bold text-green-400">REQUIRED TOKEN PERMISSIONS:</p>
                            <p>Create a fine-grained personal access token with specific permissions:</p>
                            <ol className="list-decimal pl-5 space-y-2 text-green-400/90">
                              <li>Go to GitHub.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens</li>
                              <li>Click "Generate new token"</li>
                              <li>Set a descriptive token name and expiration</li>
                              <li>Under "Repository access" select "Only select repositories" and choose your target repository</li>
                              <li>In "Permissions" section, expand "Repository permissions"</li>
                              <li>Set "Contents" to <span className="text-green-300 font-bold">Read and write</span> access</li>
                              <li>Click "Generate token" and copy the token value</li>
                            </ol>
                            <p className="text-yellow-400/80 text-xs">SECURITY_WARNING: Keep this token secure. It provides access to your GitHub repositories.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-green-500/30 to-transparent hidden sm:block"></div>
                  </div>
                  <div className="relative">
                    <Input
                      id="token"
                      type={showToken ? "text" : "password"}
                      value={formData.token}
                      onChange={(e) => updateFormData({ token: e.target.value })}
                      placeholder="github_pat_..."
                      className="bg-black/90 border-green-500/50 focus:border-green-500 text-green-500 font-mono placeholder:text-green-500/40 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500/70 hover:text-green-500"
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="repository" className="text-green-500 font-mono">Repository_Name</Label>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-green-500/30 to-transparent hidden sm:block"></div>
                  </div>
                  <Input
                    id="repository"
                    value={formData.repository}
                    onChange={(e) => updateFormData({ repository: e.target.value })}
                    placeholder="repository-name"
                    className="bg-black/90 border-green-500/50 focus:border-green-500 text-green-500 font-mono placeholder:text-green-500/40"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rate-limit" className="text-green-500 font-mono">Rate_Limit_[commits/min]</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-green-500/70" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-black/90 border-green-500 text-green-500 font-mono max-w-xs">
                            <p>Controls commits per minute to avoid GitHub API rate limits. GitHub limits authenticated API calls to 5,000 per hour. Higher values will generate faster but may hit rate limits on large patterns.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-green-500/30 to-transparent hidden sm:block"></div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="rate-limit"
                      type="number"
                      min="1"
                      max="3000"
                      value={formData.rateLimit}
                      onChange={(e) => updateFormData({ rateLimit: parseInt(e.target.value) })}
                      className="bg-black/90 border-green-500/50 focus:border-green-500 text-green-500 font-mono placeholder:text-green-500/40"
                    />
                    <div className="text-green-300 font-mono text-sm whitespace-nowrap hidden sm:block">per minute</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-md p-2 text-center mt-2">
                    <div className="font-mono text-green-300 text-sm">
                      Estimated Time: <span className="text-green-400">{estimatedTime} minutes</span>
                    </div>
                    <div className="text-xs text-green-400/70 font-mono">
                      ({totalCommitsToMake} commits at {formData.rateLimit}/minute)
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="batch-size" className="text-green-500 font-mono">Batch_Size</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-green-500/70" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-black/90 border-green-500 text-green-500 font-mono">
                            <p>Number of commits to process in a single batch to improve performance.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Input
                    id="batch-size"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.batchSize}
                    onChange={(e) => updateFormData({ batchSize: parseInt(e.target.value) })}
                    className="bg-black/90 border-green-500/50 focus:border-green-500 text-green-500 font-mono placeholder:text-green-500/40"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="custom-messages" 
                      checked={formData.useCustomMessages}
                      onCheckedChange={(checked) => updateFormData({ useCustomMessages: !!checked })}
                      className="border-green-500/70 data-[state=checked]:bg-green-500 data-[state=checked]:text-black"
                    />
                    <Label htmlFor="custom-messages" className="text-green-500 font-mono cursor-pointer">Use_Custom_Commit_Messages</Label>
                  </div>
                  {formData.useCustomMessages && (
                    <Textarea
                      value={formData.customMessages}
                      onChange={(e) => updateFormData({ customMessages: e.target.value })}
                      placeholder="Enter one commit message per line"
                      className="min-h-[80px] bg-black/90 border-green-500/50 focus:border-green-500 text-green-500 font-mono placeholder:text-green-500/40"
                    />
                  )}
                </div>
              </div>
            </div>

            {!isGenerating && totalCommitsToMake > 200 && (
              <Alert className="bg-yellow-950/20 border-yellow-500/30 text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Large Job Warning</AlertTitle>
                <AlertDescription>
                  You're generating {totalCommitsToMake} commits, which may take {estimatedTime} minutes or more.
                  This will run in your browser and can be resumed if interrupted. For large jobs, we recommend:
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
                    <li>Keep this tab open during the process</li>
                    <li>Increase the rate limit if your connection is stable</li>
                    <li>Use a dedicated repository for these commits</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={isGenerating}
              className="w-full bg-green-600 hover:bg-green-700 text-black font-bold font-mono tracking-wider h-12"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>GENERATING_COMMITS</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>{totalCommitsToMake > 0 ? `EXECUTE_${totalCommitsToMake}_COMMITS` : "EXECUTE_COMMITS"}</span>
                </div>
              )}
            </Button>

            {isGenerating && (
              <ProgressDisplay 
                progress={progress} 
                current={commitsMade} 
                total={totalCommitsToMake} 
                estimatedTimeMinutes={estimatedTime}
                rateLimit={formData.rateLimit}
              />
            )}

            {repoUrl && (
              <Alert className="bg-green-500/10 border-green-500/50">
                <Terminal className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-500 font-mono">Commits Generated Successfully</AlertTitle>
                <AlertDescription className="text-green-400">
                  <div className="mt-2">
                    <Link 
                      href={repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-500 hover:underline"
                    >
                      View Repository <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

