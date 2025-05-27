<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium shadow-sm"
    :style="{ backgroundColor: computedBackgroundColor, color: computedTextColor }"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import tinycolor from 'tinycolor2' // 引入函式庫

// 定義 props
// label: 標籤的文字內容
// primaryColor: 主色，例如 '#3B82F6', 'blue', 'rgb(59, 130, 246)'
interface Props {
  label: string
  primaryColor: string // 主色，例如 '#3B82F6', 'blue', 'rgb(59, 130, 246)'
}

const props = defineProps<Props>()

// 計算背景色：主色與白色混合，其中白色佔 70%
const computedBackgroundColor = computed(() => {
  return tinycolor.mix(props.primaryColor, '#ffffff', 95).toHexString()
})

// 計算文字顏色：直接使用主色
// 你可以根據需要調整此邏輯以確保最佳的視覺對比度
const computedTextColor = computed(() => {
  const primary = tinycolor(props.primaryColor)
  // 為了確保對比度，可以檢查主色在計算出的背景色上的可讀性
  // 例如： if (!tinycolor.isReadable(primary, computedBackgroundColor.value, { level: "AA", size: "small" })) {
  //   return primary.darken(15).toString(); // 如果不可讀，則加深主色
  // }
  return primary.toString() // 目前直接使用主色
})
</script>
