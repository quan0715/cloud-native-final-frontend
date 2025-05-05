<template>
  <div class="bg-white rounded-md shadow-none">
    <h2 class="text-lg font-thin mb-3 border-b py-2 px-4">{{ title }}</h2>
    <div class="py-2 px-4">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  title: string
}>()
</script>
