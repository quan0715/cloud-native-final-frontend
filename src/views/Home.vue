<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
const router = useRouter()

const username = localStorage.getItem('token')
if (!username) {
  router.push('/login')
}

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="flex flex-row justify-between px-10 py-4">
      <div>
        <h1 class="text-xl font-thin">Mini Lab Analysis Task Management (Beta Version)</h1>
      </div>
      <div class="flex flex-row items-center gap-4">
        <p>{{ username }}</p>
        <Badge class="w-fit"> 管理者 </Badge>
        <Button class="w-fit" variant="destructive" @click="handleLogout">Logout</Button>
      </div>
    </div>
  </div>
</template>
