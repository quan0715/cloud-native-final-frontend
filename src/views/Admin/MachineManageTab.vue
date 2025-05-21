<template>
  <DashboardCard title="實驗室機器管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div
        v-for="m in machines"
        :key="m._id"
        class="flex flex-col gap-2"
      >
        <div class="flex items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl">
          <!-- 機器名稱 -->
          <div class="flex flex-col gap-1 min-w-48">
            <p class="text-sm text-gray-500">ID: {{ m._id }}</p>
            <p class="text-xl font-semibold">{{ m.machineName }}</p>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 任務類型 -->
          <DashboardData
            title="支援任務"
            :content="m.machine_task_types.map((t) => t.taskName).join(', ')"
          />

          <Separator orientation="vertical" class="h-auto" />

          <!-- 編輯 / 刪除 -->
          <div class="flex items-center gap-2">
            <!-- Edit Dialog -->
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" size="icon" @click="openEdit(m)">
                  <Edit class="w-4 h-4" />
                </Button>
              </DialogTrigger>

              <DialogContent class="max-w-sm">
                <DialogHeader>
                  <DialogTitle>編輯機器</DialogTitle>
                </DialogHeader>

                <div class="space-y-4">
                  <!-- 名稱 -->
                  <div>
                    <Label class="mb-1 block">機器名稱</Label>
                    <Input v-model="editName" />
                  </div>

                  <!-- 多選任務 (checkbox) -->
                  <div>
                    <Label class="mb-1 block">支援任務</Label>
                    <div
                      v-for="t in taskTypes"
                      :key="t._id"
                      class="flex items-center gap-2"
                    >
                      <Checkbox
                          :model-value="editTaskIds.includes(t._id)"
                          @update:model-value="toggleTask(t._id)"
                      />
                      <span>{{ t.taskName }}</span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="secondary" @click="closeEdit">取消</Button>
                  </DialogClose>
                  <DialogClose as-child>
                    <Button @click="saveEdit(m._id)">儲存</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <!-- Delete Alert -->
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="ghost" size="icon" class="text-red-600">
                  <Trash class="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>確定刪除？</AlertDialogTitle>
                  <AlertDialogDescription>
                    刪除後將無法恢復。
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    class="bg-red-600 text-white"
                    @click="emit('delete', m._id)"
                  >
                    確定
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog/'
import Button from '@/components/ui/button/Button.vue'
import { Checkbox } from '@/components/ui/checkbox/'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { Machine } from '@/types/machine'
import type { TaskType } from '@/types/task'
import { Edit, Trash } from 'lucide-vue-next'
import { defineEmits, defineProps, ref } from 'vue'

/* -------- props & emits -------- */
const props = defineProps<{
  machines: Machine[]
  taskTypes: TaskType[]            // 父層提前傳入全部 TaskType
}>()

const emit = defineEmits<{
  /** 儲存修改 */
  (e: 'update', payload: { _id: string; machineName: string; taskIds: string[] }): void
  /** 刪除 */
  (e: 'delete', id: string): void
}>()

/* -------- 編輯表單狀態 -------- */
const editName     = ref('')
const editTaskIds  = ref<string[]>([])

function closeEdit() {
  editName.value = ''
  editTaskIds.value = []

}

function saveEdit(id: string) {
  console.log('saveEdit', id, editName.value, editTaskIds.value)
  emit('update', {
    _id: id,
    machineName: editName.value,
    taskIds: editTaskIds.value,
  })
  closeEdit()
}
function toggleTask(id: string) {
  if (editTaskIds.value.includes(id)) {
    editTaskIds.value = editTaskIds.value.filter((t) => t !== id)
  } else {
    editTaskIds.value.push(id)
  }
}
function openEdit(machine: Machine) {
  editName.value    = machine.machineName
  // 先取出 _id 陣列放進 editTaskIds
  editTaskIds.value = machine.machine_task_types.map((t) => t._id)
}
</script>

