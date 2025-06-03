<template>
  <DashboardCard :title="title">
    <div class="flex justify-between items-center p-2 gap-4">
      <div
        v-for="item in data"
        :key="item.label"
        class="flex flex-row justify-start items-center gap-2 w-full"
      >
        <div class="flex-1 flex flex-col justify-start items-start gap-1">
          <!-- <ColorBadge :label="item.label" :primaryColor="item.primaryColor" /> -->
          <p class="text-sm md:text-md font-thin">{{ item.label }}</p>
          <p class="text-2xl md:text-3xl font-thin">{{ item.value }}</p>
        </div>
        <Separator
          v-if="item.label !== data[data.length - 1].label"
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

interface Props {
  title: string
  data: {
    label: string
    value: number
  }[]
}

const { data, title } = defineProps<Props>()
</script>
