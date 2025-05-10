const baseUrl = import.meta.env.VITE_API_BASE_URL
const authEndPoint = `${baseUrl}/auth`

export interface LoginRequest {
  id: string
  password: string
}

export interface LoginResponse {
  token: string
  role: string
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${authEndPoint}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`登入失敗 ${data.message}`)
    }
    return {
      token: data.token,
      role: data.role,
    }
  } catch (error) {
    throw new Error(`登入失敗 ${error}`)
  }
}
