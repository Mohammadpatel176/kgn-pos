import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.kgnmotors.com/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});


interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const apiService = {

  get: async <T>(url: string, params?: object): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, { params });
    return response.data;
  },

  // POST Request
  post: async <T>(url: string, data: object): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data);
    return response.data;
  },

  // PUT Request
  put: async <T>(url: string, data: object): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data);
    return response.data;
  },

  // DELETE Request
  delete: async <T>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url);
    return response.data;
  },
};