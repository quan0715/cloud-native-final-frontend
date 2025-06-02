<template>
  <Card v-if="task" class="flex justify-between items-start p-4 rounded-xl shadow-sm group">
    <div class="w-full flex flex-col justify-start items-start gap-4">
      <!-- 任務標題 -->
      <div id="task-header" class="flex flex-col justify-start items-start gap-2">
        <StatusBadge :label="taskState.label" :status="taskState.status" />

        <div class="flex flex-row justify-start items-center gap-2">
          <p class="text-xl font-thin">{{ task.taskName ?? '未知' }}</p>
        </div>
      </div>
      <Separator orientation="horizontal" class="w-full" />
      <div class="w-full flex flex-col justify-start items-start gap-2">
        <ColorBadge
          v-if="task.taskTypeId"
          :label="task.taskTypeId.taskName"
          :primaryColor="task.taskTypeId.color ?? '#3B82F6'"
          class="text-sm"
        />
        <p
          class="text-sm text-gray-500 font-mono"
          v-if="task.taskData.assignTime && task.taskData.state === 'assigned'"
        >
          {{ `指派時間: ${formatDate(task.taskData.assignTime)}` }}
        </p>
        <p
          class="text-sm text-gray-500 font-mono"
          v-if="task.taskTypeId?.number_of_machine && task.taskData.state === 'assigned'"
        >
          {{ `機器測試需求: ${task.taskTypeId?.number_of_machine}台` }}
        </p>
        <p class="text-sm text-gray-500 font-mono">
          <span v-if="task.taskData.state === 'assigned' && task.taskData.assignee_id?.userName">
            已指派給 - {{ task.taskData.assignee_id.userName }}
          </span>
          <span v-if="task.taskData.state === 'in-progress' && task.taskData.assignee_id?.userName">
            {{ task.taskData.assignee_id.userName }} 正在操作
            {{
              (task.taskData.machine || [])
                .map((machine) => machine?.machineName || '未知機器')
                .join(' | ')
            }}
          </span>
          <span v-if="task.taskData.state === 'success'">
            {{ task.taskData.assignee_id?.userName || '未知' }} 完成任務
          </span>
          <span v-if="task.taskData.state === 'fail'">
            {{ task.taskData.assignee_id?.userName || '未知' }} 已放棄任務
          </span>
        </p>
      </div>
    </div>
    <!-- <Button
      variant="ghost"
      size="sm"
      class="group-hover:block hidden"
      @click="openEditTaskDialog(task)"
    >
      <Edit2 class="w-4 h-4" />
    </Button> -->
  </Card>
  <!-- <TaskFormDialog
    v-model:modelValue="isDialogVisible"
    :taskToEdit="currentTaskToEdit"
    @taskSaved="handleTaskUpdate"
    @taskDeleted="handleTaskUpdate"
  /> -->
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { Task } from '@/types/task'
import ColorBadge from '@/components/ColorBadge.vue'
import Card from '@/components/ui/card/Card.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { Separator } from '@/components/ui/separator'

const { task } = defineProps<{
  task: Task
}>()
console.log('task', task)
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
const taskState = computed(() => {
  switch (task.taskData.state) {
    case 'draft':
      return {
        label: '草稿',
        status: 'draft',
      }
    case 'assigned':
      return {
        label: '已指派',
        status: 'draft',
      }
    case 'in-progress':
      return {
        label: '進行中',
        status: 'in-progress',
      }
    case 'success':
      return {
        label: '完成',
        status: 'success',
      }
    case 'fail':
      return {
        label: '失敗',
        status: 'error',
      }
    default:
      return {
        label: '未知',
        status: 'idle',
      }
  }
})
</script>
