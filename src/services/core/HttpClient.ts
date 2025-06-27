import axios, {
  type AxiosInstance,
  type AxiosResponse,
  isAxiosError,
} from 'axios'

import HttpClientError from '@errors/HttpClientError'

class HttpClient {
  private readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://staging-ecommerce-api.guicheweb.com.br',
    })
  }

  public async get<T = unknown, S = unknown>({
    params,
    path,
  }: {
    params?: S
    path: string
  }): Promise<AxiosResponse<T>> {
    try {
      const response = await this.instance.get<T>(path, {
        params,
      })
      return response
    } catch (err) {
      if (isAxiosError(err)) {
        throw new HttpClientError({
          body: err.response?.data,
          message: `${err.response?.status} = ${err.response?.statusText}`,
          response: err.response,
        })
      }
      throw new Error('Erro não tratado')
    }
  }

  public async post<T, S = unknown>({
    body,
    path,
  }: {
    body?: S
    path: string
  }): Promise<AxiosResponse<T>> {
    try {
      const response = await this.instance.post<T>(path, body)
      return response
    } catch (err) {
      if (isAxiosError(err)) {
        throw new HttpClientError({
          body: err.response?.data,
          message: `${err.response?.status} = ${err.response?.statusText}`,
          response: err.response,
        })
      }
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Erro não tratado')
    }
  }

  public async put<T, S = unknown, R = unknown>({
    body,
    params,
    path,
  }: {
    body?: S
    params?: R
    path: string
  }): Promise<AxiosResponse<T>> {
    try {
      const response = await this.instance.put<T>(path, body, {
        params,
      })
      return response
    } catch (err) {
      if (isAxiosError(err)) {
        throw new HttpClientError({
          body: err.response?.data,
          message: `${err.response?.status} = ${err.response?.statusText}`,
          response: err.response,
        })
      }
      throw new Error('Erro não tratado')
    }
  }

  public async delete<T, S = unknown>({
    params,
    path,
  }: {
    params?: S
    path: string
  }): Promise<AxiosResponse<T>> {
    try {
      const response = await this.instance.delete<T>(path, {
        params,
      })
      return response
    } catch (err) {
      if (isAxiosError(err)) {
        throw new HttpClientError({
          body: err.response?.data,
          message: `${err.response?.status} = ${err.response?.statusText}`,
          response: err.response,
        })
      }
      throw new Error('Erro não tratado')
    }
  }

  public removeBearerToken(): void {
    this.instance.defaults.headers.common.Authorization = ''
  }

  public setBearerToken(token: string): void {
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  public setDeviceInfo(data: string): void {
    this.instance.defaults.headers.common.FingerPrint = data
  }
}

export default new HttpClient()
