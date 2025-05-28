<template>
  <DashboardCard title="測試任務總覽">
    <div class="flex justify-between items-center p-2 gap-4">
      <div
        v-for="item in dataConfig"
        :key="item.label"
        class="flex flex-row justify-start items-center gap-2 w-full"
      >
        <div class="flex-1 flex flex-col justify-start items-start gap-1">
          <ColorBadge :label="item.label" :primaryColor="item.primaryColor" />
          <p class="px-1 text-2xl font-thin">{{ item.value }}</p>
        </div>
        <Separator
          v-if="item.label !== dataConfig[dataConfig.length - 1].label"
          orientation="vertical"
          class="h-16"
        />
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import { Separator } from '@/components/ui/separator'
import { defineProps } from 'vue'
import { computed } from 'vue'
import ColorBadge from '@/components/ColorBadge.vue'

interface Props {
  total: number
  draft: number
  inProgress: number
}

const { total, draft, inProgress } = defineProps<Props>()
const dataConfig = computed(() => [
  {
    label: '總測試數',
    value: total,
    primaryColor: '397EFF',
  },
  {
    label: '等待指派',
    value: draft,
    primaryColor: '3E3E3E',
  },
  {
    label: '未結單',
    value: inProgress,
    primaryColor: '8F65AF',
  },
])
</script>
