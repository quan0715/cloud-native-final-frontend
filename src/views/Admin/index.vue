<template>
  <div class="flex flex-col justify-center items-center p-12">
    <div class="max-w-screen-lg w-full flex flex-col justify-start items-start gap-4">
      <h1 class="w-fit text-3xl font-thin">
        <span class="text-blue-600">LAB 11</span> / {{ username }} / {{ currentTab }}
      </h1>
      <DashboardCard title="Admin Dashboard" class="w-full">
        <Tabs v-model="currentTab" class="w-full p-0 m-0">
          <TabsList>
            <TabsTrigger value="使用者管理" :class="tabTriggerClass"> 使用者管理 </TabsTrigger>
            <TabsTrigger value="機器管理" :class="tabTriggerClass"> 機器管理 </TabsTrigger>
            <TabsTrigger value="任務類型管理" :class="tabTriggerClass"> 任務類型管理 </TabsTrigger>
          </TabsList>
          <TabsContent value="使用者管理">
            <UserManageTab
              :users="users"
              :taskTypes="taskTypes"
              @update="handleUserUpdate"
              @delete="handleUserDelete"
            />
          </TabsContent>
          <TabsContent value="機器管理">
            <MachineManageTab />
          </TabsContent>
          <TabsContent value="任務類型管理">
            <TaskTypeManageTab
              :taskTypes="taskTypes"
              @update="handleTaskTypeUpdate"
              @delete="handleTaskTypeDelete"
              @create="handleTaskTypeCreate"
            />
          </TabsContent>
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
// import type { Machine } from '@/types/machine'
import type { TaskType } from '@/types/task'
import type { User } from '@/types/user'
import MachineManageTab from '@/views/Admin/MachineManageTab.vue'
import TaskTypeManageTab from '@/views/Admin/TaskTypeManageTab.vue'
import UserManageTab from '@/views/Admin/UserManageTab.vue'
import type { Ref } from 'vue'
import { inject, ref } from 'vue'
import { useUserData } from '@/composables/useUserData'
import {
  fetchTaskTypes as fetchTaskTypesRepo,
  createTaskType as createTaskTypeRepo,
  updateTaskType as updateTaskTypeRepo,
  deleteTaskType as deleteTaskTypeRepo,
} from '@/repositories/taskRepo'
import type { CreateTaskType } from '@/types/taskType'
const { username } = useUserData()

const currentTab = ref('使用者管理')
const tabTriggerClass = 'w-full px-4 py-2'

// fetch /users
const users = ref<User[]>([])
// const machines = ref<Machine[]>([])
const taskTypes = ref<TaskType[]>([])
const loading = inject<Ref<boolean>>('globalLoading')!
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
async function fetchTaskTypes() {
  loading.value = true
  error.value = null
  try {
    taskTypes.value = await fetchTaskTypesRepo()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

fetchUsers()
// fetchMachines()
fetchTaskTypes()

const handleTaskTypeDelete = async (id: string) => {
  await deleteTaskTypeRepo(id)
  await fetchTaskTypes()
  console.log('deleted task type:', id)
}

const handleTaskTypeUpdate = async (payload: { _id: string } & CreateTaskType) => {
  await updateTaskTypeRepo(payload._id, {
    taskName: payload.taskName,
    number_of_machine: payload.number_of_machine,
    color: payload.color,
  })
  await fetchTaskTypes()
  console.log('updated task type:', payload)
}

async function handleTaskTypeCreate(payload: CreateTaskType) {
  await createTaskTypeRepo({
    taskName: payload.taskName,
    number_of_machine: payload.number_of_machine,
    color: payload.color,
  })
  await fetchTaskTypes()
  console.log('new task type:', payload)
}

const handleUserDelete = async (id: string) => {
  const base = import.meta.env.VITE_API_BASE_URL
  const res = await fetch(`${base}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  else {
    await fetchUsers()
    console.log('deleted user:', id)
  }
}
const handleUserUpdate = async (payload: {
  _id: string
  userName: string
  userRole: string
  taskIds: string[]
}) => {
  const base = import.meta.env.VITE_API_BASE_URL

  /* ---------- 1. 先更新使用者基本資料 ---------- */
  const res = await fetch(`${base}/users/${payload._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: payload.userName,
      userRole: payload.userRole,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  /* ---------- 2. 取舊的任務 id 陣列 ---------- */
  const userOld = users.value.find((u) => u._id === payload._id)
  const taskIdsOld = userOld ? userOld.user_task_types.map((t) => t._id) : []

  /* ---------- 3. 比較差集 ---------- */
  const toAdd = payload.taskIds.filter((id) => !taskIdsOld.includes(id))
  const toRemove = taskIdsOld.filter((id) => !payload.taskIds.includes(id))

  /* ---------- 4. 新增任務類型 ---------- */
  await Promise.all(
    toAdd.map((taskId) =>
      fetch(`${base}/users/${payload._id}/add-task-type`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTypeId: taskId }),
      }),
    ),
  )

  /* ---------- 5. 移除任務類型 ---------- */
  await Promise.all(
    toRemove.map((taskId) =>
      fetch(`${base}/users/${payload._id}/remove-task-type`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTypeId: taskId }),
      }),
    ),
  )

  /* ---------- 6. 重新抓最新資料 ---------- */
  await fetchUsers()
}
</script>
