<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <Toaster />
  <header></header>

  <main>
    <router-view />
  </main>
</template>

<style scoped></style>
