"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github } from "lucide-react"
import { isAuthenticated, initiateGithubLogin } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard")
      return
    }

    const errorParam = searchParams.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "missing_tokens":
          setError("Authentication tokens are missing. Please try again.")
          break
        case "profile_failed":
          setError("Failed to fetch user profile. Please try again.")
          break
        case "callback_failed":
          setError("Authentication callback failed. Please try again.")
          break
        default:
          setError("An authentication error occurred. Please try again.")
      }
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>Sign in with your GitHub account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={initiateGithubLogin} className="w-full" size="lg">
            <Github className="mr-2 h-5 w-5" />
            Login with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
