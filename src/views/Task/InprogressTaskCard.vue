<template>
  <DashboardCard title="進行中任務">
    <div v-if="inprogressTask !== null">
      <div :key="inprogressTask._id" class="flex flex-col justify-start items-start gap-2 p-2">
        <ColorBadge
          :label="inprogressTask.taskType?.taskName"
          :primaryColor="inprogressTask.taskType?.color || 'purple'"
          class="text-sm"
        />
        <p class="text-xl text-sans font-semibold text-gray-600">
          {{ inprogressTask.taskName }}
        </p>
      </div>
      <Separator class="w-full my-2" />
      <div :key="inprogressTask._id" class="grid grid-cols-3 gap-2">
        <div
          v-for="(machine, idx) in inprogressTask.machine"
          :key="idx"
          class="col-span-1 flex flex-row justify-start items-start gap-2"
        >
          <DashboardData title="佔用機器" :content="machine.machineName" />
          <Separator
            orientation="vertical"
            v-if="inprogressTask.machine && (idx === 0 || idx % 3 != 0)"
          />
        </div>
      </div>
      <Separator class="w-full my-2" />
      <DashboardData title="開始時間" :content="formatDuration(elapsedSeconds)" />
      <Separator class="w-full my-2" />
      <div class="w-full flex flex-row justify-center items-center gap-2 p-2">
        <Button variant="secondary" class="w-full" @click="onTaskFail">
          <span class="text-sm text-sans font-semibold">取消任務</span>
        </Button>
        <Button variant="default" class="w-full" @click="onTaskComplete">
          <span class="text-sm text-sans font-semibold">完成任務</span>
        </Button>
      </div>
    </div>
    <Button
      v-else
      class="w-full h-full flex justify-center items-center"
      variant="secondary"
      :disabled="inprogressTask !== null"
      @click="startNextTask"
    >
      {{ inprogressTask !== null ? '有進行中的任務' : '點擊開始測試任務' }}
    </Button>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { TaskSnapshot } from '@/types/user'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { startNext, finishTask, failToFinishTask } from '@/repositories/taskRepo'
import { useUserData } from '@/composables/useUserData'
import { toast } from '@/components/ui/toast'
import ColorBadge from '@/components/ColorBadge.vue'
const { userId } = useUserData()

// TODO: add proper type for tasks, add api on it

const { inprogressTask } = defineProps<{ inprogressTask: TaskSnapshot | null }>()
const emit = defineEmits(['taskStarted', 'taskCompleted', 'taskFailed'])

console.log('InprogressTaskCard props:', inprogressTask)

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

async function startNextTask() {
  try {
    const res = await startNext(userId)
    console.log('startNextTask res:', res)
    emit('taskStarted')
  } catch (e) {
    toast({
      title: '開始任務失敗',
      description: e instanceof Error ? e.message : '未知錯誤',
      variant: 'destructive',
    })
  }
}

async function onTaskComplete() {
  if (!inprogressTask) return
  try {
    await finishTask(inprogressTask._id)
    toast({
      title: '任務成功',
      description: '任務已經完成',
      variant: 'default',
    })
    emit('taskCompleted')
  } catch (e) {
    toast({
      title: '完成任務失敗',
      description: e instanceof Error ? e.message : '未知錯誤',
      variant: 'destructive',
    })
  }
}

async function onTaskFail() {
  if (!inprogressTask) return
  try {
    await failToFinishTask(inprogressTask._id)
    toast({
      title: '任務失敗',
      description: '任務已經失敗',
      variant: 'destructive',
    })
    emit('taskFailed')
  } catch (e) {
    toast({
      title: '完成任務失敗',
      description: e instanceof Error ? e.message : '未知錯誤',
      variant: 'destructive',
    })
  }
}
</script>
