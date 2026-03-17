import axios, { type AxiosInstance } from 'axios'

export const BASE_URL = 'https://api.mblueberry.space'


export const mediaUrl = (url: string): string =>
    url.startsWith('http') ? url : `${BASE_URL}/${url}`


const api: AxiosInstance = axios.create({
  //baseURL: 'http://localhost:8080',
  baseURL: BASE_URL
})


api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api
