"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { fetchAllPRs } from "@/lib/auth"
import moment from "moment-timezone"
import { ChevronDown, ChevronRight } from "lucide-react"

interface DiffFile {
  sha: string
  filename: string
  status: "added" | "modified" | "removed"
  additions: number
  deletions: number
  changes: number
  patch?: string
  blob_url?: string
}

interface PR {
  id: number
  title?: string
  body?: string
  state?: string
  number?: number
  prDiff?: DiffFile[]
  pushed_at?: string
  developer?: string
  head?: {
    repo?: {
      pushed_at?: string
      owner?: {
        login?: string
      }
    }
  }
  user?: {
    login?: string
  }
}

export default function PrDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [pr, setPr] = React.useState<PR | null>(null)
  console.log(pr,"pr");
  
  const [loading, setLoading] = React.useState(true)
  const [diffOpen, setDiffOpen] = React.useState<Record<number, boolean>>({})

  React.useEffect(() => {
    const loadPR = async () => {
      try {
        const allPRs = await fetchAllPRs()
        if (!allPRs || !Array.isArray(allPRs)) {
          console.error("Invalid PR data")
          router.push("/prs")
          return
        }

        const found = allPRs.find((p: PR) => p.id === Number(params.id))
        if (found) {
          setPr(found)

          // Initialize all diffs closed
          const initialDiffs = (found.prDiff ?? []).reduce(
            (acc: Record<number, boolean>, _: DiffFile, index: number) => {
              acc[index] = false
              return acc
            },
            {}
          )
          setDiffOpen(initialDiffs)
        } else {
          router.push("/prs")
        }
      } catch (err) {
        console.error("Error fetching PRs:", err)
        router.push("/prs")
      } finally {
        setLoading(false)
      }
    }

    loadPR()
  }, [params.id, router])

  const toggleDiff = (index: number) => {
    setDiffOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading PR details...
            </div>
          ) : pr ? (
            <>
              <h1 className="text-2xl font-bold mb-4">
                PR #{pr.number}: {pr.title ?? "No title"}
              </h1>
              <p className="mb-2 text-muted-foreground">
                Developer:{" "}
                {pr.head?.repo?.owner?.login ?? pr.developer ?? "Unknown"}
              </p>
              <p className="mb-4 text-muted-foreground">
                Last updated:{" "}
                {pr.head?.repo?.pushed_at
                  ? moment(pr.head.repo.pushed_at)
                      .tz("Asia/Kolkata")
                      .format("DD MMM YYYY, hh:mm:ss A")
                  : pr.pushed_at ?? "N/A"}
              </p>

              <h2 className="text-lg font-semibold mb-2">Files Changed:</h2>
              <div className="p-4 border rounded bg-muted overflow-auto max-h-[700px] space-y-3">
                {Array.isArray(pr.prDiff) && pr.prDiff.length > 0 ? (
                  pr.prDiff.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-3 border rounded bg-white shadow-sm"
                    >
                      {/* Filename & Status */}
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm text-blue-600">
                          {file.filename}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              file.status === "added"
                                ? "bg-green-100 text-green-800"
                                : file.status === "removed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {file.status.charAt(0).toUpperCase() +
                              file.status.slice(1)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleDiff(index)}
                          >
                            {diffOpen[index] ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Summary Counts */}
                      <div className="flex gap-4 text-sm mt-2">
                        <span className="text-green-600">
                          ➕ {file.additions} additions
                        </span>
                        <span className="text-red-600">
                          ➖ {file.deletions} deletions
                        </span>
                        <span className="text-gray-600">
                          ✨ {file.changes} total
                        </span>
                      </div>

                      {/* GitHub Link (optional) */}
                      {file.blob_url && (
                        <a
                          href={file.blob_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline mt-1"
                        >
                          View on GitHub
                        </a>
                      )}

                      {/* Conditional Diff Section */}
                      {diffOpen[index] && file.patch ? (
                        <pre className="mt-3 rounded overflow-auto border text-sm font-mono">
                          {file.patch.split("\n").map((line, i) => {
                            let lineClass = ""

                            if (line.startsWith("+") && !line.startsWith("+++"))
                              lineClass = "bg-green-50 text-green-800"
                            else if (
                              line.startsWith("-") &&
                              !line.startsWith("---")
                            )
                              lineClass = "bg-red-50 text-red-800"
                            else lineClass = "bg-gray-50 text-gray-800"

                            return (
                              <div
                                key={i}
                                className={`flex gap-2 px-2 py-0.5 whitespace-pre-wrap ${lineClass}`}
                              >
                                <span className="w-6 text-gray-400 select-none">
                                  {i + 1}
                                </span>
                                <span>{line}</span>
                              </div>
                            )
                          })}
                        </pre>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    No file changes found.
                  </div>
                )}
              </div>

              <Button className="mt-4" onClick={() => router.back()}>
                Back to PR List
              </Button>
            </>
          ) : (
            <div className="text-center text-red-500">PR not found</div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
