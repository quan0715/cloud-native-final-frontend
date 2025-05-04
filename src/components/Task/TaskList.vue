<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h2 class="text-lg font-medium mb-3">任務數量</h2>
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task.id" class="flex justify-between items-center">
        <div>
          <p class="font-semibold">{{ task.code }} {{ task.name }}</p>
          <p class="text-xs text-gray-500">
            {{ task.user }} 正在操作 {{ task.machine }}
          </p>
        </div>
        <Badge variant="outline">{{ task.status }}</Badge>
      </li>
    </ul>
  </div>
</template>

<script setup>
import Badge from '@/components/ui/badge/Badge.vue'
import { ref } from 'vue'

const tasks = ref([
  { id: 1, code: 'XD12345', name: '溫度測試', user: 'User1', machine: 'Machine1', status: '進行中' },
  // …
])
</script>
