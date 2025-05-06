<template>
  <div class="flex items-center justify-between px-10 py-4 border-b">
    <h1 class="text-xl font-thin">
      <span class="">Mini Lab Analysis Task Management/ </span>
      <span class="text-blue-600">{{ $route.meta.title }}</span>
    </h1>
    <div class="flex items-center gap-4 h-[48px]">
      <div
        class="h-full flex items-center justify-center gap-4 rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2"
      >
        <p class="text-md font-normal text-gray-800">Lab 11</p>
      </div>
      <UserHeader :username="username" role-label="管理者" @logout="handleLogout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserHeader from '@/components/User/UserHeader.vue'
import { useRouter } from 'vue-router'

const username = localStorage.getItem('token') || ''

// const emit = defineEmits(['logout'])
const router = useRouter()

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
  // emit('logout')
}
</script>
