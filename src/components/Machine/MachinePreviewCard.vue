<template>
  <Card class="flex justify-between items-center p-4 rounded-xl shadow-sm group">
    <div class="flex-1 flex flex-col justify-start items-start gap-2">
      <!-- 任務標題 -->
      <div id="task-header" class="flex flex-col justify-start items-start gap-1.5">
        <StatusBadge :label="status.label" :status="status.status" />
        <p class="text-xl font-thin px-1">{{ machine.machineName }}</p>
      </div>
      <ColorBadge
        v-for="type in machine.machine_task_types"
        :key="type._id"
        :label="type.taskName"
        primaryColor="F8A608"
        class="text-sm p-0"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { type Machine } from '@/types/machine'
import ColorBadge from '@/components/ColorBadge.vue'
import Card from '@/components/ui/card/Card.vue'
import { computed } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'

const { machine } = defineProps<{ machine: Machine }>()

const status = computed(() => {
  switch (machine.status) {
    case 'in-progress':
      return {
        label: '作業中',
        status: 'in-progress',
      }
    case 'idle':
      return {
        label: '空閒中',
        status: 'idle',
      }
    case 'maintenance':
      return {
        label: '維護中',
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
