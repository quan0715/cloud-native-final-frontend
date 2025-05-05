export interface UserAssignment {
  id: number
  name: string
  status: UserStatus
  task?: string
}
export enum UserStatus {
  Working = '工作中',
  Idle = '閒置中',
  Assigned = '已指派',
}