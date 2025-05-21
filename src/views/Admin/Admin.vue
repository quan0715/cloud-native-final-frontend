<template>
  <div class="flex flex-col justify-center items-center p-12">
    <div class="max-w-screen-lg w-full flex flex-col justify-start items-start gap-4">
      <h1 class="w-fit text-3xl font-thin">
        <span class="text-blue-600">LAB 11</span> / QUAN / {{ currentTab }}
      </h1>
      <DashboardCard title="Admin Dashboard" class="w-full">
        <Tabs v-model="currentTab" class="w-full p-0 m-0">
          <TabsList>
            <TabsTrigger value="使用者管理" :class="tabTriggerClass"> 使用者管理 </TabsTrigger>
            <TabsTrigger value="機器管理" :class="tabTriggerClass"> 機器管理 </TabsTrigger>
            <TabsTrigger value="任務類型管理" :class="tabTriggerClass"> 任務類型管理 </TabsTrigger>
          </TabsList>
          <TabsContent value="使用者管理"> <UserManageTab :users="users" :taskTypes="taskTypes" @update="handleUserUpdate" @delete="handleUserDelete"   /> </TabsContent>
          <TabsContent value="機器管理"> <MachineManageTab :machines="machines" :taskTypes="taskTypes" @delete="handleMachineDelete" @update="handleMachineUpdate" /> </TabsContent>
          <TabsContent value="任務類型管理"> <TaskTypeManageTab :taskTypes="taskTypes" @update="handleTaskTypeUpdate" @delete="handleTaskTypeDelete" /> </TabsContent>
          <Separator />
        </Tabs>
      </DashboardCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Machine } from '@/types/machine'
import type { TaskType } from '@/types/task'
import type { User } from '@/types/user'
import MachineManageTab from '@/views/Admin/MachineManageTab.vue'
import TaskTypeManageTab from '@/views/Admin/TaskTypeManageTab.vue'
import UserManageTab from '@/views/Admin/UserManageTab.vue'
import { ref } from 'vue'
const currentTab = ref('使用者管理')
const tabTriggerClass = 'w-full px-4 py-2'

const handleTabChange = (tab: string) => {
  currentTab.value = tab
}

// fetch /users
const users  = ref<User[]>([])
const machines = ref<Machine[]>([])
const taskTypes = ref<TaskType[]>([])
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
  console.log('fetch machines:', machines.value)
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

fetchUsers()
fetchMachines()
fetchTaskTypes()

const handleMachineDelete = async (id: string) => {
  const base = import.meta.env.VITE_API_BASE_URL
  const res  = await fetch(`${base}/machines/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  else {
    await fetchMachines()
    console.log('deleted machine:', id)
  }
}
const handleMachineUpdate = async (payload: { _id: string; machineName: string; taskIds: string[] }) => {
  console.log(payload)
  const base = import.meta.env.VITE_API_BASE_URL
  const res  = await fetch(`${base}/machines/${payload._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      machineName: payload.machineName,
      machine_task_types : payload.taskIds,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  else {
    await fetchMachines()
    console.log('updated machine:', payload)
  }
}

const handleTaskTypeDelete = async (id: string) => {
  const base = import.meta.env.VITE_API_BASE_URL
  const res  = await fetch(`${base}/task-types/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  else {
    await fetchTaskTypes()
    console.log('deleted task type:', id)
  }
}

const handleTaskTypeUpdate = async (payload: { _id: string; taskName: string; number_of_machine: number }) => {
  console.log(payload)
  const base = import.meta.env.VITE_API_BASE_URL
  const res  = await fetch(`${base}/task-types/${payload._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskName: payload.taskName,
      number_of_machine: payload.number_of_machine,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  else {
    await fetchTaskTypes()
    console.log('updated task type:', payload)
  }
}

const handleUserDelete = async (id: string) => {
  const base = import.meta.env.VITE_API_BASE_URL
  const res  = await fetch(`${base}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  else {
    await fetchUsers()
    console.log('deleted user:', id)
  }
}
const handleUserUpdate = async (payload: { _id: string; userName: string; userRole: string; taskIds: string[] }) => {
  console.log(payload)
  const base = import.meta.env.VITE_API_BASE_URL
  const res  = await fetch(`${base}/users/${payload._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: payload.userName,
      userRole: payload.userRole,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  else {
    console.log('updated user:', payload)
  }
  fetchUsers()
  for (let i = 0; i < payload.taskIds.length; i++) {
    const res1 = await fetch(`${base}/users/${payload._id}/add-task-type`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTypeId: payload.taskIds[i],
      }),
    })
    if (!res1.ok) throw new Error(`HTTP ${res1.status}`)
    else {
      console.log('updated user:', payload)
    }
  }
  fetchUsers()
}
</script>
