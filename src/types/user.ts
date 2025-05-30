import type { ISODate, ObjectId } from './base'
import type { Task, TaskType } from './task'

export enum UserRole {
  Admin = 'admin',
  Leader = 'leader',
  Worker = 'worker',
}
export interface User {
  _id: ObjectId
  userName: string
  userRole: UserRole
  /** 已通過雜湊處理的密碼；前端通常不需要 */
  passwordValidate?: string
  /** 使用者可執行的任務類型（後端會帶完整 TaskType 物件） */
  user_task_types: TaskType[]
  createdAt: ISODate
  updatedAt: ISODate
  __v?: number
}
export enum UserStatus {
  Working = '工作中',
  Idle = '閒置中',
  Assigned = '已指派',
}

export interface TaskSnapshot {
  _id: ObjectId
  taskName: string
  state: TaskSnapshotState
  taskType?: { taskName: string; color?: string }
  machine?: { machineName: string }[]
}

export type TaskSnapshotState = 'assigned' | 'in-progress' | 'success' | 'fail'

export interface UserWithTasks {
  _id: ObjectId
  userName: string
  user_task_types: TaskType[]
  userRole: UserRole
  assignedTasks: Task[]
  inProgressTasks: Task[]
  completedTasks: Task[]
}
