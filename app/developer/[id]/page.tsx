// "use client"

// import * as React from "react"
// import { useParams, useRouter } from "next/navigation"
// import { AppSidebar } from "@/components/app-sidebar"
// import { SiteHeader } from "@/components/site-header"
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
// import { Button } from "@/components/ui/button"
// import { fetchAllDeveloperList } from "@/lib/auth"

// interface Developer {
//   developer: string
//   noOfPRs: number
//   noOfProjects: number
//   projects: string[]
// }

// export default function DeveloperDetailPage() {
//   const router = useRouter()
//   const params = useParams<{ id: string }>()
//   const [developerData, setDeveloperData] = React.useState<Developer | null>(null)
//   const [loading, setLoading] = React.useState(true)
//   const [error, setError] = React.useState<string | null>(null)

//   React.useEffect(() => {
//     const loadDeveloper = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         const allDevelopers = await fetchAllDeveloperList()
//         if (!allDevelopers || !Array.isArray(allDevelopers)) {
//           console.error("Invalid developer data")
//           setError("Failed to load developer data")
//           router.push("/developers")
//           return
//         }

//         const found = allDevelopers.find((dev: Developer) => dev.developer === params.id)
//         if (found) {
//           setDeveloperData(found)
//         } else {
//           setError(`Developer "${params.id}" not found`)
//           router.push("/developers")
//         }
//       } catch (err) {
//         console.error("Error fetching developers:", err)
//         setError("Failed to load developer data")
//         router.push("/developers")
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadDeveloper()
//   }, [params.id, router])

//   return (
//     <SidebarProvider>
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col p-6">
//           {loading ? (
//             <div className="text-center text-muted-foreground">
//               Loading developer details...
//             </div>
//           ) : error ? (
//             <div className="text-center text-red-500">{error}</div>
//           ) : developerData ? (
//             <>
//               <h1 className="text-2xl font-bold mb-4">
//                 Developer: {developerData.developer}
//               </h1>
//               <h2 className="text-lg font-semibold mb-2">Projects:</h2>
//               <div className="p-4 border rounded bg-muted max-h-[700px] overflow-auto">
//                 {Array.isArray(developerData.projects) && developerData.projects.length > 0 ? (
//                   <ul className="space-y-2">
//                     {developerData.projects.map((project, index) => (
//                       <li key={index} className="text-sm font-mono text-blue-600">
//                         {project}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="text-muted-foreground">No projects found.</div>
//                 )}
//               </div>
//               <Button className="mt-4" onClick={() => router.back()}>
//                 Back to Developer List
//               </Button>
//             </>
//           ) : (
//             <div className="text-center text-red-500">Developer not found</div>
//           )}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }