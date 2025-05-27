<template>
  <div class="w-full h-full flex flex-col justify-start items-start p-4 gap-4">
    <div class="w-full flex flex-row justify-between items-center gap-2">
      <h1 class="w-fit text-3xl font-thin"><span class="text-blue-600">LAB 11</span> / 歡迎回來</h1>
      <div class="flex flex-row justify-end items-center gap-2">
        <AddDraftButton @create="onTaskCreate" />
        <Button> 自動指派 </Button>
      </div>
    </div>
    <Separator orientation="horizontal" />
    <div class="w-full grid grid-cols-3 gap-4 h-full">
      <!-- task dashboard -->
      <div class="flex flex-col space-y-4">
        <TaskSummaryCard
          :total="totalTasks"
          :completed="assignedCount"
          :pending="pendingCount"
          class="w-full min-h-1/3 flex-1"
        />
        <TaskList
          :tasks="assignedTask"
          :taskType="taskTypes"
          :is-draft="false"
          class="w-full h-auto flex-2"
        />
      </div>

      <!-- task running list -->
      <!-- Skeleton 區 -->

      <TaskList
        :tasks="draftTask"
        :taskType="taskTypes"
        :is-draft="true"
        class="w-full h-auto flex-1"
      />

      <!-- status and workers list -->
      <div class="flex flex-col space-y-4">
        <MachineStatusList :machines="machines" class="w-full h-auto flex-1" />
        <UserAssignmentList :userAssignmentList="userAssignmentList" class="w-full h-auto flex-1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MachineStatusList from '@/components/Machine/MachineStatusList.vue'
import TaskList from '@/views/Dashboard/TaskList.vue'
import TaskSummaryCard from '@/views/Dashboard/TaskSummaryCard.vue'
import UserAssignmentList from '@/components/User/UserAssignmentList.vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import AddDraftButton from '@/views/Dashboard/AddDraftButton.vue'
// Value import for component and enum
import type { Machine } from '@/types/machine'
import type { Task, TaskType } from '@/types/task'
import type { User, UserWithTasks } from '@/types/user'
import type { Ref } from 'vue'
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchTaskTypes } from '@/repositories/taskRepo'
const router = useRouter()

const users = ref<User[]>([])
const machines = ref<Machine[]>([])
const taskTypes = ref<TaskType[]>([])
const userAssignmentList = ref<UserWithTasks[]>([])
const tasks = ref<Task[]>([])
const loading = inject<Ref<boolean>>('globalLoading')!
const username = localStorage.getItem('token')
if (!username) {
  router.push('/login')
}

const draftTask = computed(() => {
  return tasks.value.filter((t: Task) => t.taskData.state === 'draft')
})

const assignedTask = computed(() => {
  console.log('assignedTask:', tasks.value)
  return tasks.value.filter((t: Task) => t.taskData.state != 'draft')
})

const totalTasks = computed(() => tasks.value.length)

const assignedCount = computed(
  () => tasks.value.filter((t: Task) => t.taskData.state == 'assigned').length,
)
const pendingCount = computed(
  () => tasks.value.filter((t: Task) => t.taskData.state !== 'assigned').length,
)

const error = ref<string | null>(null)
async function fetchUsers() {
  loading.value = true
  error.value = null

  try {
    const base = import.meta.env.VITE_API_BASE_URL // .env 裡設定
    const res = await fetch(`${base}/users`, {
      // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    users.value = (await res.json()) as User[]
  } catch (e: any) {
    error.value = e.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
}

async function fetchMachines() {
  loading.value = true
  error.value = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL // .env 裡設定
    const res = await fetch(`${base}/machines`, {
      // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    machines.value = (await res.json()) as Machine[]
  } catch (e: any) {
    error.value = e.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
}

async function fetchTasks() {
  loading.value = true
  error.value = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL // .env 裡設定
    const res = await fetch(`${base}/tasks`, {
      // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    tasks.value = (await res.json()) as Task[]
  } catch (e: any) {
    error.value = e.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
}
async function fetchUserAssignmentList() {
  loading.value = true
  error.value = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL // .env 裡設定
    const res = await fetch(`${base}/users/with-tasks`, {
      // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    userAssignmentList.value = (await res.json()) as UserWithTasks[]
  } catch (e: any) {
    error.value = e.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
}

async function onTaskCreate() {
  await fetchTasks()
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([
      fetchUsers(),
      fetchMachines(),
      fetchTaskTypes(),
      fetchTasks(),
      fetchUserAssignmentList(),
    ])
  } catch (e: any) {
    error.value = e.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
  console.log('fetch users:', users.value)
  console.log('fetch machines:', machines.value)
  console.log('fetch task types:', taskTypes.value)
  console.log('fetch tasks:', tasks.value)
  console.log('fetch user assignment list:', userAssignmentList.value)
})
</script>
