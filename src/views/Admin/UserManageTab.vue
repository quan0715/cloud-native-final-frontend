<template>
  <DashboardCard title="實驗室人員管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div
        v-for="u in users"
        :key="u._id"
        class="flex flex-col gap-2"
      >
        <div class="flex items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl">
          <!-- 基本資訊 -->
          <div class="flex flex-col gap-1 min-w-32">
            <UserRoleChip :role="u.userRole" />
            <p class="text-xl font-semibold px-2">{{ u.userName }}</p>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 任務類型（僅 worker 顯示） -->
          <DashboardData
            v-if="u.userRole === 'worker'"
            title="任務類型"
            :content="u.user_task_types.map((t) => t.taskName).join(', ') || '-'"
          />
          <div
            v-else
            class="w-full flex flex-col justify-center items-start gap-2 p-2"
          >
            管理職無需指派任務
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 編輯 / 刪除 -->
          <div class="flex items-center gap-2">
            <!-- Edit Dialog -->
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" size="icon" @click="openEdit(u)">
                  <Edit class="w-4 h-4" />
                </Button>
              </DialogTrigger>

              <DialogContent class="max-w-sm">
                <DialogHeader>
                  <DialogTitle>編輯使用者</DialogTitle>
                </DialogHeader>

                <div class="space-y-4">
                  <!-- 使用者名稱 -->
                  <div>
                    <Label class="mb-1 block">使用者名稱</Label>
                    <Input v-model="editName" />
                  </div>

                  <!-- 角色 -->
                  <div>
                    <Label class="mb-1 block">角色</Label>
                    <select
                      v-model="editRole"
                      class="w-full border rounded px-2 py-1"
                    >
                      <option value="admin">admin</option>
                      <option value="leader">leader</option>
                      <option value="worker">worker</option>
                    </select>
                  </div>

                  <!-- 任務複選 (僅 worker 顯示) -->
                  <div v-if="editRole === 'worker'">
                    <Label class="mb-1 block">可執行任務 (複選)</Label>
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
                    <Button variant="secondary" @click="resetEdit">取消</Button>
                  </DialogClose>
                  <DialogClose as-child>
                    <Button @click="saveEdit(u._id)">儲存</Button>
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
                    @click="emit('delete', u._id)"
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
/* ---------------- imports ---------------- */
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
import { Checkbox } from '@/components/ui/checkbox/';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defineEmits, defineProps, ref } from 'vue';

import DashboardCard from '@/components/DashboardCard.vue';
import DashboardData from '@/components/DashboardData.vue';
import UserRoleChip from '@/components/User/UserRoleChip.vue';
import { Separator } from '@/components/ui/separator';
import type { TaskType } from '@/types/task';
import type { User } from '@/types/user';
import { Edit, Trash } from 'lucide-vue-next';

/* --------------- props & emit -------------- */
const props = defineProps<{
  users: User[]
  taskTypes: TaskType[]
}>()

const emit = defineEmits<{
  (e: 'update', payload: { _id: string; userName: string; userRole: string; taskIds: string[] }): void
  (e: 'delete', id: string): void
}>()

/* --------------- local edit state ---------- */
const editName    = ref('')
const editRole    = ref('worker')
const editTaskIds = ref<string[]>([])

function resetEdit() {
  editName.value    = ''
  editRole.value    = 'worker'
  editTaskIds.value = []
}

function toggleTask(id: string) {
  console.log('toggleTask', id)
  if (editTaskIds.value.includes(id)) {
    editTaskIds.value = editTaskIds.value.filter((t) => t !== id)
  } else {
    editTaskIds.value.push(id)
  }
}

function saveEdit(id: string) {
  emit('update', {
    _id: id,
    userName: editName.value,
    userRole: editRole.value,
    taskIds: editRole.value === 'worker' ? editTaskIds.value : [],
  })
  resetEdit()
}
function openEdit(user: User) {
  editName.value    = user.userName
  editRole.value    = user.userRole
  // 先取出 _id 陣列放進 editTaskIds
  editTaskIds.value = user.user_task_types.map((t) => t._id)
}
</script>
