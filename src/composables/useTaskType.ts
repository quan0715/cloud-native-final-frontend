import { ref } from 'vue'
import { type TaskType } from '@/types/taskType'
import { fetchTaskTypes as fetchTaskTypesApi } from '@/repositories/taskRepo'

const taskTypes = ref<TaskType[]>([])
const isLoading = ref(false)

export const useTaskType = () => {
  const fetchTaskTypes = async () => {
    isLoading.value = true
    try {
      const res = await fetchTaskTypesApi()
      taskTypes.value = res
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  return { taskTypes, isLoading, fetchTaskTypes }
}
