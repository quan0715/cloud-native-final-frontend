<template>
  <DashboardCard title="任務數量">
    <!-- 右上角「新增任務」按鈕 -->
    <template #action>
      <Button @click="$emit('create')" variant="outline">
        <div class="flex items-center gap-2">
          <Plus class="w-4 h-4" /> 新增任務
        </div>
      </Button>
    </template>

    <!-- 列表 -->
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task._id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <!-- 任務標題 -->
            <p class="font-semibold">
              {{ task.taskTypeId.taskName }} {{ task.taskName }}
            </p>

            <!-- 狀態敘述 -->
            <p class="text-xs text-gray-500">
              <span v-if="task.taskData.state === 'draft'">
                {{ task.assigner_id || '未指派' }} 將要操作
              </span>
              <span v-else>
                {{ task.assigner_id || '未知' }} 正在操作
              </span>

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
import DashboardCard from '@/components/DashboardCard.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import type { Task } from '@/types/task';
import { Plus } from 'lucide-vue-next';
import { defineProps } from 'vue';


const { tasks } = defineProps<{ tasks: Task[] }>()

console.log(tasks)
function machineNames(arr: any[] | undefined) {
  if (!arr || arr.length === 0) return '尚未指派機器'
  // 若後端帶 { machineName } 物件
  if (typeof arr[0] === 'object') {
    return arr.map((m: any) => m.machineName).join(', ')
  }
  // 若為 ObjectId 字串
  return arr.join(', ')
}

const emit = defineEmits(['create'])
</script>
