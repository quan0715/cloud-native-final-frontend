<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <Card class="w-96 bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-medium mb-4">新增任務</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">任務項目</label>
          <select v-model="selectedName" class="w-full border rounded px-2 py-1">
            <option disabled value="">請選擇任務項目</option>
            <option v-for="n in names" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">輸入任務名稱</label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="輸入任務名稱"
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

const selectedName = ref<string>(props.names[0] || '')
const tagsInput = ref<string>('')

watch(() => props.visible, (val) => {
  if (val) {
    selectedName.value = props.names[0] || ''
    tagsInput.value = ''
  }
})

function submitForm() {
  emit('submit', { name: selectedName.value, tagsInput: tagsInput.value })
  close()
}

function close() {
  emit('close')
}
</script>