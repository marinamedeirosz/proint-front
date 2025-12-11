const TOKEN_KEY = 'authToken'
const USER_KEY = 'user'

const isBrowser = typeof window !== 'undefined'

interface User {
  id: string
  email: string
  name: string
}

export const auth = {
  setToken: (token: string) => {
    if (isBrowser) {
      localStorage.setItem(TOKEN_KEY, token)
    }
  },

  getToken: (): string | null => {
    if (isBrowser) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  },

  removeToken: () => {
    if (isBrowser) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  },

  isAuthenticated: (): boolean => {
    if (isBrowser) {
      return !!localStorage.getItem(TOKEN_KEY)
    }
    return false
  },

  getAuthHeaders: (): HeadersInit => {
    const token = auth.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  },

  setUser: (user: User) => {
    if (isBrowser) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  },

  getUser: (): User | null => {
    if (isBrowser) {
      const user = localStorage.getItem(USER_KEY)
      return user ? JSON.parse(user) : null
    }
    return null
  },

  removeUser: () => {
    if (isBrowser) {
      localStorage.removeItem(USER_KEY)
    }
  },
}

export const sessionAuth = {
  setToken: (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token)
  },

  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY)
  },

  removeToken: () => {
    sessionStorage.removeItem(TOKEN_KEY)
  },

  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem(TOKEN_KEY)
  },

  getAuthHeaders: (): HeadersInit => {
    const token = sessionAuth.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  },
}

export const cookieAuth = {
  setToken: (token: string, days: number = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${TOKEN_KEY}=${token};expires=${expires.toUTCString()};path=/;SameSite=Strict`
  },

  getToken: (): string | null => {
    const name = TOKEN_KEY + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookies = decodedCookie.split(';')

    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length)
      }
    }
    return null
  },

  removeToken: () => {
    document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  },

  isAuthenticated: (): boolean => {
    return !!cookieAuth.getToken()
  },

  getAuthHeaders: (): HeadersInit => {
    const token = cookieAuth.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  },
}