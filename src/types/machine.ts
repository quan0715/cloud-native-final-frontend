
import type { ISODate, ObjectId } from './base'
import type { TaskType } from './task'

// export type MachineStatus = 'in-use' | 'idle' | 'maintenance' | 'assigned'
export enum MachineStatus {
  Working = '工作中',
  Idle = '閒置中',
  Maintenance = '維護中',
  Assigned = '已指派',
}


export type MachineState = 'in-progress' | 'idle' | 'maintenance' | 'assigned'

export interface Machine {
  _id: ObjectId
  machineName: string
  machine_task_types: TaskType[]
  status: MachineState
  createdAt: ISODate
  updatedAt: ISODate
  __v?: number
}
