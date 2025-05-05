<template>
  <div class="bg-white rounded-md shadow-none">
    <!-- Header: title slot and action button slot -->
    <div class="flex items-center justify-between mb-3 border-b">
      <h2 class="text-lg font-thin py-2 px-4">
        <slot name="title">{{ title }}</slot>
      </h2>
      <div class="py-2 px-4">
        <slot name="action" />
      </div>
    </div>
    <!-- Content slot -->
    <div class="py-2 px-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{ title: string }>()
</script>