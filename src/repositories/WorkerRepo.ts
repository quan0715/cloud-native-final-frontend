import type { UserWithTasks } from '@/types/user'
const base = import.meta.env.VITE_API_BASE_URL
const headers = { 'Content-Type': 'application/json' }
const userEndPoint = `${base}/users`

export async function fetchWorkers(): Promise<UserWithTasks[]> {
  try {
    const res = await fetch(`${userEndPoint}/with-tasks`, {
      headers,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as UserWithTasks[]
  } catch (e) {
    throw new Error(`
      fetchWorkers error: ${e}
    `)
  }
}

export async function fetchWorker(username: string): Promise<UserWithTasks> {
  try {
    const res = await fetch(`${userEndPoint}/${username}/with-tasks`, {
      headers,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as UserWithTasks
  } catch (e) {
    throw new Error(`
      fetchWorker error: ${e}
    `)
  }
}
