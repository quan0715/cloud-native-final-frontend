<template>
  <div class="flex items-center justify-between px-10 py-4 border-b">
    <h1 class="text-xl font-thin">Mini Lab Analysis Task Management</h1>
    <UserHeader :username="username" role-label="管理者" @logout="handleLogout" />
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
