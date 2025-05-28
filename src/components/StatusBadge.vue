<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium shadow-sm"
    :style="{ backgroundColor: computedBackgroundColor, color: computedTextColor }"
  >
    <span
      class="inline-block w-2 h-2 rounded-full mr-1.5"
      :style="{ backgroundColor: computedTextColor }"
    ></span>
    {{ displayLabel }}
  </span>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import tinycolor from 'tinycolor2'

// 定義預設狀態及其對應的主顏色
const statusColors: Record<string, string> = {
  idle: '#D1D5DB', // 灰色 (Gray-400)
  'in-progress': '#3B82F6', // 藍色 (Blue-500)
  draft: '#F59E0B', // 琥珀色 (Amber-500)
  success: '#10B981', // 綠色 (Emerald-500)
  error: '#EF4444', // 紅色 (Red-500)
  warning: '#F97316', // 橘色 (Orange-500)
  archived: '#6B7280', // 灰色 (Gray-500)
  // 您可以根據需要添加更多狀態
}

interface Props {
  status: keyof typeof statusColors // 狀態必須是 statusColors 中的一個鍵
  label?: string // 標籤的文字內容 (可選)
}

const props = defineProps<Props>()

// 獲取當前狀態的主顏色，如果狀態未知則使用預設灰色
const primaryColor = computed(() => {
  return statusColors[props.status] || '#D1D5DB' // 預設為灰色
})

// 顯示的標籤：如果提供了 label prop，則使用它，否則使用狀態名稱
const displayLabel = computed(() => {
  return props.label || props.status
})

// 計算背景色：主色與白色混合，其中白色佔比較高以獲得柔和的背景
const computedBackgroundColor = computed(() => {
  return tinycolor.mix(primaryColor.value, '#ffffff', 90).toHexString() // 90% 白色混合
})

// 計算文字顏色：直接使用主色，或進行調整以確保對比度
const computedTextColor = computed(() => {
  const color = tinycolor(primaryColor.value)
  // 可以添加邏輯以根據背景調整文字顏色以獲得更好的可讀性
  // 例如，如果背景非常淺，主色可能也需要加深一點
  // 為了簡單起見，目前直接使用主色，但如果主色本身很淺，可能會與淺色背景衝突
  // 一個簡單的檢查可以是：如果主色非常亮，則使用更深色的版本
  if (color.isLight() && tinycolor.mix(primaryColor.value, '#ffffff', 90).isLight()) {
    return color.darken(30).toString() // 如果主色和背景色都淺，加深文字顏色
  }
  return color.toString()
})
</script>
