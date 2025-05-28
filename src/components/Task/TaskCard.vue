<template>
  <Card class="flex justify-between items-center p-4 rounded-xl shadow-sm group">
    <div class="flex flex-col justify-start items-start gap-2">
      <!-- 任務標題 -->
      <div id="task-header" class="flex flex-col justify-start items-start gap-1">
        <StatusBadge :label="taskState.label" :status="taskState.status" />

        <p class="text-xl font-thin px-1">{{ task.taskName }}</p>
      </div>
      <ColorBadge :label="task.taskTypeId.taskName" primaryColor="EA4B44" class="text-sm" />
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

const { task } = defineProps<{
  task: Task
}>()

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
    default:
      return {
        label: '未知',
        status: 'idle',
      }
  }
})
</script>
