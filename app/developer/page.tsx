"use client"

import * as React from "react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconCircleCheckFilled, IconDotsVertical, IconLoader } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { fetchAllDeveloperList, isAuthenticated } from "@/lib/auth"

interface GitHubDeveloper {
  developer: string
  noOfPRs: number
  noOfProjects: number
  projects?: string[]
}

interface DeveloperRow extends GitHubDeveloper {
  sno: number
}

function isGitHubDeveloperArray(data: any): data is GitHubDeveloper[] {
  return Array.isArray(data) && data.every(item =>
    typeof item === 'object' &&
    typeof item.developer === 'string' &&
    typeof item.noOfPRs === 'number' &&
    typeof item.noOfProjects === 'number'
  )
}

export default function DeveloperPage() {
  const router = useRouter()
  const [developers, setDevelopers] = React.useState<DeveloperRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchDevelopers = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isAuthenticated()) {
        router.push("/login")
        return
      }

      const developerData = await fetchAllDeveloperList()
      console.log("Developer Data:", developerData)

      if (isGitHubDeveloperArray(developerData)) {
        const mappedDevelopers: DeveloperRow[] = developerData.map((dev, index) => ({
          sno: index + 1,
          developer: dev.developer,
          noOfPRs: dev.noOfPRs,
          noOfProjects: dev.noOfProjects,
          projects: dev.projects
        }))
        setDevelopers(mappedDevelopers)
      } else {
        throw new Error("Invalid developer data format")
      }
    } catch (err) {
      console.error("Error fetching developers:", err)
      setError("Failed to load developers. Please try again.")
      toast.error("Failed to load developer list. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDevelopers()
  }, [router])

  const developerColumns: ColumnDef<DeveloperRow>[] = [
    {
      accessorKey: "sno",
      header: "S.No.",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.sno}</div>
      ),
    },
    {
      accessorKey: "developer",
      header: "Developer Name",
      cell: ({ row }) => {
        const developerName = row.original.developer || "Unknown"
        const truncated = developerName.length > 15 ? `${developerName.slice(0, 15)}...` : developerName

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-default">{truncated}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{developerName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
     {
      accessorKey: "developerRating",
      header: "Developer Rating",
      cell: ({ row }) => <div className="font-medium">{0}</div>,
    },
    {
      accessorKey: "noOfPRs",
      header: "No. of PRs",
      cell: ({ row }) => <div className="font-medium">{row.original.noOfPRs ?? 0}</div>,
    },

   {
      accessorKey: "noOfProjects",
      header: "No. of Projects",
      cell: ({ row }) => <div className="font-medium">{row.original.noOfProjects ?? 0}</div>,
    },
    
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-muted-foreground flex size-8" size="icon">
              <IconDotsVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {/* <DropdownMenuItem onClick={() => router.push(`/developer/${row.original.developer}`)}>
              View Developer
            </DropdownMenuItem> */}
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
            {/* <div className="flex justify-end py-2">
              <Button
                variant="outline"
                onClick={fetchDevelopers}
                disabled={loading}
              >
                {loading ? (
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <IconCircleCheckFilled className="mr-2 h-4 w-4" />
                )}
                Refresh Data
              </Button>
            </div> */}
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {loading ? (
                <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center">
                  <IconLoader className="mr-2 h-5 w-5 animate-spin" />
                  Loading developers...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-sm text-red-500">
                  {error}
                </div>
              ) : developers.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No developers found.
                </div>
              ) : (
                <DataTable<DeveloperRow>
                  data={developers}
                  columns={developerColumns}
                  title="Developer List"
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
