<template>
  <div class="grid grid-cols-3 gap-4 h-full">
    <!-- task dashboard -->
    <div class="flex flex-col space-y-4">
      <TaskSummaryCard
        :total="totalTasks"
        :completed="completedCount"
        :pending="pendingCount"
        class="w-full"
      />
      <TaskRequestList
        @create="onCreateRequest"
        :taskTypes="taskTypes"
        class="w-full flex-1"
      />
    </div>

    <TaskRequestForm
      :visible="showRequestForm"
      :names="TaskNames"
      @submit="handleNewTask"
      @close="showRequestForm = false"
    />

    <!-- task running list -->
    <TaskList :tasks="tasks" />

    <!-- status and workers list -->
    <div class="flex flex-col space-y-4">
      <MachineStatusList :machines="machines" class="w-full h-auto flex-1" />
      <UserAssignmentList :userAssignmentList="userAssignmentList" class="w-full h-auto flex-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MachineStatusList from '@/components/Machine/MachineStatusList.vue'
import TaskList from '@/components/Task/TaskList.vue'
import TaskRequestForm from '@/components/Task/TaskRequestForm.vue'
import TaskRequestList from '@/components/Task/TaskRequestList.vue'
import TaskSummaryCard from '@/components/Task/TaskSummaryCard.vue'
import UserAssignmentList from '@/components/User/UserAssignmentList.vue'
// Value import for component and enum
import type { Machine } from '@/types/machine'
import type { Task, TaskType } from '@/types/task'
import type { User, UserWithTasks } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const users  = ref<User[]>([])
const machines = ref<Machine[]>([])
const taskTypes = ref<TaskType[]>([])
const userAssignmentList = ref<UserWithTasks[]>([])
const tasks = ref<Task[]>([])

const username = localStorage.getItem('token')
if (!username) {
  router.push('/login')
}

function onCreateRequest() {
  // todo: popout
  console.log('create new request')
  showRequestForm.value = true
}

const totalTasks = computed(() => tasks.value.length)

const completedCount = computed(
  () => tasks.value.filter((t: Task) => t.taskData.state == 'success').length,
)
const pendingCount = computed(
  () => tasks.value.filter((t: Task) => t.taskData.state !== 'assigned').length,
)
const TaskNames = computed(() => {
  return taskTypes.value.map((t) => t.taskName)
})
const showRequestForm = ref(false)
function handleNewTask(newTask: { name: string; tags: string[] }) {
  console.log(newTask)
  showRequestForm.value = false
}

const loading = ref(false)
const error   = ref<string | null>(null)
async function fetchUsers() {
  loading.value = true
  error.value   = null

  try {
    const base = import.meta.env.VITE_API_BASE_URL      // .env 裡設定
    const res  = await fetch(`${base}/users`, {                         // 若後端要帶 cookie
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
  error.value   = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL      // .env 裡設定
    const res  = await fetch(`${base}/machines`, {                         // 若後端要帶 cookie
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

async function fetchTaskTypes() {
  loading.value = true
  error.value   = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL      // .env 裡設定
    const res  = await fetch(`${base}/task-types`, {                         // 若後端要帶 cookie
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    taskTypes.value = (await res.json()) as TaskType[]
  } catch (e: any) {
    error.value = e.message ?? 'Unknown error'
  } finally {
    loading.value = false
  }
}
async function fetchTasks() {
  loading.value = true
  error.value   = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL      // .env 裡設定
    const res  = await fetch(`${base}/tasks`, {                         // 若後端要帶 cookie
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
  error.value   = null
  try {
    const base = import.meta.env.VITE_API_BASE_URL      // .env 裡設定
    const res  = await fetch(`${base}/users/with-tasks`, {                         // 若後端要帶 cookie
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
