// Small wrapper around fetch used by every feature.
// The app always calls /api/...; the Vite proxy (dev) or nginx (Docker)
// forwards the request to Bifröst removing the /api prefix.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path, params) {
  const query = new URLSearchParams()
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })
  const qs = query.toString()
  return `${BASE_URL}${path}${qs ? `?${qs}` : ''}`
}

export async function apiRequest(path, { method = 'GET', body, params } = {}) {
  let response
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Cannot reach the Bifröst API. Is the backend running?', 0)
  }

  if (response.status === 204) return null

  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    // Bifröst errors always look like {"message": "..."}.
    // A non-JSON 5xx usually means the proxy could not reach the backend.
    const message =
      data?.message ??
      (response.status >= 500
        ? 'Cannot reach the Bifröst API. Is the backend running?'
        : `Request failed (${response.status})`)
    throw new ApiError(message, response.status)
  }
  return data
}
