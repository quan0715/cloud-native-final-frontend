import type { User } from '@/types/user'

const baseUrl = import.meta.env.VITE_API_BASE_URL

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${baseUrl}/users`, {
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as User[]
}

export async function createUser(userData: {
  userName: string
  userRole: string
  taskIds: string[]
}) {
  // 先創建使用者基本資料
  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: userData.userName,
      userRole: userData.userRole,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const newUser = await res.json()

  // 如果是 worker 且有任務類型，則加入任務類型
  if (userData.userRole === 'worker' && userData.taskIds.length > 0) {
    await Promise.all(
      userData.taskIds.map((taskId) =>
        fetch(`${baseUrl}/users/${newUser._id}/add-task-type`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskTypeId: taskId }),
        }),
      ),
    )
  }

  return newUser
}

export async function updateUser(payload: {
  _id: string
  userName: string
  userRole: string
  toAddTaskTypes: string[]
  toRemoveTaskTypes: string[]
}) {
  // 1. 先更新使用者基本資料
  const res = await fetch(`${baseUrl}/users/${payload._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: payload.userName,
      userRole: payload.userRole,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  // 4. 新增任務類型
  await Promise.all(
    payload.toAddTaskTypes.map((taskId) =>
      fetch(`${baseUrl}/users/${payload._id}/add-task-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTypeId: taskId }),
      }),
    ),
  )

  // 5. 移除任務類型
  await Promise.all(
    payload.toRemoveTaskTypes.map((taskId) =>
      fetch(`${baseUrl}/users/${payload._id}/remove-task-type`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTypeId: taskId }),
      }),
    ),
  )
}

export async function deleteUser(userId: string) {
  const res = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
