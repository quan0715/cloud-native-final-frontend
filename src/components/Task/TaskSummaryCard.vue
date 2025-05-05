<template>
  <DashboardCard title="任務總覽">
    <div class="flex justify-between items-center p-2">
      <div class="text-center flex-1">
        <p class="text-sm text-gray-500">總任務數</p>
        <p class="text-2xl font-bold">{{ total }}</p>
      </div>

      <div class="text-center flex-1">
        <p class="text-sm text-gray-500">已完成</p>
        <p class="text-2xl font-bold">{{ completed }}</p>
      </div>
      <div class="text-center flex-1">
        <p class="text-sm text-gray-500">未完成</p>
        <p class="text-2xl font-bold">{{ pending }}</p>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import DashboardCard from '@/components/DashboardCard.vue'

interface Props {
  total: number
  completed: number
  pending: number
}

const props = defineProps<Props>()
const { total, completed, pending } = props
</script>
