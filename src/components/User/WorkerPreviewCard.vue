<template>
  <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
    <div>
      <div id="task-header" class="flex flex-col justify-start items-start gap-1.5">
        <StatusBadge :label="status.label" :status="status.status" />
        <p class="text-xl font-thin px-1">{{ worker.userName }}</p>
      </div>
      <p v-if="worker.inProgressTasks.length > 0" class="text-xs text-gray-500">
        正在進行 {{ worker.inProgressTasks }}
      </p>
      <!-- TODO: 加上 user_task_types 的數量 -->
      <Separator orientation="horizontal" class="w-full" />
      <ColorBadge
        v-for="type in worker.user_task_types"
        :key="type._id"
        :label="type.taskName"
        primaryColor="EA4B44"
        class="text-sm p-0"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue'
import { type UserWithTasks } from '@/types/user'
import { computed } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ColorBadge from '@/components/ColorBadge.vue'

const { worker } = defineProps<{ worker: UserWithTasks }>()
console.log('worker', worker)

const status = computed(() => {
  if (worker.inProgressTasks.length > 0) {
    return {
      label: '作業中',
      status: 'in-progress',
    }
  }
  if (worker.inProgressTasks.length == 0) {
    return {
      label: '空閒中',
      status: 'idle',
    }
  }
  return {
    label: '未知',
    status: 'idle',
  }
})
</script>
