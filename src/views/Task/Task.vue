<template>
  <div class="flex flex-col justify-center items-center p-12">
    <div class="max-w-5xl w-full flex flex-col justify-start items-start gap-4">
      <h1 class="w-fit text-3xl font-thin">
        <span class="text-blue-600">LAB 11</span> / {{ username }} 歡迎回來
      </h1>
      <div class="w-full grid grid-cols-3 gap-4">
        <UserWeaklyReview class="col-span-1"
        :total="totalTasks"
        :completed="completedTasks"
        />
        <InprogressTaskCard class="col-span-2" :inprogress-task="userTasks?.inProgressTasks || []" />
        <AssignedTaskCard class="col-span-3" :assigned-task="userTasks?.assignedTasks || []"  />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserData } from '@/composables/useUserData'
import type { UserWithTasks } from '@/types/user'
import AssignedTaskCard from '@/views/Task/AssignedTaskCard.vue'
import InprogressTaskCard from '@/views/Task/InprogressTaskCard.vue'
import UserWeaklyReview from '@/views/Task/UserWeaklyReview.vue'
import type { Ref } from 'vue'
import { computed, inject, onMounted, ref } from 'vue'

const { username } = useUserData()

const loading = inject<Ref<boolean>>('globalLoading')!
const error       = ref<string | null>(null)
const usersTasks  = ref<UserWithTasks[]>([])
const userTasks   = ref<UserWithTasks | undefined>()

/* ---------------- 取後端資料 ---------------- */
async function fetchUsers() {
  loading.value = true
  error.value   = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL
    const res  = await fetch(`${base}/users/with-tasks`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    usersTasks.value = (await res.json()) as UserWithTasks[]
    userTasks.value  = usersTasks.value.find(u => u._id === username)
  } catch (e: any) {
    error.value = e.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

/* ---------------- 統計數量 (computed) ---------------- */
const totalTasks = computed(() => {
  const u = userTasks.value
  if (!u) return -1
  return (
    u.assignedTasks.length +
    u.inProgressTasks.length +
    u.completedTasks.length
  )
})

const completedTasks = computed(() => {
  const u = userTasks.value
  return u ? u.completedTasks.length : -1
})

</script>
