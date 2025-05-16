<template>
  <DashboardCard title="任務數量">
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task._id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <p class="font-semibold">{{ task.taskTypeId.taskName }} {{ task.taskName }}</p>
            <p class="text-xs text-gray-500">
              {{ task.assigner_id }} 正在操作 {{ task.taskData.machine }} 進行 {{ task.taskName }}
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
import Card from '@/components/ui/card/Card.vue';
import type { Task } from '@/types/task';
import { defineProps } from 'vue';


const { tasks } = defineProps<{ tasks: Task[] }>()

console.log(tasks)

</script>
