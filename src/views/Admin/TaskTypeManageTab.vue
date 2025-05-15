<template>
  <DashboardCard title="任務類型管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div v-for="task in taskTypes" :key="task._id" class="flex flex-col gap-2">
        <div
          class="flex flex-row items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl"
        >
          <!-- 任務基本資訊 -->
          <div class="flex flex-col gap-1 min-w-32">
            <p class="text-sm text-gray-500">ID: {{ task._id }}</p>
            <p class="text-xl font-semibold">{{ task.taskName }}</p>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 所需機台數 -->
          <DashboardData
            title="標籤"
            :content="task.task_types.toString()"
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
import { Edit } from 'lucide-vue-next'
import { ref } from 'vue'



/* mock 資料：之後替換成 API */
const taskTypes = ref([
  {
    _id: 'machine1',
    taskName: '電性測試',
    task_types: ['tt2'],
  },
  {
    _id: 'machine2',
    taskName: '物性測試',
    task_types: ['tt1'],
  },
  {
    _id: 'machine3',
    taskName: '溫度測試',
    task_types: ['tt3'],
  },
])
</script>
