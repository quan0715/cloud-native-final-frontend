const baseUrl = import.meta.env.VITE_API_BASE_URL
const taskTypeEndPoint = `${baseUrl}/task-types`
const taskEndPoint = `${baseUrl}/tasks`
import type { TaskType } from '@/types/task'
import type { CreateTask } from '@/types/task'
export async function fetchTaskTypes(): Promise<TaskType[]> {
  try {
    const res = await fetch(taskTypeEndPoint, {
      // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const taskTypeList = (await res.json()) as TaskType[]
    return taskTypeList
  } catch (e) {
    throw new Error(`
      fetchTaskTypes error: ${e}
    `)
  }
}

export async function createTask(task: CreateTask) {
  try {
    const response = await fetch(taskEndPoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTypeId: task.taskTypeId,
        taskName: task.taskName,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`
        createTask error: ${errorBody}
      `)
    }
  } catch (e) {
    throw new Error(`
      createTask error: ${e}
    `)
  }
}
