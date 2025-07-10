"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

interface ApiResponse<T> {
  status: string
  data: T
}

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<string>("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuth = async (): Promise<void> => {
      try {
        const token = searchParams.get("token")
        const refresh = searchParams.get("refresh")

        if (!token || !refresh) {
          setError("Missing authentication tokens")
          setTimeout(() => {
            router.push("/login?error=missing_tokens")
          }, 2000)
          return
        }

        // Store tokens first
        localStorage.setItem("access_token", token)
        localStorage.setItem("refresh_token", refresh)

        setStatus("fetching_profile")

        // Make the API call with the token directly
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse<User> = await response.json()

        if (data?.status === "success") {
          const userData: User = data.data
          localStorage.setItem("user_data", JSON.stringify(userData))
          setStatus("success")

          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        } else {
          throw new Error("Failed to fetch user profile")
        }
      } catch (error: unknown) {
        console.error("Auth callback error:", error)
        const errorMessage = error instanceof Error ? error.message : "Authentication failed"
        setError(errorMessage)

        setTimeout(() => {
          router.push("/login?error=callback_failed")
        }, 2000)
      }
    }

    handleAuth()
  }, [router, searchParams])

  const getStatusMessage = (): string => {
    switch (status) {
      case "loading":
        return "Initializing authentication..."
      case "fetching_profile":
        return "Fetching your profile..."
      case "success":
        return "Authentication successful! Redirecting..."
      default:
        return "Authenticating..."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        {!error ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
            <p className="text-gray-600">{getStatusMessage()}</p>
            <div className="mt-4 text-sm text-gray-500">
              Status: <span className="font-mono">{status}</span>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Authentication Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  )
}
