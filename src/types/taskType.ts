export type CreateTaskType = {
  taskName: string
  number_of_machine: number
  color?: string
}

export type TaskType = CreateTaskType & {
  _id: string
}
