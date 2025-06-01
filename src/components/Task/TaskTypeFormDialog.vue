<template>
  <Dialog v-model:open="dialogOpen" @update:open="onDialogChange">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-2xl font-thin">
          {{ isEditMode ? '編輯任務類型' : '新增任務類型' }}
        </DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div>
          <Label class="mb-2 block">任務名稱</Label>
          <Input v-model="form.taskName" placeholder="如：電性測試" />
        </div>
        <div>
          <Label class="mb-2 block">所需機台數</Label>
          <NumberField v-model="form.number_of_machine">
            <NumberFieldContent>
              <NumberFieldInput />
              <NumberFieldDecrement />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
        <div>
          <ColorPicker v-model="form.color" label="任務類型顏色" />
          <div class="flex items-center gap-2 mt-2">
            <Label class="text-sm text-gray-600">標籤預覽</Label>
            <ColorBadge :label="form.taskName" :primaryColor="form.color" />
          </div>
        </div>
        <div v-if="isEditMode">
          <Label class="mb-2 block">刪除任務類型</Label>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="outline" class="text-red-500 hover:text-white hover:bg-red-500">
                <Trash class="w-4 h-4" />
                刪除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確定刪除？</AlertDialogTitle>
                <AlertDialogDescription>刪除後將無法恢復。</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction class="bg-red-600 text-white" @click="handleDelete">
                  確定
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <DialogFooter class="mt-4">
        <DialogClose as-child>
          <Button variant="secondary" @click="handleClose">取消</Button>
        </DialogClose>
        <DialogClose as-child>
          <Button @click="handleSubmit">{{ isEditMode ? '儲存' : '確定' }}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog/'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import ColorPicker from '@/components/ui/ColorPicker.vue'
import ColorBadge from '@/components/ColorBadge.vue'
import type { TaskType } from '@/types/task'
import { ref, computed } from 'vue'
import { Trash } from 'lucide-vue-next'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { createTaskType, updateTaskType, deleteTaskType } from '@/repositories/taskRepo'

interface Props {
  taskType?: TaskType
}

interface Emits {
  (e: 'create', state: 'success' | 'error', message: string): void
  (e: 'update', state: 'success' | 'error', message: string): void
  (e: 'delete', state: 'success' | 'error', message: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialogOpen = ref(false)
const isEditMode = computed(() => !!props.taskType)

const form = ref({
  taskName: '',
  number_of_machine: 1,
  color: '#3B82F6',
})

function resetForm() {
  form.value = {
    taskName: '',
    number_of_machine: 1,
    color: '#3B82F6',
  }
}

function initForm() {
  if (props.taskType) {
    form.value = {
      taskName: props.taskType.taskName,
      number_of_machine: props.taskType.number_of_machine,
      color: props.taskType.color || '#3B82F6',
    }
  } else {
    resetForm()
  }
}

function handleClose() {
  resetForm()
}

async function handleSubmit() {
  if (!form.value.taskName || !form.value.number_of_machine) {
    return
  }

  if (isEditMode.value && props.taskType) {
    try {
      await updateTaskType(props.taskType._id, form.value)
      emit('update', 'success', `更新任務類型 ${form.value.taskName} 成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('update', 'error', `更新任務類型 ${form.value.taskName} 失敗，${message}`)
    }
  } else {
    try {
      await createTaskType(form.value)
      emit('create', 'success', `新增任務類型 ${form.value.taskName} 成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('create', 'error', `新增任務類型 ${form.value.taskName} 失敗，${message}`)
    }
  }

  dialogOpen.value = false
  resetForm()
}

async function handleDelete() {
  if (props.taskType) {
    try {
      await deleteTaskType(props.taskType._id)
      emit('delete', 'success', `刪除任務類型 ${props.taskType.taskName} 成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('delete', 'error', `刪除任務類型 ${props.taskType.taskName} 失敗，${message}`)
    }
    dialogOpen.value = false
    resetForm()
  }
}

function onDialogChange(open: boolean) {
  if (open) {
    initForm()
  }
}
</script>
