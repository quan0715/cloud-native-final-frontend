// types/task.ts
export interface Task {
  id: number
  code: string
  name: string
  user: string
  machine: string
  status: TaskStatus
}
export enum TaskStatus {
  Pending = '等待中',
  InProgress = '工作中',
  Done = '已完成',
}
export interface TaskRequirement {
  id: number
  code: string
  type: string
  tags: string[]
}