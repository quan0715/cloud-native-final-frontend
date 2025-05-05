<template>
  <DashboardCard title="任務KPI總覽">
    <div class="flex space-x-4">
      <div class="flex-1 text-center">
        <p class="text-sm">累積需求數</p>
        <p class="text-2xl font-bold">12</p>
      </div>
      <div class="flex-1 text-center">
        <p class="text-sm">待派任務數</p>
        <p class="text-2xl font-bold">6</p>
      </div>
      <div class="flex-1 text-center">
        <p class="text-sm">已完成</p>
        <p class="text-2xl font-bold">6</p>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
</script>
