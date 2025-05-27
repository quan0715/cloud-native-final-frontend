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
import { fetchTaskTypes, createTask } from '@/repositories/taskRepo'
import { toast } from '@/components/ui/toast/use-toast'

const createOpen = ref(false)
const createTypeId = ref('')
const createName = ref('')
const taskType = ref<TaskType[]>([])

onMounted(async () => {
  taskType.value = await fetchTaskTypes()
})

function resetCreate() {
  createTypeId.value = ''
  createName.value = ''
}

async function submitCreate() {
  if (!createTypeId.value || !createName.value) {
    alert('請選擇任務項目並輸入任務名稱。')
    return
  }

  try {
    await createTask({
      taskTypeId: createTypeId.value,
      taskName: createName.value,
    })

    emit('create')
    toast({
      title: '新增任務成功',
      description: `任務 ${createName.value} (${taskType.value.find((t) => t._id === createTypeId.value)?.taskName})已新增`,
    })
    resetCreate()
    createOpen.value = false
  } catch (error) {
    console.error('Submit create error:', error)
    toast({
      title: '新增任務失敗',
      description: '新增任務失敗',
    })
  }
}

const emit = defineEmits(['create'])
</script>
