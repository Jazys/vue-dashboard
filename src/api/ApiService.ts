import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { useRequestStore } from '../store/request'

// const API_URL = 'http://127.0.0.1:8000'
const API_URL = 'https://api.v1.buyingsignal.io/webhook'

class ApiService {
  private axios: AxiosInstance

  private requestStore: any

  constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.initializeRequestInterceptor()
  }

  public init() {
    this.requestStore = useRequestStore()
  }

  private initializeRequestInterceptor() {
    this.axios.interceptors.request.use((config: any) => {
      config.headers = config.headers || {}
      if (this.requestStore)
        this.requestStore.startLoading()
      // Ajoutez votre logique pour obtenir le token ici
      const token = localStorage.getItem('bearer-token')
      if (token)
        config.headers.Authorization = `Bearer ${token}`

      return config
    }, (error: any) => {
      if (this.requestStore)
        this.requestStore.stopLoading()
      return Promise.reject(error)
    })
  }

  get<T>(resource: string, params?: Record<string, any>): Promise<T> {
    return this.axios.get<T>(resource, { params }).then((response: { data: any }) => response.data)
  }

  post<T>(resource: string, data: any): Promise<T> {
    return this.axios.post<T>(resource, data).then((response: { data: any }) => response.data)
  }

  patch<T>(resource: string, data: any): Promise<T> {
    return this.axios.patch<T>(resource, data).then((response: { data: any }) => response.data)
  }
}

export default new ApiService()
