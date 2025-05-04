<template>
  <div class="bg-white rounded-xl shadow p-4">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-medium">任務需求</h2>
      <Button size="sm" @click="$emit('create')" class="bg-blue-50 text-blue-800">＋新增任務</Button>
    </div>
    <ul class="space-y-2">
      <li v-for="item in requests" :key="item.id" class="border-b pb-2">
        <Badge class="text-purple-600 bg-purple-100">溫度測試</Badge>
        <p class="mt-1 font-semibold">{{ item.code }}</p>
        <p class="text-xs text-gray-500">#專案1 #專案2 #專案3 #專案4</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import { ref } from 'vue'

const requests = ref([
  { id: 1, code: 'XD12345' },
  { id: 2, code: 'XD23456' },
  // …
])
</script>
