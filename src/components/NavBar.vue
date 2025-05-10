<template>
  <div class="flex items-center justify-between px-10 py-4 border-b">
    <h1 class="text-xl font-thin">
      <span class=""> Mini Lab Analysis Task Management/{{ envTag }}/ </span>
      <span class="text-blue-600">{{ $route.meta.title }}</span>
    </h1>
    <div class="flex items-center gap-4 h-[48px]">
      <UserHeader
        :username="username"
        lab-name="lab11"
        :role-label="roleLabel"
        @logout="handleLogout"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserHeader from '@/components/User/UserHeader.vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
const token = localStorage.getItem('token') || ''
const decodedToken = jwtDecode(token) as { id: string; role: string }
const username = decodedToken.id
const roleLabel = decodedToken.role

const envTag = import.meta.env.VITE_ENV_TAG

// const emit = defineEmits(['logout'])
const router = useRouter()

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
  // emit('logout')
}
</script>
