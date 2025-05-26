<script setup lang="ts">
import FullPageLoader from '@/components/ui/FullPageLoader.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { provide, ref } from 'vue'

const loading = ref(false)
provide('globalLoading', loading)
</script>

<template>
  <Toaster />
  <header></header>

  <main>
    <router-view />
  </main>

  <FullPageLoader v-if="loading" />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s }
.fade-enter-from,
.fade-leave-to    { opacity: 0 }
</style>
