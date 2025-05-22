<template>
  <DashboardCard title="任務類型管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div
        v-for="t in taskTypes"
        :key="t._id"
        class="flex flex-col gap-2"
      >
        <div class="flex items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl">
          <!-- 任務基本資訊 -->
          <div class="flex flex-col gap-1 min-w-48">
            <p class="text-sm text-gray-500">ID: {{ t._id }}</p>
            <p class="text-xl font-semibold">{{ t.taskName }}</p>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 所需機台數 -->
          <DashboardData
            title="所需機台數"
            :content="t.number_of_machine.toString()"
          />

          <Separator orientation="vertical" class="h-auto" />

          <!-- 編輯 / 刪除 -->
          <div class="flex items-center gap-2">
            <!-- Edit Dialog -->
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" size="icon" @click="openEdit(t)">
                  <Edit class="w-4 h-4" />
                </Button>
              </DialogTrigger>

              <DialogContent class="max-w-sm">
                <DialogHeader>
                  <DialogTitle>編輯任務類型</DialogTitle>
                </DialogHeader>

                <div class="space-y-4">
                  <div>
                    <Label class="mb-1 block">任務名稱</Label>
                    <Input v-model="editName" />
                  </div>

                  <div>
                    <Label class="mb-1 block">所需機台數</Label>
                    <Input
                      type="number"
                      min="1"
                      v-model.number="editNum "
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="secondary" @click="resetEdit">取消</Button>
                  </DialogClose>

                  <DialogClose as-child>
                    <Button @click="saveEdit(t._id)">儲存</Button>
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
                    @click="emit('delete', t._id)"
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
/* --- imports -------------------------------------------------------- */
import DashboardCard from '@/components/DashboardCard.vue';
import DashboardData from '@/components/DashboardData.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog/'; // barrel 匯出路徑依專案調整
import Button from '@/components/ui/button/Button.vue';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import type { TaskType } from '@/types/task';
import { Edit, Trash } from 'lucide-vue-next';
import { defineEmits, defineProps, ref } from 'vue';

/* --- props & emit --------------------------------------------------- */
const props = defineProps<{ taskTypes: TaskType[] }>()

const emit = defineEmits<{
  (e: 'update', payload: { _id: string; taskName: string; number_of_machine: number }): void
  (e: 'delete', id: string): void
}>()

/* --- local edit state ---------------------------------------------- */
const editName = ref('')
const editNum  = ref<number>(0)

/* 重設表單 */
function resetEdit() {
  editName.value = ''
  editNum.value  = 0
}

/* 發送更新事件給父層 */
function saveEdit(id: string) {
  if (!editName.value || !editNum.value) return
  emit('update', {
    _id: id,
    taskName: editName.value,
    number_of_machine: editNum.value,
  })
  resetEdit()
}
function openEdit(t: TaskType) {
  editName.value = t.taskName
  editNum.value  = t.number_of_machine
  console.log('openEdit', t._id, t.taskName, t.number_of_machine)
}
</script>
