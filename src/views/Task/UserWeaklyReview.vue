<template>
  <DashboardCard title="本週指派進度" class="flex flex-col">
    <div class="flex-1 justify-center flex flex-col items-center">
      <DashboardData title="本週指派進度" content="100%">
        <h1 class="text-4xl text-sans font-thin">
          <span class="text-blue-500 font-semibold">11</span>
          <span class="text-gray-500">/ 39</span>
        </h1>
      </DashboardData>
    </div>
    <Separator />
    <div class="grid grid-cols-2 gap-2 py-2">
      <div class="col-span-1 flex flex-row justify-start items-start gap-2">
        <DashboardData title="今日完成任務數量" content="7" />
        <Separator orientation="vertical" />
      </div>
      <DashboardData title="今日新增指派數量" content="+3">
        <p class="text-xl text-green-500 text-sans font-semibold">+3</p>
      </DashboardData>
    </div>
    <Separator />
    <DashboardData title="平均測試任務進行時間" content="0 小時 53 分鐘" />
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import { Separator } from '@/components/ui/separator'
</script>
