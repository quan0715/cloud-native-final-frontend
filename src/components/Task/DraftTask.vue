<template>
  <Card class="flex justify-between items-center p-4 rounded-xl shadow-sm group">
    <div class="flex flex-col justify-start items-start gap-2">
      <!-- 任務標題 -->
      <div id="task-header" class="flex flex-col justify-start items-start gap-1">
        <StatusBadge label="草稿" status="idle" />

        <p class="text-xl font-thin px-1">{{ task.taskName }}</p>
      </div>
      <ColorBadge :label="task.taskTypeId.taskName" primaryColor="EA4B44" class="text-sm" />
    </div>
    <Button
      variant="ghost"
      size="sm"
      class="group-hover:block hidden"
      @click="openEditTaskDialog(task)"
    >
      <Edit2 class="w-4 h-4" />
    </Button>
  </Card>
  <TaskFormDialog
    v-model:modelValue="isDialogVisible"
    :taskToEdit="currentTaskToEdit"
    @taskSaved="handleTaskUpdate"
    @taskDeleted="handleTaskUpdate"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Task } from '@/types/task'
import ColorBadge from '@/components/ColorBadge.vue'
import Card from '@/components/ui/card/Card.vue'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-vue-next'
import TaskFormDialog from '@/views/Dashboard/TaskFormDialog.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { ref } from 'vue'

const emit = defineEmits(['on-task-update'])

const isDialogVisible = ref(false)
const currentTaskToEdit = ref<Task | null>(null)

function openEditTaskDialog(task: Task) {
  currentTaskToEdit.value = task
  isDialogVisible.value = true
}

function handleTaskUpdate() {
  isDialogVisible.value = false
  emit('on-task-update')
}

const { task } = defineProps<{
  task: Task
}>()
</script>
