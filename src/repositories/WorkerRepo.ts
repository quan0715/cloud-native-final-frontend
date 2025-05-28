import type { UserWithTasks } from '@/types/user'

export async function fetchWorkers(): Promise<UserWithTasks[]> {
  try {
    const base = import.meta.env.VITE_API_BASE_URL // .env 裡設定
    const res = await fetch(`${base}/users/with-tasks`, {
      // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as UserWithTasks[]
  } catch (e) {
    throw new Error(`
      fetchWorkers error: ${e}
    `)
  }
}
