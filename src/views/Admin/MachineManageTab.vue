<template>
  <DashboardCard title="實驗室機器管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div v-for="m in machines" :key="m._id" class="flex flex-col gap-2">
        <div
          class="flex flex-row items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl"
        >
          <!-- 機器名稱與編號 -->
          <div class="flex flex-col gap-1 min-w-48">
            <p class="text-sm text-gray-500">ID: {{ m._id }}</p>
            <p class="text-xl font-semibold">{{ m.machineName }}</p>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 可執行任務類型 -->
          <DashboardData
            title="支援任務"
            :content="m.machine_task_types.map((task) => task.taskName).join(', ')"
          />

          <Separator orientation="vertical" class="h-auto" />

          <!-- 編輯按鈕 -->
          <div class="flex items-center justify-center">
            <Button variant="ghost" size="icon">
              <Edit class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
import type { Machine } from '@/types/machine'
import { Edit } from 'lucide-vue-next'

/* mock TaskType 供對應名稱用 */
const taskTypes = [
  { _id: 'tt1', taskName: '電性測試', number_of_machine: 2 },
  { _id: 'tt2', taskName: '溫度測試', number_of_machine: 1 },
  { _id: 'tt3', taskName: '物性測試', number_of_machine: 3 },
]

function taskTypeName(id: string) {
  return taskTypes.find((t) => t._id === id)?.taskName ?? id
}

const { machines } = defineProps<{ machines: Machine[] }>()
</script>
