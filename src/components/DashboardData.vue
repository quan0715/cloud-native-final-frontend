<template>
  <div class="w-full flex flex-col justify-center items-start gap-2 p-2">
    <p class="text-sm text-sans font-thin text-gray-600">{{ title }}</p>
    <slot v-if="hasSlot" />
    <p v-else class="text-xl text-sans font-semibold text-gray-600">{{ content }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, useSlots } from 'vue'

const props = defineProps<{
  title: string
  content: string
}>()

const slots = useSlots()
const hasSlot = !!slots.default && slots.default().length > 0
</script>
