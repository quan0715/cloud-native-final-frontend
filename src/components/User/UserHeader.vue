<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      ><div
        class="flex items-center justify-center gap-2 rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-1"
        :class="badgeClass"
      >
        <Avatar class="w-7 h-7">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <!-- 顯示使用者名稱 -->
        <p class="text-md font-normal text-gray-800">{{ labName }}@{{ username }}</p>

        <!-- 身份 Badge -->
        <div class="rounded-full px-4 py-1 bg-gray-100">
          <span class="text-sm font-medium">{{ roleLabel }}</span>
        </div>
      </div></DropdownMenuTrigger
    >
    <DropdownMenuContent class="w-[200px]">
      <DropdownMenuLabel>我的帳號</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>個人資料</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="emit('logout')">登出</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
const Role = {
  MANAGER: 'leader',
  WORKER: 'worker',
  ADMIN: 'admin',
}

const { username, roleLabel, labName } = defineProps({
  username: { type: String, required: true },
  roleLabel: { type: String },
  labName: { type: String, required: true },
})

const badgeClass = computed(() => {
  console.log('roleLabel', roleLabel)
  switch (roleLabel) {
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

const emit = defineEmits(['logout'])
</script>
