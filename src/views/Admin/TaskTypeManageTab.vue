<template>
  <DashboardCard title="任務類型管理" class="w-full">
    <template #action>
      <TaskTypeFormDialog
        @create="handleCreateEvent"
        @update="handleUpdateEvent"
        @delete="handleDeleteEvent"
      >
        <Button variant="outline">
          <div class="flex items-center gap-2">
            <Plus class="w-4 h-4" />
            新增任務類型
          </div>
        </Button>
      </TaskTypeFormDialog>
    </template>

    <div class="flex flex-col gap-2">
      <div v-for="t in taskTypes" :key="t._id" class="flex flex-col gap-2">
        <div class="flex items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl">
          <!-- 任務類型資訊 -->
          <div class="w-full flex flex-col justify-start items-start gap-2 p-2 rounded-lg">
            <div id="task-header" class="flex flex-col justify-start items-start gap-1">
              <ColorBadge
                :label="t.taskName"
                :primaryColor="t.color ?? '#EA4B44'"
                class="text-sm w-fit"
              />
              <p class="text-2xl font-thin px-1">{{ t.taskName }}</p>
            </div>

            <Separator orientation="horizontal" class="w-full" />

            <div class="w-full flex flex-col justify-start items-start gap-1">
              <div class="px-2 py-1">
                <span class="text-sm text-gray-600 font-mono"
                  >所需機台數：{{ t.number_of_machine }} 台</span
                >
              </div>
            </div>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 編輯按鈕 -->
          <div class="flex items-center gap-2">
            <TaskTypeFormDialog
              :task-type="t"
              @update="handleUpdateEvent"
              @delete="handleDeleteEvent"
              @create="handleCreateEvent"
            >
              <Button variant="ghost" size="icon">
                <Edit class="w-4 h-4" />
              </Button>
            </TaskTypeFormDialog>
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import TaskTypeFormDialog from '@/components/Task/TaskTypeFormDialog.vue'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
import type { TaskType } from '@/types/task'
import { Edit, Plus } from 'lucide-vue-next'
import { ref, onMounted, inject } from 'vue'
import { toast } from '@/components/ui/toast'
import { useTaskType } from '@/composables/useTaskType'
import type { Ref } from 'vue'
import ColorBadge from '@/components/ColorBadge.vue'

const taskTypes = ref<TaskType[]>([])
const loading = inject<Ref<boolean>>('globalLoading')!
const { fetchTaskTypes } = useTaskType()

async function handleCreateEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: '任務類型新增成功',
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: '任務類型新增失敗',
      description: message,
      variant: 'destructive',
    })
  }
}

async function handleUpdateEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: '任務類型更新成功',
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: '任務類型更新失敗',
      description: message,
      variant: 'destructive',
    })
  }
}

async function handleDeleteEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: '任務類型刪除成功',
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: '任務類型刪除失敗',
      description: message,
      variant: 'destructive',
    })
  }
}

async function _syncWithRepo() {
  loading.value = true
  await fetchTaskTypes()
  taskTypes.value = [...useTaskType().taskTypes.value]
  loading.value = false
}

onMounted(async () => {
  await _syncWithRepo()
})
</script>
