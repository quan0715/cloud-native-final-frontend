<template>
  <DashboardCard title="實驗室機器管理" class="w-full">
    <template #action>
      <MachineFormDialog
        :taskTypes="taskTypes"
        :machine="undefined"
        @create="handleCreateEvent"
        @update="handleUpdateEvent"
        @delete="handleDeleteEvent"
      >
        <Button variant="outline">
          <div class="flex items-center gap-2">
            <Plus class="w-4 h-4" />
            新增機器
          </div>
        </Button>
      </MachineFormDialog>
    </template>
    <div class="flex flex-col gap-2">
      <div v-for="m in machines" :key="m._id" class="flex flex-col gap-2">
        <div class="flex items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl">
          <!-- 機器名稱 -->
          <div class="flex-1 flex flex-col justify-start items-start gap-2">
            <!-- 任務標題 -->
            <div id="task-header" class="flex flex-col justify-start items-start gap-1.5">
              <StatusBadge :label="m.status" :status="m.status" />
              <p class="text-xl font-thin px-1">{{ m.machineName }}</p>
            </div>
            <Separator orientation="horizontal" class="w-full" />
            <div class="flex flex-row justify-start items-center gap-2">
              <ColorBadge
                v-for="type in m.machine_task_types"
                :key="type._id"
                :label="type.taskName"
                :primaryColor="type.color ?? '#EA4B44'"
                class="text-sm p-0"
              />
            </div>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 編輯 / 刪除 -->
          <div class="flex items-center gap-2">
            <MachineFormDialog
              :taskTypes="taskTypes"
              :machine="m"
              @update="handleUpdateEvent"
              @delete="handleDeleteEvent"
              @create="handleCreateEvent"
            >
              <Button variant="ghost" size="icon">
                <Edit class="w-4 h-4" />
              </Button>
            </MachineFormDialog>
            <!-- Edit Dialog -->
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import MachineFormDialog from '@/components/Machine/MachineFormDialog.vue'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
import type { Machine } from '@/types/machine'
import { Edit, Plus } from 'lucide-vue-next'
import { ref, onMounted, inject } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ColorBadge from '@/components/ColorBadge.vue'
import { toast } from '@/components/ui/toast'
import { fetchMachines } from '@/repositories/MachineRepo'
import { useTaskType } from '@/composables/useTaskType'
import type { Ref } from 'vue'
/* -------- props & emits -------- */
const machines = ref<Machine[]>([])
const loading = inject<Ref<boolean>>('globalLoading')!

const { taskTypes, fetchTaskTypes } = useTaskType()

// const props = defineProps<{
//   machines: Machine[]
//   taskTypes: TaskType[] // 父層提前傳入全部 TaskType
// }>()

async function handleDeleteEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: `機器刪除成功`,
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: `機器刪除失敗`,
      description: message,
      variant: 'destructive',
    })
  }
}
/* 提交新增 */
async function handleCreateEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: `機器新增成功`,
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: `機器新增失敗`,
      description: message,
      variant: 'destructive',
    })
  }
}

async function handleUpdateEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: `機器更新成功`,
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: `機器更新失敗`,
      description: message,
      variant: 'destructive',
    })
  }
}

async function _syncWithRepo() {
  loading.value = true
  machines.value = await fetchMachines()
  await fetchTaskTypes()
  loading.value = false
}

onMounted(async () => {
  await _syncWithRepo()
})
</script>
