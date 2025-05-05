<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <h2 class="px-10 py-4 border-b text-2xl font-thin">{{ $route.meta.title }}/</h2>
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
