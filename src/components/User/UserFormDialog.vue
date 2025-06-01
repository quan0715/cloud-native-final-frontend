<template>
  <Dialog v-model:open="dialogOpen" @update:open="onDialogChange">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-2xl font-thin">
          {{ isEditMode ? '編輯使用者' : '新增使用者' }}
        </DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div>
          <Label class="mb-2 block">使用者名稱</Label>
          <Input v-model="form.userName" />
        </div>
        <div>
          <Label class="mb-2 block">角色</Label>
          <Select v-model="form.userRole">
            <SelectTrigger class="w-fit">
              <UserRoleChip :role="form.userRole" class="w-fit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <UserRoleChip role="admin" class="w-fit" />
              </SelectItem>
              <SelectItem value="leader">
                <UserRoleChip role="leader" class="w-fit" />
              </SelectItem>
              <SelectItem value="worker">
                <UserRoleChip role="worker" class="w-fit" />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div v-if="form.userRole === 'worker'">
          <Label class="mb-2 block">可執行任務（複選）</Label>
          <div class="flex flex-col gap-2">
            <div v-for="t in taskTypes" :key="t._id" class="flex items-center gap-2">
              <Checkbox
                :model-value="form.taskIds.includes(t._id)"
                @update:model-value="toggleTask(t._id)"
              />
              <ColorBadge
                :label="t.taskName"
                :primaryColor="t.color ?? '#EA4B44'"
                class="text-sm p-0"
              />
            </div>
          </div>
        </div>
        <div v-if="isEditMode">
          <Label class="mb-2 block">刪除使用者</Label>
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
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import ColorBadge from '@/components/ColorBadge.vue'
import type { User } from '@/types/user'
import type { TaskType } from '@/types/task'
import { ref, computed } from 'vue'
import { Trash } from 'lucide-vue-next'
import { createUser, updateUser, deleteUser } from '@/repositories/userRepo'
import UserRoleChip from '@/components/User/UserRoleChip.vue'

interface Props {
  user?: User
  taskTypes: TaskType[]
}

interface Emits {
  (e: 'create', state: 'success' | 'error', message: string): void
  (e: 'update', state: 'success' | 'error', message: string): void
  (e: 'delete', state: 'success' | 'error', message: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialogOpen = ref(false)
const isEditMode = computed(() => !!props.user)

const form = ref({
  userName: '',
  userRole: 'worker',
  taskIds: [] as string[],
})

function resetForm() {
  form.value = {
    userName: '',
    userRole: 'worker',
    taskIds: [],
  }
}

function initForm() {
  if (props.user) {
    form.value = {
      userName: props.user.userName,
      userRole: props.user.userRole,
      taskIds: props.user.user_task_types.map((t) => t._id),
    }
  } else {
    resetForm()
  }
}

function toggleTask(taskId: string) {
  if (form.value.taskIds.includes(taskId)) {
    form.value.taskIds = form.value.taskIds.filter((id) => id !== taskId)
  } else {
    form.value.taskIds.push(taskId)
  }
}

function onDialogChange(open: boolean) {
  if (open) {
    initForm()
  }
}

function handleClose() {
  resetForm()
}

async function handleSubmit() {
  if (!form.value.userName) {
    return
  }

  if (isEditMode.value && props.user !== undefined) {
    try {
      const toAddTaskTypes = form.value.taskIds.filter(
        (id) => !props.user!.user_task_types.some((t) => t._id === id),
      )
      const toRemoveTaskTypes = props.user.user_task_types.filter(
        (t) => !form.value.taskIds.includes(t._id),
      )
      await updateUser({
        _id: props.user._id,
        userName: form.value.userName,
        userRole: form.value.userRole,
        toAddTaskTypes,
        toRemoveTaskTypes: toRemoveTaskTypes.map((t) => t._id),
      })
      emit('update', 'success', `更新使用者 ${form.value.userName} 成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('update', 'error', `更新使用者 ${form.value.userName} 失敗，${message}`)
    }
  } else {
    try {
      await createUser({
        userName: form.value.userName,
        userRole: form.value.userRole,
        taskIds: form.value.userRole === 'worker' ? form.value.taskIds : [],
      })
      emit('create', 'success', `新增使用者 ${form.value.userName} 成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('create', 'error', `新增使用者 ${form.value.userName} 失敗，${message}`)
    }
  }

  dialogOpen.value = false
  resetForm()
}

async function handleDelete() {
  if (props.user) {
    try {
      await deleteUser(props.user._id)
      emit('delete', 'success', `刪除使用者 ${props.user.userName} 成功`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知錯誤'
      emit('delete', 'error', `刪除使用者 ${props.user.userName} 失敗，${message}`)
    }
    dialogOpen.value = false
    resetForm()
  }
}
</script>
