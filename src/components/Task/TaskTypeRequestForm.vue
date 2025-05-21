<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <Card class="w-96 bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-lg font-medium mb-4">新增任務類型</h3>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- 任務名稱 -->
        <div>
          <label class="block text-sm font-medium mb-1">任務名稱</label>
          <input
            v-model="taskName"
            type="text"
            placeholder="輸入任務名稱，例如：電性測試"
            class="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <!-- 需要機台數量 -->
        <div>
          <label class="block text-sm font-medium mb-1">需要機台數量</label>
          <input
            v-model.number="numberOfMachine"
            type="number"
            min="1"
            class="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <!-- 按鈕 -->
        <div class="flex justify-end space-x-2">
          <button type="button" @click="close" class="px-4 py-2">取消</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">
            確定
          </button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import { defineEmits, defineProps, ref, watch } from 'vue';

/* -------- props / emit -------- */
const props = defineProps<{ visible: boolean }>()
const emit  = defineEmits<{
  (e: 'submit', payload: { taskName: string; number_of_machine: number }): void
  (e: 'close'): void
}>()

/* -------- 表單狀態 -------- */
const taskName        = ref<string>('')
const numberOfMachine = ref<number | null>(null)

/* -------- 當表單重新開啟，重置欄位 -------- */
watch(
  () => props.visible,
  (val) => {
    if (val) {
      taskName.value        = ''
      numberOfMachine.value = null
    }
  },
)

/* -------- 提交 -------- */
function submitForm() {
  if (!taskName.value || !numberOfMachine.value) return
  emit('submit', {
    taskName: taskName.value,
    number_of_machine: numberOfMachine.value,
  })
  close()
}

/* -------- 關閉 -------- */
function close() {
  emit('close')
}
</script>
