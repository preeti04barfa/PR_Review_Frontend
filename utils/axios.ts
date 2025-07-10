import axios from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"

// const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

if (!baseURL) {
  throw new Error("Environment variable NEXT_PUBLIC_BACKEND_URL is not defined.")
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_data")
        window.location.href = "/login?error=session_expired"
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
