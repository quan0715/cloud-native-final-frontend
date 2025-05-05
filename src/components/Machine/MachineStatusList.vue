<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h2 class="text-lg font-medium mb-3">機器狀態</h2>
    <ul class="space-y-3">
      <li v-for="m in machines" :key="m.id" class="flex justify-between">
        <div>
          <p class="font-semibold">{{ m.name }}</p>
          <p class="text-xs text-gray-500">{{ m.code }} 正在作業中</p>
        </div>
        <Badge :class="statusClass(m.status)">{{ m.status }}</Badge>
      </li>
    </ul>
  </div>
</template>

<script setup>
import Badge from '@/components/ui/badge/Badge.vue'
import { ref } from 'vue'

const machines = ref([
  { id: 1, name: 'Machine 1', code: 'ABC12345', status: '工作中' },
  // …
])

function statusClass(s) {
  switch (s) {
    case '工作中':   return 'bg-yellow-100 text-yellow-800'
    case '閒置中':   return 'bg-green-100 text-green-800'
    case '已維護':   return 'bg-gray-100 text-gray-800'
    default:        return ''
  }
}
</script>
