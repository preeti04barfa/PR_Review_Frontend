import { getAllPRs, getCodeReviews, getUserProfile } from "@/services/home.services"
import api from "@/utils/api"
import { CodeReview } from "@/utils/types"

export interface User {
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

export const getAccessToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("access_token")
    }
    return null
}

export const getRefreshToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("refresh_token")
    }
    return null
}

export const getUserData = (): User | null => {
    if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user_data")
        return userData ? JSON.parse(userData) : null
    }
    return null
}

export const removeAuthTokens = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_data")
    }
}

export const fetchUserProfile = async (): Promise<User | null> => {
    const token = getAccessToken()
    if (!token) return null

    try {
          const response: ApiResponse<User> = await getUserProfile()
        if (response.status === 'success') {
          const userData = await response?.data;
            localStorage.setItem("user_data", JSON.stringify(userData))
            return userData
        }
        return null
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return null
    }
}

export const initiateGithubLogin = () => {
    window.location.href = "http://localhost:3019/auth/github/"
    // window.location.href = "https://3zhtd559-3019.inc1.devtunnels.ms/auth/github"
}

export const logout = () => {
    removeAuthTokens()
    window.location.href = "/login"
}

export const isAuthenticated = (): boolean => {
    return !!getAccessToken()
}


export const fetchAllPRs = async (): Promise<User | null> => {
    const token = getAccessToken()
    if (!token) return null

    try {
          const response: ApiResponse<User> = await getAllPRs()
        if (response.status === 'success') {
          const userData = await response?.data;
            localStorage.setItem("user_data", JSON.stringify(userData))
            return userData
        }
        return null
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return null
    }
}


export const fetchCodeReview = async (query: CodeReview): Promise<any> => {
    const token = getAccessToken()
    if (!token) return null

    try {
          const response: ApiResponse<any> = await getCodeReviews(query)
          return response;
    } catch (error) {
        console.error("Error fetching code review:", error)
        return null
    }
}