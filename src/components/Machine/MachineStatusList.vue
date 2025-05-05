<template>
  <DashboardCard title="機器狀態">
    <ul class="space-y-3">
      <li v-for="m in machines" :key="m.id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <Badge v-if="m.currentTask" class="text-purple-600 bg-purple-100">{{ m.currentTask.name }}</Badge>
            <p class="mt-1 font-semibold">{{ m.name }}</p>
            <p v-if="m.status === MachineStatus.Working" class="text-xs text-gray-500">
              {{ m.code }} 正在作業中
            </p>
            <p v-else-if="m.status === MachineStatus.Idle" class="text-xs text-gray-500">
              空閒中
            </p>
            <p v-else-if="m.status === MachineStatus.Maintenance" class="text-xs text-gray-500">
              維護中
            </p>
          </div>
          <Badge :class="statusClass(m.status)">{{ m.status }}</Badge>
        </Card>
      </li>
    </ul>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Card from '@/components/ui/card/Card.vue';
import { MachineStatus, type Machine } from '@/types/machine';

const props = defineProps<{ machines: Machine[] }>()
const machines = props.machines

function statusClass(s: MachineStatus) {
  switch (s) {
    case MachineStatus.Working:
      return 'bg-yellow-100 text-yellow-800'
    case MachineStatus.Idle:
      return 'bg-green-100 text-green-800'
    case MachineStatus.Maintenance:
      return 'bg-gray-100 text-gray-800'
    default:
      return ''
  }
}
</script>
