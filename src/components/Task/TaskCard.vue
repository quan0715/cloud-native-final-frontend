<template>
  <Card class="flex justify-between items-center p-4 rounded-xl shadow-sm group">
    <div class="w-full flex flex-col justify-start items-start gap-4">
      <!-- 任務標題 -->
      <div id="task-header" class="flex flex-col justify-start items-start gap-2">
        <StatusBadge :label="taskState.label" :status="taskState.status" />

        <div class="flex flex-row justify-start items-center gap-2">
          <p class="text-xl font-thin">{{ task.taskName }}</p>
        </div>
      </div>
      <Separator orientation="horizontal" class="w-full" />
      <div class="w-full flex flex-col justify-start items-start gap-2">
        <ColorBadge
          :label="task.taskTypeId.taskName"
          :primaryColor="task.taskTypeId.color || '#3B82F6'"
          class="text-sm"
        />
        <p class="text-sm text-gray-500">
          <span v-if="task.taskData.state === 'assigned'">
            已指派給 - {{ task.taskData.assignee_id?.userName || '未知' }}
          </span>
          <span v-if="task.taskData.state === 'in-progress'">
            {{ task.taskData.assignee_id?.userName || '未知' }} 正在操作
            {{ (task.taskData.machine ?? []).map((machine) => machine.machineName).join(' | ') }}
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
        status: 'in-progress',
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
