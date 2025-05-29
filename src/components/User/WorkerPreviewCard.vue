<template>
  <Card
    class="w-full flex flex-col justify-start items-start gap-2 p-4 bg-white rounded-lg shadow-sm"
  >
    <div id="task-header" class="flex flex-col justify-start items-start gap-2">
      <StatusBadge :label="status.label" :status="status.status" />
      <p class="text-xl font-thin px-1">{{ worker.userName }}</p>
    </div>

    <!-- TODO: 加上 user_task_types 的數量 -->
    <Separator orientation="horizontal" class="w-full" />
    <div class="w-full flex flex-col justify-start items-start gap-2">
      <div class="flex flex-wrap gap-1">
        <ColorBadge
          v-for="type in worker.user_task_types"
          :key="type._id"
          :label="type.taskName"
          :primaryColor="type.color ?? '#EA4B44'"
          class="text-sm p-0"
        />
      </div>
      <p v-if="worker.inProgressTasks.length > 0" class="text-sm text-gray-500">
        正在進行 {{ worker.inProgressTasks[0].taskName }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue'
import { type UserWithTasks } from '@/types/user'
import { computed } from 'vue'
import { Separator } from '@/components/ui/separator'
import StatusBadge from '@/components/StatusBadge.vue'
import ColorBadge from '@/components/ColorBadge.vue'

const { worker } = defineProps<{ worker: UserWithTasks }>()
console.log('worker', worker)

const status = computed(() => {
  if (worker.inProgressTasks.length > 0) {
    return {
      label: `作業中 - ${worker.inProgressTasks[0].taskName}`,
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
