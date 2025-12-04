import axios from 'axios'
import * as Sentry from '@sentry/tanstackstart-react'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error, {
      contexts: {
        axios: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          status: error.response?.status,
          statusText: error.response?.statusText,
        },
      },
      tags: {
        errorType: 'http_error',
      },
    })
    
    return Promise.reject(error)
  }
)