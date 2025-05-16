// types/task.ts
import type { ISODate, ObjectId } from './base'
export interface TaskType {
  _id: ObjectId
  taskName: string              // 顯示名稱
  number_of_machine: number     // 需要幾台機器
  createdAt: ISODate
  updatedAt: ISODate
  __v?: number                  // Mongoose 版本號，可忽略
}

export type TaskState = 'draft' | 'assigned' | 'in-progress' | 'success' | 'fail'

export interface TaskData {
  state: TaskState
  /** 被指派者；draft 時為 null */
  assignee_id: ObjectId | null
  /** 機器陣列；尚未指派前為 [] */
  machine: ObjectId[]
  /** 指派時間 */
  assignTime: ISODate | null
  /** 任務開始/結束時間 */
  startTime: ISODate | null
  endTime: ISODate | null
  /** 成功 / 失敗訊息，可為空字串 */
  message?: string
}

export interface Task {
  _id: ObjectId
  taskTypeId: TaskType        // 後端直接帶 TaskType 物件
  taskName: string            // ex: 電性測試-001
  assigner_id: ObjectId | null
  taskData: TaskData
  createdAt: ISODate
  updatedAt: ISODate
  __v?: number
}
