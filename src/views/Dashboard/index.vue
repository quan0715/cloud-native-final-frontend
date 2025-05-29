<template>
  <div class="max-w-5xl w-full mx-auto flex flex-col justify-start items-start">
    <div class="w-full flex flex-col justify-start items-start p-4 gap-4">
      <div class="w-full flex flex-row justify-between items-center gap-2">
        <h1 class="w-fit text-3xl font-thin">
          <span class="text-blue-600">LAB 11</span> / 歡迎回來
        </h1>
      </div>
      <TaskSummaryCard
        :total="totalTasks"
        :draft="draftCount"
        :inProgress="uncompletedTaskCount"
        class="w-full h-fit"
      />
      <Separator orientation="horizontal" />
      <div class="w-full flex flex-row justify-between items-center gap-2">
        <h1 class="w-fit text-3xl font-thin">任務草稿佇列</h1>
        <div class="flex flex-row justify-end items-center gap-2">
          <Button variant="outline" @click="openNewTaskDialog">
            <Plus class="w-4 h-4" />
            新增任務
          </Button>
          <Button @click="openAutoAssignDrawer"> 自動指派 </Button>
        </div>
      </div>
      <div class="w-full grid grid-cols-3 gap-4 h-full">
        <DraftTask
          v-for="task in draftTask"
          :key="task._id"
          :task="task"
          @update="syncRemoteTasks"
        />
      </div>
      <Separator orientation="horizontal" />
      <div class="w-full flex flex-row justify-between items-center gap-2">
        <h1 class="w-fit text-3xl font-thin">未結單任務</h1>
      </div>
      <div class="w-full grid grid-cols-3 gap-4 h-full">
        <TaskCard
          v-for="task in uncompletedTask"
          :key="task._id"
          :task="task"
          class="w-full h-auto flex-1"
        />
      </div>
      <Separator orientation="horizontal" />
      <h1 class="w-fit text-3xl font-thin">機器</h1>
      <div class="w-full grid grid-cols-3 gap-4 h-full">
        <MachinePreviewCard
          v-for="machine in machines"
          :key="machine._id"
          :machine="machine"
          class="w-full h-auto flex-1"
        />
      </div>
      <Separator orientation="horizontal" />
      <h1 class="w-fit text-3xl font-thin">人員</h1>
      <div class="w-full grid grid-cols-3 gap-4 h-full">
        <WorkerPreviewCard
          v-for="worker in workers"
          :key="worker._id"
          :worker="worker"
          class="w-full h-auto flex-1"
        />
      </div>
      <Separator orientation="horizontal" />
    </div>
  </div>
  <TaskFormDialog
    v-model:modelValue="isDialogVisible"
    :taskToEdit="currentTaskToEdit"
    :syncRemoteTasks="syncRemoteTasks"
    @taskSaved="syncRemoteTasks"
    @taskDeleted="syncRemoteTasks"
  />
  <AutoAssignSheet
    :open="isAutoAssignDrawerOpen"
    :assignerId="userId"
    @update:open="isAutoAssignDrawerOpen = $event"
    @assignments-confirmed="handleAssignmentsConfirmed"
  />
</template>

<script setup lang="ts">
import MachinePreviewCard from '@/components/Machine/MachinePreviewCard.vue'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import TaskFormDialog from '@/views/Dashboard/TaskFormDialog.vue'
import DraftTask from '@/components/Task/DraftTask.vue'
import TaskCard from '@/components/Task/TaskCard.vue'
import AutoAssignSheet from '@/components/Task/AutoAssignSheet.vue'
import type { Machine } from '@/types/machine'
import type { Task } from '@/types/task'
import type { UserWithTasks } from '@/types/user'
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import WorkerPreviewCard from '@/components/User/WorkerPreviewCard.vue'
import TaskSummaryCard from '@/views/Dashboard/TaskSummaryCard.vue'
import { useUserData } from '@/composables/useUserData'
import { getAllTasks as getAllTasksFromRepo } from '@/repositories/taskRepo'
import { fetchMachines as fetchMachinesFromRepo } from '@/repositories/MachineRepo'
import { fetchWorkers as fetchWorkersFromRepo } from '@/repositories/WorkerRepo'

const machines = ref<Machine[]>([])
const workers = ref<UserWithTasks[]>([])
const loading = inject<Ref<boolean>>('globalLoading')!
const isDialogVisible = ref(false)
const currentTaskToEdit = ref<Task | null>(null)
const tasks = ref<Task[]>([]) // 您的任務列表數據
const isAutoAssignDrawerOpen = ref(false)
const { userId } = useUserData()

const draftTask = computed(() => {
  return tasks.value.filter((t: Task) => t.taskData.state === 'draft')
})

const uncompletedTask = computed(() => {
  return tasks.value.filter(
    (t: Task) => t.taskData.state != 'draft' && t.taskData.state != 'success',
  )
})
const totalTasks = computed(() => tasks.value.length)

const draftCount = computed(() => draftTask.value.length)
const uncompletedTaskCount = computed(() => uncompletedTask.value.length)

const error = ref<string | null>(null)

function openNewTaskDialog() {
  currentTaskToEdit.value = null
  isDialogVisible.value = true
}

function openAutoAssignDrawer() {
  isAutoAssignDrawerOpen.value = true
}

async function syncRemoteTasks() {
  isDialogVisible.value = false // 關閉對話框
  await fetchAllTasks()
}

async function fetchWorkers() {
  loading.value = true
  error.value = null
  try {
    workers.value = await fetchWorkersFromRepo()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '取得使用者列表時發生錯誤'
    console.error('fetchUsers error:', errorMessage, e)
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}

async function getAllMachines() {
  loading.value = true
  error.value = null
  try {
    machines.value = await fetchMachinesFromRepo()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '取得機器列表時發生錯誤'
    console.error('getAllMachines error:', errorMessage, e)
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}

async function fetchAllTasks() {
  loading.value = true
  tasks.value = (await getAllTasksFromRepo()) as Task[]
  loading.value = false
}

async function handleAssignmentsConfirmed() {
  isAutoAssignDrawerOpen.value = false // Close the drawer
  await fetchAllTasks() // Refresh draft tasks as assignments likely affect them
  console.log('Auto assignments confirmed, draft tasks list refreshed.')
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([fetchWorkers(), getAllMachines(), fetchAllTasks()])
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : '頁面初始化載入資料時發生錯誤'
    console.error('onMounted fetchAll error:', errorMessage, e)
    error.value = errorMessage
  } finally {
    loading.value = false
  }
})
</script>
