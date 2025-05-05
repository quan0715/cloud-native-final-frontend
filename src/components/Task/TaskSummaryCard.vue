<template>
  <div class="bg-white rounded-xl shadow p-4 flex justify-between items-center">
    <div class="text-center flex-1">
      <p class="text-sm text-gray-500">總任務數</p>
      <p class="text-2xl font-bold">{{ total }}</p>
    </div>
    <div class="text-center flex-1">
      <p class="text-sm text-gray-500">已完成</p>
      <p class="text-2xl font-bold">{{ completed }}</p>
    </div>
    <div class="text-center flex-1">
      <p class="text-sm text-gray-500">未完成</p>
      <p class="text-2xl font-bold">{{ pending }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Props {
  total: number
  completed: number
  pending: number
}

const props = defineProps<Props>()
const { total, completed, pending } = props
</script>
