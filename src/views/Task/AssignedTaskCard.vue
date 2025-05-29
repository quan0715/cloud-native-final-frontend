<template>
  <DashboardCard title="已指派（待完成)">
    <div class="grid grid-cols-3 gap-4">
      <TaskSnapShotCard v-for="task in assignedTask" :key="task._id" :task="task" />
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import type { TaskSnapshot } from '@/types/user'
import { defineProps } from 'vue'
import TaskSnapShotCard from '@/components/Task/TaskSnapShotCard.vue'
const { assignedTask } = defineProps<{ assignedTask: TaskSnapshot[] }>()
</script>
