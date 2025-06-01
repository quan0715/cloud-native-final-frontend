<template>
  <!-- 右上角「新增任務」按鈕 -->
  <Dialog :open="modelValue" @update:open="handleOpenChange">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 任務項目 -->
        <div>
          <Label class="mb-1 block">任務項目</Label>
          <Select v-model="createTypeId">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="請選擇任務項目" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in taskType" :key="n._id" :value="n._id">
                <!-- {{ n.taskName }} -->
                <ColorBadge :label="n.taskName" :primaryColor="n.color ?? '#3B82F6'" />
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
          <Button
            v-if="isEditMode"
            variant="destructive"
            type="button"
            @click="openDeleteConfirmDialog"
            class="mr-auto"
            >刪除</Button
          >
          <DialogClose as-child>
            <Button variant="secondary" type="button" @click="resetForm">取消</Button>
          </DialogClose>
          <Button type="submit">確定</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <AlertDialog :open="isDeleteConfirmOpen" @update:open="isDeleteConfirmOpen = $event">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>確認刪除</AlertDialogTitle>
        <AlertDialogDescription>
          您確定要刪除任務 "{{ props.taskToEdit?.taskName }}" 嗎？此操作無法復原。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="isDeleteConfirmOpen = false">取消</AlertDialogCancel>
        <AlertDialogAction @click="handleDelete">確定刪除</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
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
import { onMounted, ref, computed, watch } from 'vue'
import type { TaskType, Task } from '@/types/task'
import { fetchTaskTypes, createTask, updateDraftTask, deleteTask } from '@/repositories/taskRepo'
import { toast } from '@/components/ui/toast/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import ColorBadge from '@/components/ColorBadge.vue'

interface Props {
  modelValue: boolean
  taskToEdit?: Task | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'taskSaved', 'taskDeleted'])

const createTypeId = ref('')
const createName = ref('')
const taskType = ref<TaskType[]>([])

const isDeleteConfirmOpen = ref(false)

const isEditMode = computed(() => !!props.taskToEdit)
const dialogTitle = computed(() => (isEditMode.value ? '編輯任務' : '新增任務'))

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      if (isEditMode.value && props.taskToEdit) {
        createTypeId.value = props.taskToEdit.taskTypeId._id
        createName.value = props.taskToEdit.taskName
      } else {
        resetForm()
      }
    }
  },
)

onMounted(async () => {
  taskType.value = await fetchTaskTypes()
})

function resetForm() {
  createTypeId.value = ''
  createName.value = ''
}

function handleOpenChange(open: boolean) {
  emit('update:modelValue', open)
}

function openDeleteConfirmDialog() {
  isDeleteConfirmOpen.value = true
}

async function handleDelete() {
  if (!isEditMode.value || !props.taskToEdit) return

  try {
    await deleteTask(props.taskToEdit._id)
    toast({
      title: '刪除任務成功',
      description: `任務 ${props.taskToEdit.taskName} 已刪除`,
    })
    emit('taskDeleted')
    emit('update:modelValue', false) // Close the main edit dialog
    isDeleteConfirmOpen.value = false // Close the confirm dialog
  } catch (error) {
    console.error('Delete error:', error)
    toast({
      title: '刪除任務失敗',
      description: (error as Error)?.message || '發生未知錯誤',
      variant: 'destructive',
    })
    isDeleteConfirmOpen.value = false // Close the confirm dialog
  }
}

async function handleSubmit() {
  if (!createTypeId.value || !createName.value) {
    toast({
      title: '欄位錯誤',
      description: '請選擇任務項目並輸入任務名稱。',
      variant: 'destructive',
    })
    return
  }

  try {
    const taskData = {
      taskTypeId: createTypeId.value,
      taskName: createName.value,
    }

    if (isEditMode.value && props.taskToEdit) {
      await updateDraftTask(props.taskToEdit._id, taskData)
      toast({
        title: '更新任務成功',
        description: `任務 ${createName.value} 已更新`,
      })
    } else {
      await createTask(taskData)
      toast({
        title: '新增任務成功',
        description: `任務 ${createName.value} (${taskType.value.find((t) => t._id === createTypeId.value)?.taskName})已新增`,
      })
    }
    emit('taskSaved')

    resetForm()
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Submit error:', error)
    toast({
      title: isEditMode.value ? '更新任務失敗' : '新增任務失敗',
      description: (error as Error)?.message || '發生未知錯誤',
      variant: 'destructive',
    })
  }
}
</script>
