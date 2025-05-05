<template>
  <div class="bg-white rounded-xl shadow p-4">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-medium">任務需求</h2>
      <Button size="sm" @click="$emit('create')" class="bg-blue-50 text-blue-800">＋新增任務</Button>
    </div>
    <ul class="space-y-2">
      <li v-for="item in requirements" :key="item.id">
        <Card class="items-center p-4 bg-white rounded-lg shadow-sm">
          <Badge class="text-purple-600 bg-purple-100">{{ item.type }}</Badge>
          <p class="mt-1 font-semibold">{{ item.code }}</p>
          <p class="text-xs text-gray-500">
            {{ '#' + item.tags.join(' #') }}
          </p>
        </Card>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import type { TaskRequirement } from '@/types/task'
import type { PropType } from 'vue'




const props = defineProps({
  requirements: {
    type: Array as PropType<TaskRequirement[]>,
    required: true
  }
})

const emit = defineEmits(['create'])
const requirements = props.requirements
</script>
