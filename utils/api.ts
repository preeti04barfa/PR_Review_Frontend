// import AxiosInstance from "./axios"
import type { AxiosRequestConfig, AxiosResponse } from "axios"
import axiosInstance from "./axios";

class ApiServices {
  async doPost<T = any>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<{ data: T; status: number }> {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      ...config,
    })
    return { data: response.data, status: response.status }
  }

  async doGet<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<{ data: T; status: number }> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config)
    return { data: response.data, status: response.status }
  }
}

const api = new ApiServices()
export default api
