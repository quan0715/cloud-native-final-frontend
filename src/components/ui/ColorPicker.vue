<template>
  <div class="space-y-3">
    <Label v-if="label" class="text-sm font-medium">{{ label }}</Label>

    <!-- 預設顏色選項 -->
    <div class="grid grid-cols-6 gap-2">
      <button
        v-for="color in presetColors"
        :key="color"
        type="button"
        class="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
        :class="[
          modelValue === color
            ? 'border-gray-800 shadow-md'
            : 'border-gray-300 hover:border-gray-400',
        ]"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
        :title="color"
      />
    </div>

    <!-- 自定義顏色選擇器 -->
    <div class="flex items-center gap-2">
      <Label class="text-sm text-gray-600">自定義：</Label>
      <div class="relative">
        <input
          type="color"
          :value="modelValue"
          @input="handleColorInput"
          class="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
      </div>
      <span class="text-sm text-gray-500 font-mono">{{ modelValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Props {
  modelValue: string
  label?: string
}

defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 預設顏色選項
const presetColors = [
  '#3B82F6', // 藍色
  '#EF4444', // 紅色
  '#10B981', // 綠色
  '#F59E0B', // 黃色
  '#8B5CF6', // 紫色
  '#F97316', // 橙色
  '#EC4899', // 粉紅色
  '#06B6D4', // 青色
  '#84CC16', // 萊姆色
  '#6366F1', // 靛色
  '#64748B', // 石板灰
  '#DC2626', // 深紅色
]

function selectColor(color: string) {
  emit('update:modelValue', color)
}

function handleColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
