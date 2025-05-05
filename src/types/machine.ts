export interface Machine {
  id: number
  name: string
  code: string
  status: MachineStatus
  currentTask?: {
    id: number
    code: string
    name: string
  }
}
export enum MachineStatus {
  Working = '工作中',
  Idle = '閒置中',
  Maintenance = '維護中',
  Assigned = '已指派',
}