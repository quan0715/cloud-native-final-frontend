const baseUrl = import.meta.env.VITE_API_BASE_URL
const taskTypeEndPoint = `${baseUrl}/task-types`
const taskEndPoint = `${baseUrl}/tasks`
import type { TaskType, CreateTask, Task, AutoAssignPreview } from '@/types/task'
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

export async function getAllTasks(): Promise<Task[]> {
  const response = await fetch(taskEndPoint, {
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

export async function getDraftTasks(): Promise<Task[]> {
  const response = await fetch(`${taskEndPoint}/draft`, {
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
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

export async function updateTask(taskId: string, taskData: Partial<CreateTask>) {
  try {
    const response = await fetch(`${taskEndPoint}/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`updateTask error: ${response.status} ${errorBody}`)
    }
    // Optionally, return the updated task or a success message
    // const updatedTask = await response.json();
    // return updatedTask;
  } catch (e) {
    // It's good practice to rethrow or handle the error appropriately
    // console.error('updateTask failed:', e);
    throw new Error(`updateTask error: ${e}`)
  }
}

export async function deleteTask(taskId: string) {
  try {
    const response = await fetch(`${taskEndPoint}/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      // Consider different error handling for 404 (Not Found) if needed
      throw new Error(`deleteTask error: ${response.status} ${errorBody}`)
    }
    // DELETE typically doesn't return a body, or returns a success status/message
    // If a specific response is expected, handle it here.
  } catch (e) {
    throw new Error(`deleteTask error: ${e}`)
  }
}

export async function autoAssignTasksPreview(): Promise<AutoAssignPreview[]> {
  const response = await fetch(`${taskEndPoint}/auto-assign-preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const res = (await response.json()) as AutoAssignPreview[]
  return res
}

export async function autoAssignTasks(assignerId: string, previewAssignments: AutoAssignPreview[]) {
  const response = await fetch(`${taskEndPoint}/auto-assign-confirm`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assignerId,
      assignments: previewAssignments.map((item) => ({
        taskId: item.taskId,
        assigneeId: item.previewAssignee?._id,
      })),
    }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}
