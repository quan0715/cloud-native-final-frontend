<template>
  <div class="flex flex-col justify-center items-center p-12">
    <div class="max-w-5xl w-full flex flex-col justify-start items-start gap-4">
      <h1 class="w-fit text-3xl font-thin">
        <span class="text-blue-600">LAB 11</span> / {{ username }} 歡迎回來
      </h1>
      <div class="w-full grid grid-cols-3 gap-4">
        <UserWeaklyReview class="col-span-1" :total="totalTasks" :completed="completedTasks" />
        <InprogressTaskCard
          class="col-span-2"
          :inprogress-task="inprogressTask"
          @taskStarted="fetchWorker"
          @taskCompleted="fetchWorker"
          @taskFailed="fetchWorker"
        />
      </div>
      <Separator />

      <h1 class="w-fit text-2xl font-thin">已指派（待完成）</h1>
      <div class="w-full col-span-3">
        <div class="w-full grid grid-cols-3 gap-4">
          <TaskSnapShotCard v-for="task in userTasks?.assignedTasks" :key="task._id" :task="task" />
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
import { computed, inject, onMounted, ref } from 'vue'
import { fetchWorkers as fetchWorkersFromRepo } from '@/repositories/WorkerRepo'
import TaskSnapShotCard from '@/components/Task/TaskSnapShotCard.vue'
import { Separator } from '@/components/ui/separator'

const { username } = useUserData()

const loading = inject<Ref<boolean>>('globalLoading')!
const error = ref<string | null>(null)
const userTasks = ref<UserWithTasks | undefined>()

/* ---------------- 取後端資料 ---------------- */
async function fetchWorker() {
  loading.value = true
  error.value = null
  try {
    const workers = await fetchWorkersFromRepo()
    userTasks.value = workers.find((w) => w.userName === username)
    console.log('userTasks', userTasks.value)
  } catch (e) {
    error.value = e as string
  } finally {
    loading.value = false
  }
}

onMounted(fetchWorker)

/* ---------------- 統計數量 (computed) ---------------- */
const inprogressTask = computed(() => {
  if (!userTasks.value?.inProgressTasks) return null
  return userTasks.value.inProgressTasks[0]
})
const totalTasks = computed(() => {
  const u = userTasks.value
  if (!u) return -1
  return u.assignedTasks.length + u.inProgressTasks.length + u.completedTasks.length
})

const completedTasks = computed(() => {
  const u = userTasks.value
  return u ? u.completedTasks.length : -1
})
</script>
