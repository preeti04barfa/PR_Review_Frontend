import type React from "react"
import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
    title: "Dashboard - Acme Inc",
    description: "Main dashboard with analytics and metrics",
}

export default function PrsPage() {
    const exampleData = [
        {
            id: 1,
            header: "Executive Summary",
            type: "Executive Summary",
            status: "In Progress",
            target: "25%",
            limit: "35%",
            reviewer: "Assign reviewer",
        },
        {
            id: 2,
            header: "Technical Approach",
            type: "Technical Approach",
            status: "Not Started",
            target: "10%",
            limit: "15%",
            reviewer: "Assign reviewer",
        },
    ]

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
                              
                            <DataTable 
                            data={exampleData}
                            title = "PR List" 
                             />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
