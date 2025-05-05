<template>
  <div class="flex items-center gap-4">
    <!-- 顯示使用者名稱 -->
    <p>{{ username }}</p>

    <!-- 身份 Badge -->
    <Badge class="w-fit h-9" :class="badgeClass">{{ roleLabel }}</Badge>

    <!-- 登出按鈕 -->
    <Button class="w-fit" variant="destructive" @click="$emit('logout')"> Logout </Button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'

const Role = {
  MANAGER: '管理者',
  WORKER: '工作者',
  ADMIN: 'admin',
}

const { username, roleLabel } = defineProps({
  username: { type: String, required: true },
  roleLabel: { type: String },
})

const badgeClass = computed(() => {
  console.log('roleLabel', roleLabel)
  switch (roleLabel) {
    case Role.MANAGER:
      return 'bg-blue-100 text-blue-800'
    case Role.WORKER:
      return 'bg-green-100 text-green-800'
    case Role.ADMIN:
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const emit = defineEmits(['logout'])
</script>
