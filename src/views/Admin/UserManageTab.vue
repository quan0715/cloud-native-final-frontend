<template>
  <DashboardCard title="實驗室人員管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div v-for="user in users" :key="user.id" class="flex flex-col gap-2">
        <div
          class="flex flex-row justify-start items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl"
        >
          <div class="flex flex-col gap-2 items-start justify-start min-w-32">
            <UserRoleChip :role="user.role" />
            <p class="text-xl font-semibold px-2">{{ user.name }}</p>
          </div>
          <Separator orientation="vertical" class="h-auto" />
          <DashboardData
            v-if="user.taskType.length > 0"
            title="任務類型"
            :content="user.taskType.map((task) => task.name).join(', ')"
          />
          <div v-else class="w-full flex flex-row gap-2 items-center justify-start">
            <p class="text-sm text-gray-500">管理職無需指派任務</p>
          </div>
          <Separator orientation="vertical" class="h-auto" />
          <div class="flex flex-row gap-2 items-center justify-center">
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
import { Separator } from '@/components/ui/separator'
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import UserRoleChip from '@/components/User/UserRoleChip.vue'
import Button from '@/components/ui/button/Button.vue'
import { Edit } from 'lucide-vue-next'
import { ref } from 'vue'

const users = ref([
  {
    id: 1,
    name: 'admin001',
    role: 'admin',
    taskType: [],
  },
  {
    id: 1,
    name: 'leader001',
    role: 'leader',
    taskType: [],
  },
  {
    id: 2,
    name: 'worker001',
    role: 'worker',
    taskType: [
      { id: 1, name: '電性測試' },
      { id: 2, name: '溫度測試' },
      { id: 3, name: '物性測試' },
    ],
  },
  {
    id: 3,
    name: 'Quan',
    role: 'worker',
    taskType: [
      { id: 1, name: '電性測試' },
      { id: 2, name: '溫度測試' },
    ],
  },
])
</script>
