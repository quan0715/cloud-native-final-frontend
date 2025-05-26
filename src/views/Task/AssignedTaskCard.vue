<template>
  <DashboardCard title="已指派（待完成）">
    <div class="flex flex-col gap-3">
      <div
        v-for="task in assignedTask"
        :key="task._id"
        class="flex flex-col justify-start items-start gap-2 rounded-md p-3 border-2 border-gray-100"
      >
        <div class="px-2 bg-purple-50 rounded-xl">
          <span class="text-[12px] text-sans font-semibold text-purple-600">{{ task.taskType?.taskName }}</span>
        </div>
        <p class="text-md text-sans font-semibold text-gray-600">
          {{ task.taskName }}
        </p>
        <div class="flex flex-row justify-start items-start gap-2">
          <p class="text-sm text-sans font-thin text-gray-500">
            {{ task.machine?.map((m) => m.machineName).join(', ') }}
          </p>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue';
import type { TaskSnapshot } from '@/types/user';
import { computed, defineProps } from 'vue';
const { assignedTask } = defineProps<{ assignedTask: TaskSnapshot[] }>()
const getTasks = computed(() => {
  return [
    {
      id: 1,
      code: '溫度測試',
      name: 'XD12345',
      requirement: ['#專業1', '#專業2', '#專業3'],
    },
    {
      id: 2,
      code: '溫度測試',
      name: 'XD12346',
      requirement: ['#專業1', '#專業2', '#專業3'],
    },
    {
      id: 3,
      code: '溫度測試',
      name: 'XD12347',
      requirement: ['#專業1', '#專業2', '#專業3'],
    },
    {
      id: 4,
      code: '溫度測試',
      name: 'XD12348',
      requirement: ['#專業1', '#專業2', '#專業3'],
    },
    {
      id: 5,
      code: '溫度測試',
      name: 'XD12349',
      requirement: ['#專業1', '#專業2', '#專業3'],
    },
  ]
})
</script>
