<template>
  <DashboardCard title="任務數量">
    <!-- 列表 -->
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task._id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <!-- 任務標題 -->
            <p class="font-semibold">{{ task.taskTypeId.taskName }} {{ task.taskName }}</p>

            <!-- 狀態敘述 -->
            <p class="text-xs text-gray-500">
              <span v-if="task.taskData.state === 'draft'">
                {{ task.assigner_id || '未指派' }} 將要操作
              </span>
              <span v-else> {{ task.assigner_id?.userName || '未知' }} 正在操作 </span>

              <!-- 多台機器名稱用 , 連接 -->
              {{ machineNames(task.taskData.machine) }}
              進行 {{ task.taskName }}
            </p>
          </div>
          <Badge variant="outline">{{ task.taskData.state }}</Badge>
        </Card>
      </li>
    </ul>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Card from '@/components/ui/card/Card.vue'
import type { Task, TaskType } from '@/types/task'
import { defineProps, ref } from 'vue'

const { tasks, taskType } = defineProps<{
  tasks: Task[]
  taskType: TaskType[] // 父層傳入所有任務類型名稱
  isDraft?: boolean // 是否為草稿任務
}>()

function machineNames(arr: any[] | undefined) {
  if (!arr || arr.length === 0) return '尚未指派機器'
  // 若後端帶 { machineName } 物件
  if (typeof arr[0] === 'object') {
    return arr.map((m: any) => m.machineName).join(', ')
  }
  // 若為 ObjectId 字串
  return arr.join(', ')
}
</script>
