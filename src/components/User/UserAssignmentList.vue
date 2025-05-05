<template>
  <div class="bg-white rounded-xl shadow p-4">
    <h2 class="text-lg font-medium mb-3">人員清單</h2>
    <ul class="space-y-3">
      <li v-for="u in users" :key="u.id" class="flex justify-between">
        <div>
          <p class="font-semibold">{{ u.name }}</p>
          <p class="text-xs text-gray-500">
            {{ u.status === '工作中' ? `正在執行 ${u.task}` : u.status }}
          </p>
        </div>
        <Badge :class="userBadgeClass(u.status)">{{ u.statusLabel }}</Badge>
      </li>
    </ul>
  </div>
</template>

<script setup>
import Badge from '@/components/ui/badge/Badge.vue'
import { ref } from 'vue'

const users = ref([
  { id:1, name:'User1', status:'working', statusLabel:'工作中', task:'XD12345 溫度測試' },
  { id:2, name:'User2', status:'idle',    statusLabel:'閒置中' },
  // …
])

function userBadgeClass(s) {
  if (s === 'working') return 'bg-yellow-100 text-yellow-800'
  if (s === 'idle')    return 'bg-green-100 text-green-800'
  return ''
}
</script>
