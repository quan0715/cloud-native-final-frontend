<template>
  <div
    class="flex flex-col justify-start md:flex-row items-start md:items-center md:justify-between px-4 md:px-10 py-4 border-b gap-2"
  >
    <h1 class="text-xl font-thin flex flex-row justify-start items-center gap-2">
      <span class="hidden md:block"> Mini Lab Analysis Task Management/{{ envTag }}/ </span>
      <span class="text-blue-600">{{ $route.meta.title }} </span>
    </h1>
    <div class="flex items-center gap-4 h-[48px]">
      <UserHeader :username="username" lab-name="lab11" :role-label="userRole" @logout="logout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserHeader from '@/components/User/UserHeader.vue'
import { useLogout } from '@/composables/useLogout'
import { useUserData } from '@/composables/useUserData'
const { logout } = useLogout()
const { username, userRole } = useUserData()

const envTag = import.meta.env.VITE_ENV_TAG
</script>
