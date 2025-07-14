"use client"

import * as React from "react"
import moment from "moment-timezone"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table"

import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconCircleCheckFilled, IconDotsVertical, IconLoader } from "@tabler/icons-react"

import { fetchAllPRs, isAuthenticated } from "@/lib/auth"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GitHubPR {
  id: number
  title?: string
  body?: string
  state?: string
  number?: number
  prDiff?: string
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

interface PRRow {
  id: number
  title: string
  body: string
  pushed_at: string
  developer: string
  state: string
  reviewedStatus: string
  number: number
  prDiff: string
}

function isGitHubPRArray(data: any): data is GitHubPR[] {
  return Array.isArray(data)
}

export default function PrsPage() {
  const router = useRouter()

  const [userPRs, setUserPRs] = React.useState<PRRow[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) {
        router.push("/login")
        return
      }

      const userPRData = await fetchAllPRs()

      if (userPRData && isGitHubPRArray(userPRData)) {
        const mappedPRs: PRRow[] = userPRData.map((pr: GitHubPR) => ({
          id: pr.id,
          title: pr.title ?? "No title",
          body: pr.body ?? "No description",
          pushed_at: pr.head?.repo?.pushed_at ?? "",
          developer: pr.head?.repo?.owner?.login ?? "Unknown",
          state: pr.state ?? "unknown",
          reviewedStatus: "Pending",
          number: pr.number ?? 0,
          prDiff: pr.prDiff ?? ""
        }))
        setUserPRs(mappedPRs)
      } else {
        router.push("/login")
      }
      setLoading(false)
    }

    loadUser()
  }, [router])

  const prColumns: ColumnDef<PRRow>[] = [
    {
      accessorKey: "id",
      header: "PR Id",
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
      accessorKey: "title",
      header: "PR Title",
      cell: ({ row }) => {
        const title = row.original.title
        const truncated = title.length > 15 ? `${title.slice(0, 15)}...` : title

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default">{truncated}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "body",
      header: "PR Description",
      cell: ({ row }) => {
        const body = row.original.body
        const truncated = body.length > 15 ? `${body.slice(0, 15)}...` : body

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default">{truncated}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{body}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "pushed_at",
      header: "Date",
      cell: ({ row }) => {
        const istFormatted = moment(row.original.pushed_at)
          .tz("Asia/Kolkata")
          .format("DD MMM YYYY, hh:mm:ss A")
        return <div className="text-sm">{istFormatted}</div>
      },
    },
    {
      accessorKey: "developer",
      header: "Developer",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.developer}
        </Badge>
      ),
    },
    {
      accessorKey: "state",
      header: "PR Status",
      cell: ({ row }) => {
        const status = row.original.state
        const isOpen = status === "open"
        const isMerged = status === "merged"
        const isClosed = status === "closed"

        return (
          <Badge
            variant="outline"
            className={`px-1.5 ${
              isOpen
                ? "text-green-600 border-green-600"
                : isMerged
                  ? "text-blue-600 border-blue-600"
                  : "text-red-600 border-red-600"
            }`}
          >
            {isOpen && <IconCircleCheckFilled className="w-3 h-3 mr-1 fill-green-500" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "number",
      header: "PR Number",
      cell: ({ row }) => <div className="font-medium">{row.original.number}</div>,
    },
    {
      accessorKey: "reviewedStatus",
      header: "Review Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-orange-600 border-orange-600 px-1.5">
          <IconLoader className="w-3 h-3 mr-1" />
          {row.original.reviewedStatus}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-muted-foreground flex size-8" size="icon">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
           <DropdownMenuItem onClick={() => router.push(`/prs/${row.original.id}`)}>
  View PR
</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Close PR</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {loading ? (
                <div className="p-4 text-center text-sm text-gray-500">Loading user PRs...</div>
              ) : (
                <DataTable<PRRow>
                  data={userPRs}
                  columns={prColumns}
                  title="PR List"
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
