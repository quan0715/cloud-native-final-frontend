<template>
  <div class="flex items-center justify-between px-10 py-4 border-b">
    <h1 class="text-xl font-thin">
      <span class=""> Mini Lab Analysis Task Management/{{ envTag }}/ </span>
      <span class="text-blue-600">{{ $route.meta.title }}</span>
    </h1>
    <div class="flex items-center gap-4 h-[48px]">
      <UserHeader :username="username" lab-name="lab11" :role-label="roleLabel" @logout="logout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserHeader from '@/components/User/UserHeader.vue'
import { useLogout } from '@/composables/useLogout'
import { useUserData } from '@/composables/useUserData'
const { logout } = useLogout()
const { username, roleLabel } = useUserData()

const envTag = import.meta.env.VITE_ENV_TAG
</script>
