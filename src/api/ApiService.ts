import type { AxiosInstance } from 'axios'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000'

class ApiService {
  private axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.initializeRequestInterceptor()
  }

  private initializeRequestInterceptor() {
    this.axios.interceptors.request.use((config: { headers: { Authorization: string } }) => {
      // Ajoutez votre logique pour obtenir le token ici
      const token = localStorage.getItem('bearer-token')
      console.log(token)
      if (token)
        config.headers.Authorization = `Bearer ${token}`

      return config
    }, (error: any) => {
      return Promise.reject(error)
    })
  }

  get<T>(resource: string): Promise<T> {
    return this.axios.get<T>(resource).then((response: { data: any }) => response.data)
  }

  post<T>(resource: string, data: any): Promise<T> {
    return this.axios.post<T>(resource, data).then((response: { data: any }) => response.data)
  }
}

export default new ApiService()
