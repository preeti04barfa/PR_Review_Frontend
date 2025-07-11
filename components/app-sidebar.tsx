"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getUserData, fetchUserProfile, isAuthenticated, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userProfile, setUserProfile] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const pathname = usePathname()
  console.log(pathname,"pathname");
  
  const data = React.useMemo(
    () => ({
      user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
         {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconDashboard,
          isActive: pathname === "/dashboard" || pathname === "/", 
        },
        {
          title: "PRs",
          url: "/prs",
          icon: IconListDetails,
          isActive: pathname === "/prs",
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: IconChartBar,
          isActive: pathname === "/analytics",
        },
        {
          title: "Projects",
          url: "/projects",
          icon: IconFolder,
          isActive: pathname === "/projects",
        },
        {
          title: "Team",
          url: "/team",
          icon: IconUsers,
          isActive: pathname === "/team",
        },
      ],
      navClouds: [
        {
          title: "Capture",
          icon: IconCamera,
          isActive: pathname.startsWith("/capture"),
          url: "/capture",
          items: [
            {
              title: "Active Proposals",
              url: "/capture/active",
              isActive: pathname === "/capture/active",
            },
            {
              title: "Archived",
              url: "/capture/archived",
              isActive: pathname === "/capture/archived",
            },
          ],
        },
        {
          title: "Proposal",
          icon: IconFileDescription,
          url: "/proposal",
          isActive: pathname.startsWith("/proposal"),
          items: [
            {
              title: "Active Proposals",
              url: "/proposal/active",
              isActive: pathname === "/proposal/active",
            },
            {
              title: "Archived",
              url: "/proposal/archived",
              isActive: pathname === "/proposal/archived",
            },
          ],
        },
        {
          title: "Prompts",
          icon: IconFileAi,
          url: "/prompts",
          isActive: pathname.startsWith("/prompts"),
          items: [
            {
              title: "Active Proposals",
              url: "/prompts/active",
              isActive: pathname === "/prompts/active",
            },
            {
              title: "Archived",
              url: "/prompts/archived",
              isActive: pathname === "/prompts/archived",
            },
          ],
        },
      ],
      navSecondary: [
        {
          title: "Settings",
          url: "/settings",
          icon: IconSettings,
          isActive: pathname === "/settings",
        },
        {
          title: "Get Help",
          url: "/help",
          icon: IconHelp,
          isActive: pathname === "/help",
        },
        {
          title: "Search",
          url: "/search",
          icon: IconSearch,
          isActive: pathname === "/search",
        },
      ],
      documents: [
        {
          name: "Data Library",
          url: "/data-library",
          icon: IconDatabase,
          isActive: pathname === "/data-library",
        },
        {
          name: "Reports",
          url: "/reports",
          icon: IconReport,
          isActive: pathname === "/reports",
        },
        {
          name: "Word Assistant",
          url: "/word-assistant",
          icon: IconFileWord,
          isActive: pathname === "/word-assistant",
        },
      ],
    }),
    [pathname],
  )

  React.useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) {
        router.push("/login")
        return
      }

      let userData = getUserData()
      if (!userData) {
        userData = await fetchUserProfile()
      }

      if (userData) {
        setUserProfile(userData)
      } else {
        router.push("/login")
      }
      setLoading(false)
    }

    loadUser()
  }, [router])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {userProfile ? (
          <NavUser user={userProfile} />
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            {loading ? "Loading user..." : "User data not available"}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
