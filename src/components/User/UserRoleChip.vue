<template>
  <div class="rounded-full px-2 py-0.5 bg-gray-100 text-center" :class="badgeClass">
    <span class="text-sm font-medium">{{ role }}</span>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
})
const Role = {
  MANAGER: 'leader',
  WORKER: 'worker',
  ADMIN: 'admin',
}

const badgeClass = computed(() => {
  console.log('roleLabel', props.role)
  switch (props.role) {
    case Role.MANAGER:
      return 'bg-blue-50 text-blue-800 border-blue-800'
    case Role.WORKER: // 工作者
      return 'bg-green-50 text-green-800 border-green-800'
    case Role.ADMIN: // 管理員
      return 'bg-yellow-50 text-yellow-800 border-yellow-800'
    default:
      return 'bg-gray-50 text-gray-800 border-gray-800'
  }
})
</script>
