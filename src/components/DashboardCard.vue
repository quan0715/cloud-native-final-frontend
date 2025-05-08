<template>
  <div class="bg-background rounded-md shadow-none flex flex-col h-full">
    <!-- Header: title slot and action button slot -->
    <div class="flex items-center justify-between mb-2 border-b">
      <h2 class="text-lg font-thin py-2 px-4">
        <slot name="title">{{ title }}</slot>
      </h2>
      <div class="py-2 px-4">
        <slot name="action" />
      </div>
    </div>
    <div class="py-2 px-4 flex-1 flex flex-col">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ title: string }>()
</script>
