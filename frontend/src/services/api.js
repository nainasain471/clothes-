const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')
const TOKEN_KEY = 'zelia-token'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers)
  if (
    options.body
    && !(options.body instanceof FormData)
    && !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}/api${path}`, {
      ...options,
      headers,
    })
  } catch (cause) {
    const error = new Error(
      'Could not reach the store API. Make sure the Flask backend is running on port 5000.',
      { cause },
    )
    throw error
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(result.error || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  return result
}
