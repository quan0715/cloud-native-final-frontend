<template>
  <DashboardCard title="機器狀態">
    <ul class="space-y-3">
      <li v-for="m in machines" :key="m._id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <Badge v-if="m.status == 'in-progress'" class="text-purple-600 bg-purple-100">{{ m.status }}</Badge>
            <!-- 原本是放目前的task -->
            <p class="mt-1 font-semibold">{{ m.machineName }}</p>
            <p v-if="m.status == 'in-progress'" class="text-xs text-gray-500">
              {{ m.machineName }} 正在作業中
            </p>
            <p v-else-if="m.status == 'idle'" class="text-xs text-gray-500">
              空閒中
            </p>
            <p v-else-if="m.status == 'maintenance'" class="text-xs text-gray-500">
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
import { type Machine, type MachineState } from '@/types/machine';

const { machines } = defineProps<{ machines: Machine[] }>();

function statusClass(s: MachineState) {
  switch (s) {
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'idle':
      return 'bg-green-100 text-green-800'
    case 'maintenance':
      return 'bg-gray-100 text-gray-800'
    default:
      return ''
  }
}
</script>
