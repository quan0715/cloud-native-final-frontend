import type { Machine } from '@/types/machine'
export async function fetchMachines(): Promise<Machine[]> {
  try {
    const base = import.meta.env.VITE_API_BASE_URL // .env 裡設定
    const res = await fetch(`${base}/machines`, {
      // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as Machine[]
  } catch (e) {
    throw new Error(`
      fetchMachines error: ${e}
    `)
  }
}
