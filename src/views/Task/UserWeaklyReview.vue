<template>
  <DashboardCard title="本週指派進度" class="flex flex-col">
    <div class="flex-1 justify-center flex flex-col items-center">
      <DashboardData title="本週指派進度" :content="`${completed}/${total}`">
        <h1 class="text-4xl text-sans font-thin">
          <span class="text-blue-500 font-semibold"> {{ completed }} </span>
          <span class="text-gray-500">/ {{ total }} </span>
        </h1>
      </DashboardData>
    </div>
    <Separator />
    <div class="grid grid-cols-2 gap-2 py-2">
      <div class="col-span-1 flex flex-row justify-start items-start gap-2">
        <DashboardData title="今日完成" :content="toDayCompletedTaskCount.toString()" />
        <Separator orientation="vertical" />
      </div>
      <DashboardData title="今日新增" :content="toDayNewTaskCount.toString()">
        <p class="text-xl text-green-500 text-sans font-semibold">+{{ toDayNewTaskCount }}</p>
      </DashboardData>
    </div>
    <Separator />
    <DashboardData title="平均測試任務進行時間" :content="averageTaskTimeText" />
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import { Separator } from '@/components/ui/separator'
import { defineProps, computed } from 'vue'
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Number,
    default: 0,
  },
  toDayNewTaskCount: {
    type: Number,
    default: 0,
  },
  toDayCompletedTaskCount: {
    type: Number,
    default: 0,
  },
  averageTaskTime: {
    type: Number,
    default: 0,
  },
})
const averageTaskTimeText = computed(() => {
  const hours = Math.floor(props.averageTaskTime / 60)
  const minutes = Math.floor(props.averageTaskTime % 60)
  return `${hours} 小時 ${minutes} 分鐘`
})
</script>
