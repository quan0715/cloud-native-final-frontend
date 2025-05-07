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
        :requirements="mockRequirements"
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
    <TaskList :tasks="mockTasks" />

    <!-- status and workers list -->
    <div class="flex flex-col space-y-4">
      <MachineStatusList :machines="mockMachines" class="w-full h-auto flex-1" />
      <UserAssignmentList :users="mockUsers" class="w-full h-auto flex-1" />
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
import { MachineStatus } from '@/types/machine'
import { TaskStatus } from '@/types/task'
import { UserStatus } from '@/types/user'

// Type-only imports
import type { Task } from '@/types/task'
import { type UserAssignment } from '@/types/user'

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const username = localStorage.getItem('token')
if (!username) {
  router.push('/login')
}

function onCreateRequest() {
  // todo: popout
  console.log('create new request')
  showRequestForm.value = true
}

const totalTasks = computed(() => mockTasks.value.length)
const completedCount = computed(
  () => mockTasks.value.filter((t) => t.status === TaskStatus.Done).length,
)
const pendingCount = computed(
  () => mockTasks.value.filter((t) => t.status !== TaskStatus.Done).length,
)
const TaskNames = computed(() => {
  return mockRequirements.value.map((r) => r.type)
})
const showRequestForm = ref(false)
function handleNewTask(newTask: { name: string; tags: string[] }) {
  console.log(newTask)
  showRequestForm.value = false
}

const mockRequirements = ref([
  {
    id: 1,
    code: 'XD12345',
    type: '溫度測試',
    tags: ['專案1', '專案2'],
  },
  {
    id: 2,
    code: 'XD23456',
    type: '電性測試',
    tags: ['專案3'],
  },
  {
    id: 3,
    code: 'XD34567',
    type: '物性測試',
    tags: ['專案1', '專案4'],
  },
])

const mockTasks = ref<Task[]>([
  {
    id: 1,
    code: 'XD12345',
    name: '溫度測試',
    user: 'User1',
    machine: 'Machine1',
    status: TaskStatus.InProgress,
  },
  {
    id: 2,
    code: 'XD23456',
    name: '電性測試',
    user: 'User2',
    machine: 'Machine2',
    status: TaskStatus.Done,
  },
])
const mockUsers = ref<UserAssignment[]>([
  { id: 1, name: 'User1', status: UserStatus.Working, task: 'XD12345' },
  { id: 2, name: 'User2', status: UserStatus.Idle },
  { id: 3, name: 'User3', status: UserStatus.Idle },
  { id: 4, name: 'User4', status: UserStatus.Assigned, task: 'XD23456' },
])
const mockMachines = ref([
  {
    id: 1,
    name: 'Machine1',
    code: 'M1',
    status: MachineStatus.Working,
    currentTask: { id: 1, code: 'XD12345', name: '溫度測試' },
  },
  { id: 2, name: 'Machine2', code: 'M2', status: MachineStatus.Idle },
])
</script>
