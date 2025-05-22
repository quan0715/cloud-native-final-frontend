<template>
  <DashboardCard title="進行中任務">
    <div v-if="inprogressTask && inprogressTask.length > 0">
      <div v-for="task in inprogressTask" class="flex flex-col justify-start items-start gap-2 p-2">
        <div class="px-2 py-1 bg-purple-50 rounded-xl">
          <span class="text-sm text-sans font-semibold text-purple-600">{{
            task._id
          }}</span>
        </div>
        <p class="text-xl text-sans font-semibold text-gray-600">
          {{ task.taskName }}
        </p>
      </div>
      <Separator class="w-full my-2" />
      <div v-for="task in inprogressTask" class="grid grid-cols-3 gap-2">
        <div
          v-for="(machine, idx) in task.machine"
          :key="idx"
          class="col-span-1 flex flex-row justify-start items-start gap-2"
        >
          <DashboardData title="佔用機器" :content="machine.machineName" />
          <Separator orientation="vertical" v-if="task.machine && idx !== task.machine.length - 1" />
        </div>
      </div>
      <Separator class="w-full my-2" />
      <DashboardData title="開始時間" :content="formatDuration(elapsedSeconds)" />
      <Separator class="w-full my-2" />
      <div class="w-full flex flex-row justify-center items-center gap-2 p-2">
        <Button variant="secondary" class="w-full">
          <span class="text-sm text-sans font-semibold">取消任務</span>
        </Button>
        <Button variant="default" class="w-full">
          <span class="text-sm text-sans font-semibold">完成任務</span>
        </Button>
      </div>
    </div>
    <div v-else>
      <p class="text-sm text-sans font-thin text-gray-600">沒有進行中的任務</p>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { TaskSnapshot } from '@/types/user'
import { computed, onMounted, onUnmounted, ref } from 'vue'

// TODO: add proper type for tasks, add api on it

const { inprogressTask } = defineProps<{ inprogressTask: TaskSnapshot[] }>()
console.log('InprogressTaskCard props:', inprogressTask)

// const inprogressTask = ref<{
//   taskCode: string
//   taskName: string
//   machine: string[]
//   startTime: Date
// } | null>(null)

// const startTime = ref(inprogressTask.value?.startTime ?? new Date())
const startTime = ref(new Date())
const now = ref(new Date())

let timer: number | undefined

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const elapsedSeconds = computed(() => {
  return Math.floor((now.value.getTime() - startTime.value.getTime()) / 1000)
})

function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${h} 小時 ${m.toString().padStart(2, '0')} 分鐘 ${s.toString().padStart(2, '0')} 秒`
}
</script>
