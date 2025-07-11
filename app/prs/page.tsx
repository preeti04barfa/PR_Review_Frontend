"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { fetchAllPRs, isAuthenticated } from "@/lib/auth"
import { useRouter } from "next/navigation"



export default function PrsPage() {
  const router = useRouter()

  const [userPRs, setUserPRs] = React.useState<PRRow[]>([])
  const [loading, setLoading] = React.useState(true)

interface GitHubPR {
  id: number;
  title?: string;
  body?: string;
  state?: string;
  number?: number;
  prDiff?: string;
  head?: {
    repo?: {
      pushed_at?: string;
      owner?: {
        login?: string;
      };
    };
  };
  user?: {
    login?: string;
  };
}

interface PRRow {
  id: number;
  title: string;
  body: string;
  pushed_at: string;
  developer: string;
  state: string;
  reviewedStatus: string;
  number: number;
  prDiff: string;
}

function isGitHubPRArray(data: any): data is GitHubPR[] {
  return Array.isArray(data);
}

React.useEffect(() => {
  const loadUser = async () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const userPRData = await fetchAllPRs();

    if (userPRData && isGitHubPRArray(userPRData)) {
      const mappedPRs: PRRow[] = userPRData.map((pr: GitHubPR) => ({
        id: pr.id,
        title: pr.title ?? "No title",
        body: pr.body ?? "No description",
        pushed_at: new Date(pr.head?.repo?.pushed_at ?? "").toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        developer: pr.head?.repo?.owner?.login ?? "Unknown",
        state: pr.state ?? "unknown",
        reviewedStatus: "Pending",
        number: pr.number ?? 0,
        prDiff: pr.prDiff ?? ""
      }));
      setUserPRs(mappedPRs);
    } else {
      router.push("/login");
    }
    setLoading(false);
  };

  loadUser();
}, [router]);


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {loading ? (
                <div className="p-4 text-center text-sm text-gray-500">Loading user PRs...</div>
              ) : (
                <DataTable data={userPRs} title="PR List" />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
