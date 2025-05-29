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
          :label="task.taskType?.taskName || '未知'"
          primaryColor="EA4B44"
          class="text-sm"
        />
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
import type { TaskSnapshot } from '@/types/user'
import ColorBadge from '@/components/ColorBadge.vue'
import Card from '@/components/ui/card/Card.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { Separator } from '@/components/ui/separator'

const { task } = defineProps<{
  task: TaskSnapshot
}>()

console.log('task', task)

const taskState = computed(() => {
  switch (task.state) {
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
