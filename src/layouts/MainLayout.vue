<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <main class="flex-1">
      <div class="flex flex-col h-full bg-gray-100 p-4">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>
