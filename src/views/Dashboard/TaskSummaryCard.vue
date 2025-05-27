<template>
  <DashboardCard title="測試任務總覽">
    <div class="flex justify-between items-center p-2 gap-4">
      <div class="text-left flex-1 flex flex-col justify-start items-start gap-1">
        <ColorBadge label="總測試數量" primaryColor="397EFF" />

        <p class="text-2xl font-thin">{{ total }}</p>
      </div>
      <Separator orientation="vertical" />
      <div class="text-left flex-1 flex flex-col justify-start items-start gap-1">
        <ColorBadge label="代指派任務數量" primaryColor="3E3E3E" />

        <p class="text-2xl font-thin">{{ completed }}</p>
      </div>
      <Separator orientation="vertical" />
      <div class="text-left flex-1 flex flex-col justify-start items-start gap-1">
        <ColorBadge label="未結單任務" primaryColor="D9730D" />
        <p class="text-2xl font-thin">{{ pending }}</p>
      </div>
    </div>
    <!-- <div class="flex flex-col justify-start items-start gap-1 text-[12px] text-gray-500">
      <p>總測試數量: 目前總測試需求（包含草稿與未結單數量）</p>
      <p>已指派: 預計測試需求（還未指派）</p>
      <p>進行中: 目前已經指派出去但未結單的任務數量</p>
    </div> -->
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import { Separator } from '@/components/ui/separator'
import { defineProps } from 'vue'
import ColorBadge from '@/components/ColorBadge.vue'

interface Props {
  total: number
  completed: number
  pending: number
}

const { total, completed, pending } = defineProps<Props>()
</script>
