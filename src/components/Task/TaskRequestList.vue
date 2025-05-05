<template>
  <DashboardCard title="任務清單">
    <template #action>
      <Button @click="$emit('create')" variant="outline">
        <div class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          新增任務
        </div>
      </Button>
    </template>
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
  </DashboardCard>
</template>

<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import type { TaskRequirement } from '@/types/task'
import type { PropType } from 'vue'
import { Plus } from 'lucide-vue-next'
import DashboardCard from '../DashboardCard.vue'

const props = defineProps({
  requirements: {
    type: Array as PropType<TaskRequirement[]>,
    required: true,
  },
})

const emit = defineEmits(['create'])
const requirements = props.requirements
</script>
