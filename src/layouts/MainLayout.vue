<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <h2 class="px-10 py-4 border-b text-xl font-normal">頁面名稱/</h2>
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>
