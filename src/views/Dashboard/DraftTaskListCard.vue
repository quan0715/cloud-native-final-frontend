<template>
  <DashboardCard title="代指派任務">
    <!-- 列表 -->
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task._id">
        <DraftTask :task="task" @on-task-update="syncTasks" />
      </li>
    </ul>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import type { Task } from '@/types/task'
import DraftTask from '@/components/Task/DraftTask.vue'
import { getDraftTasks } from '@/repositories/taskRepo'
import { ref, onMounted } from 'vue'

const tasks = ref<Task[]>([])

onMounted(async () => {
  await syncTasks()
  console.log('tasks', tasks.value)
})

async function syncTasks() {
  const draftTasks = await getDraftTasks()
  tasks.value = draftTasks as Task[]
}
</script>
