import axiosInstance from "@/utils/axios"
import { CodeReview } from "@/utils/types"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

export interface Developer {
    developer: string
    noOfPRs: number
    noOfProjects: number
    projects: string[]
}

interface ApiResponse<T> {
  status: string
  data: T
}

export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/profile")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const getAllPRs = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/repos-prs")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const getCodeReviews = async (values: CodeReview): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>('/user/review-pr', {
      params: {
        repo: values.repoName,
        pr: values.prNumber,
        prId: values.prId,
        isRetry: values.retry ?? false, // Default to false if undefined
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export const getAllDeveloper = async (): Promise<ApiResponse<Developer[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Developer[]>>("/auth/developers-summary")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}
