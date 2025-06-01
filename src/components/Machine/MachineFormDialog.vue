<template>
  <Dialog v-model:open="dialogOpen" @update:open="handleOpen">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-2xl font-thin">
          {{ isEditMode ? '編輯機器' : '新增機器' }}
        </DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div>
          <Label class="mb-2 block">機器名稱</Label>
          <Input v-model="form.machineName" />
        </div>
        <div>
          <Label class="mb-2 block text-sm font-semibold">機器負責任務項目（可複選）</Label>

          <div class="flex flex-col gap-2">
            <div v-for="t in taskTypes" :key="t._id" class="flex items-center gap-2">
              <Checkbox
                :model-value="form.taskIds.includes(t._id ?? '')"
                @update:model-value="toggleTask(t._id ?? '')"
              />
              <ColorBadge
                :label="t.taskName ?? ''"
                :primaryColor="t.color ?? '#EA4B44'"
                class="text-sm p-0"
              />
            </div>
          </div>
        </div>
        <div>
          <Label class="mb-2 block">刪除機器</Label>
          <AlertDialog v-if="isEditMode && machine" as-child>
            <AlertDialogTrigger as-child>
              <Button variant="outline" class="text-red-500 hover:text-white hover:bg-red-500">
                <Trash class="w-4 h-4" />
                刪除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確定刪除？</AlertDialogTitle>
                <AlertDialogDescription> 刪除後將無法恢復。 </AlertDialogDescription>
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
      <DialogFooter class="mt-4 flex justify-between gap-2">
        <div class="flex-1 flex justify-end gap-2">
          <DialogClose as-child>
            <Button variant="secondary" @click="handleClose">取消</Button>
          </DialogClose>
          <DialogClose as-child>
            <Button @click="handleSubmit">確定</Button>
          </DialogClose>
        </div>
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
import { type Machine } from '@/types/machine'
import { ref, computed } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import ColorBadge from '@/components/ColorBadge.vue'
import { createMachine, updateMachine, deleteMachine } from '@/repositories/MachineRepo'
import type { TaskType } from '@/types/task'
import { Trash } from 'lucide-vue-next'
type Props = {
  machine: Machine | undefined
  taskTypes: TaskType[]
  // isOpen: boolean
}
const { machine, taskTypes } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update', state: 'success' | 'error', message: string): void
  (e: 'delete', state: 'success' | 'error', message: string): void
  (e: 'create', state: 'success' | 'error', message: string): void
}>()

const form = ref({
  machineName: '',
  taskIds: [] as string[],
})

const isEditMode = computed(() => machine !== undefined)

const dialogOpen = ref(false)

function resetForm() {
  form.value = { machineName: '', taskIds: [] }
}

function toggleTask(taskId: string) {
  if (form.value.taskIds.includes(taskId)) {
    form.value.taskIds = form.value.taskIds.filter((id) => id !== taskId)
  } else {
    form.value.taskIds.push(taskId)
  }
}

function openEdit(machine: Machine) {
  form.value = {
    machineName: machine.machineName,
    taskIds: machine.machine_task_types.map((t) => t._id),
  }
}

async function handleDelete() {
  if (isEditMode.value && machine) {
    try {
      await deleteMachine(machine._id)
      emit('delete', 'success', `刪除機器${machine.machineName}成功`)
      dialogOpen.value = false // 關閉 Dialog
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('delete', 'error', `刪除機器${machine.machineName}失敗，${message}`)
    }
  }
}

function handleOpen(open: boolean) {
  dialogOpen.value = open
  if (open) {
    if (isEditMode.value && machine) {
      openEdit(machine)
    } else {
      resetForm()
    }
  }
}
function handleClose() {
  resetForm()
}
async function handleSubmit() {
  if (!form.value.machineName) {
    return
  }

  if (isEditMode.value && machine) {
    try {
      await updateMachine({
        _id: machine._id,
        machineName: form.value.machineName,
        machine_task_types: form.value.taskIds,
      })
      emit('update', 'success', `更新機器${machine.machineName}成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('update', 'error', `更新機器${machine.machineName}失敗，${message}`)
    }
  } else {
    try {
      await createMachine({
        machineName: form.value.machineName,
        machine_task_types: form.value.taskIds,
      })
      emit('create', 'success', `新增機器${form.value.machineName}成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('create', 'error', `新增機器${form.value.machineName}失敗，${message}`)
    }
  }
}
</script>
