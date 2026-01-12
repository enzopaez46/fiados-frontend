const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  //console.log('API FETCH TO:', `${API_URL}${endpoint}`)
  //console.log('OPTIONS:', options)
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.detail || 'API Error')
  }

  return res.json()
}


