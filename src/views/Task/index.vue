<template>
  <div class="flex flex-col justify-center items-center p-12">
    <div class="max-w-5xl w-full flex flex-col justify-start items-start gap-4">
      <h1 class="w-fit text-3xl font-thin">
        <span class="text-blue-600">LAB 11</span> / {{ username }} 歡迎回來
      </h1>
      <div class="w-full grid grid-cols-3 gap-4">
        <UserWeaklyReview
          class="col-span-1"
          :total="workerWeaklyReview?.total ?? 0"
          :completed="workerWeaklyReview?.completed ?? 0"
          :toDayNewTaskCount="workerWeaklyReview?.toDayNewTaskCount ?? 0"
          :toDayCompletedTaskCount="workerWeaklyReview?.toDayCompletedTaskCount ?? 0"
          :averageTaskTime="workerWeaklyReview?.averageTaskTime ?? 0"
        />
        <InprogressTaskCard
          class="col-span-2"
          :inprogress-task="inProgressTask ?? null"
          @taskStarted="fetchWorker"
          @taskCompleted="fetchWorker"
          @taskFailed="fetchWorker"
        />
      </div>
      <Separator />

      <h1 class="w-fit text-2xl font-thin">已指派（待完成）</h1>
      <div class="w-full col-span-3">
        <div class="w-full grid grid-cols-3 gap-4">
          <TaskCard v-for="task in userTasks?.assignedTasks" :key="task._id" :task="task" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserData } from '@/composables/useUserData'
import type { UserWithTasks } from '@/types/user'
import InprogressTaskCard from '@/views/Task/InprogressTaskCard.vue'
import UserWeaklyReview from '@/views/Task/UserWeaklyReview.vue'
import type { Ref } from 'vue'
import { inject, onMounted, ref } from 'vue'
import { fetchWorker as fetchWorkerFromRepo } from '@/repositories/WorkerRepo'
import { Separator } from '@/components/ui/separator'
import type { Task } from '@/types/task'
import TaskCard from '@/components/Task/TaskCard.vue'
import { getWorkerWeaklyReview } from '@/repositories/taskRepo'

const { username, userId } = useUserData()

const loading = inject<Ref<boolean>>('globalLoading')!
const error = ref<string | null>(null)
const userTasks = ref<UserWithTasks | undefined>()
const inProgressTask = ref<Task | null>()
const workerWeaklyReview = ref()

/* ---------------- 取後端資料 ---------------- */
async function fetchWorker() {
  loading.value = true
  error.value = null
  inProgressTask.value = null
  try {
    const res = await fetchWorkerFromRepo(userId)
    console.log(res)
    const inProgress = res.inProgressTasks[0]
    if (inProgress) {
      inProgressTask.value = inProgress
    }
    userTasks.value = res
    workerWeaklyReview.value = await getWorkerWeaklyReview(userId)
    console.log(workerWeaklyReview.value)
  } catch (e) {
    error.value = e as string
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchWorker()
})
</script>
