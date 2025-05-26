<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <Card class="w-96 bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-medium mb-4">新增機器</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">機器負責任務項目</label>
        <!-- template：取代 <select> 區域 -->
          <div class="space-y-1">
          <label class="block text-sm font-medium mb-1">機器負責任務項目（可複選）</label>

          <div
            v-for="n in names"
            :key="n"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :value="n"
              v-model="machine_task_types"
              class="h-4 w-4 rounded border-gray-300"
            />
            <span class="text-sm">{{ n }}</span>
          </div>
        </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">輸入機器名稱</label>
          <input
            v-model="machineName"
            type="text"
            placeholder="輸入機器名稱"
            class="w-full border rounded px-2 py-1"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="close" class="px-4 py-2">取消</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">確定</button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue';
import Card from '../ui/card/Card.vue';

const props = defineProps<{ visible: boolean; names: string[] }>()
const emit = defineEmits(['submit', 'close'])

const machineName = ref<string>('')
const machine_task_types = ref<string[]>([])     // 預設空陣列


watch(() => props.visible, (val) => {
  if (val) {
    machineName.value = ''
    machine_task_types.value = props.names || []
  }
})

function submitForm() {
  console.log('submitForm', machineName.value, machine_task_types.value)
  emit('submit', { machineName: machineName.value, machine_task_types: machine_task_types.value })
  close()
}

function close() {
  emit('close')
}
</script>