<template>
  <!-- 右上角「新增任務」按鈕 -->
  <Dialog v-model:open="createOpen">
    <DialogTrigger as-child>
      <Button variant="outline">
        <Plus class="w-8 h-8" />
        新增任務
      </Button>
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>新增任務</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="submitCreate" class="space-y-4">
        <!-- 任務項目 -->
        <div>
          <Label class="mb-1 block">任務項目</Label>
          <Select v-model="createTypeId">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="請選擇任務項目" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in taskType" :key="n._id" :value="n._id">
                {{ n.taskName }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- 任務名稱 -->
        <div>
          <Label class="mb-1 block">任務名稱</Label>
          <Input v-model="createName" placeholder="輸入任務名稱" />
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="secondary" @click="resetCreate">取消</Button>
          </DialogClose>
          <Button type="submit">確定</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label/Label.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import type { TaskType } from '@/types/task'

const createOpen = ref(false)
const createTypeId = ref('')
const createName = ref('')
const taskType = ref<TaskType[]>([])

onMounted(async () => {
  taskType.value = await fetchTaskType()
})

function resetCreate() {
  createTypeId.value = ''
  createName.value = ''
}

async function fetchTaskType() {
  const base = import.meta.env.VITE_API_BASE_URL
  const res = await fetch(`${base}/task-types`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const taskType = (await res.json()) as TaskType[]
  return taskType
}

async function submitCreate() {
  if (!createTypeId.value || !createName.value) {
    alert('請選擇任務項目並輸入任務名稱。')
    return
  }

  const base = import.meta.env.VITE_API_BASE_URL
  try {
    const response = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskTypeId: createTypeId.value,
        taskName: createName.value,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('API Error:', response.status, errorBody)
      alert(`新增任務失敗：${response.status} - ${errorBody || response.statusText}`)
      throw new Error(`HTTP error ${response.status}`)
    }

    emit('create')
    resetCreate()
    createOpen.value = false
  } catch (error) {
    console.error('Submit create error:', error)
  }
}

const emit = defineEmits(['create'])
</script>
