<template>
  <DashboardCard title="實驗室人員管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div v-for="u in users" :key="u._id" class="flex flex-col gap-2">
        <div class="flex items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl">
          <!-- 使用者資訊 -->
          <div class="w-full flex flex-col justify-start items-start gap-2 p-2 rounded-lg">
            <div id="task-header" class="flex flex-col justify-start items-start gap-1">
              <UserRoleChip :role="u.userRole" class="w-fit" />
              <p class="text-2xl font-thin px-1">{{ u.userName }}</p>
            </div>

            <Separator orientation="horizontal" class="w-full" />

            <div class="w-full flex flex-col justify-start items-start gap-1">
              <div v-if="u.userRole === 'worker'" class="flex flex-wrap gap-1">
                <ColorBadge
                  v-for="type in u.user_task_types"
                  :key="type._id"
                  :label="type.taskName"
                  :primaryColor="type.color ?? '#EA4B44'"
                  class="text-sm p-0"
                />
              </div>
              <div v-else class="px-2 py-1 text-sm text-gray-500 font-mono">管理職無需指派任務</div>
            </div>
          </div>

          <Separator orientation="vertical" class="h-auto" />

          <!-- 編輯按鈕 -->
          <div class="flex items-center gap-2">
            <UserFormDialog
              :user="u"
              :task-types="taskTypes"
              @update="handleUpdateEvent"
              @delete="handleDeleteEvent"
              @create="handleCreateEvent"
            >
              <Button variant="ghost" size="icon">
                <Edit class="w-4 h-4" />
              </Button>
            </UserFormDialog>
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import UserFormDialog from '@/components/User/UserFormDialog.vue'
import UserRoleChip from '@/components/User/UserRoleChip.vue'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
import type { TaskType } from '@/types/task'
import type { User } from '@/types/user'
import { Edit, Plus } from 'lucide-vue-next'
import { ref, onMounted, inject } from 'vue'
import { toast } from '@/components/ui/toast'
import { useTaskType } from '@/composables/useTaskType'
import { fetchUsers } from '@/repositories/userRepo'
import type { Ref } from 'vue'
import ColorBadge from '@/components/ColorBadge.vue'

const users = ref<User[]>([])
const taskTypes = ref<TaskType[]>([])
const loading = inject<Ref<boolean>>('globalLoading')!
const { fetchTaskTypes } = useTaskType()

async function handleCreateEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: '使用者新增成功',
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: '使用者新增失敗',
      description: message,
      variant: 'destructive',
    })
  }
}

async function handleUpdateEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: '使用者更新成功',
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: '使用者更新失敗',
      description: message,
      variant: 'destructive',
    })
  }
}

async function handleDeleteEvent(state: 'success' | 'error', message: string) {
  if (state === 'success') {
    toast({
      title: '使用者刪除成功',
      description: message,
      variant: 'default',
    })
    await _syncWithRepo()
  } else {
    toast({
      title: '使用者刪除失敗',
      description: message,
      variant: 'destructive',
    })
  }
}

async function _syncWithRepo() {
  loading.value = true
  await fetchTaskTypes()
  taskTypes.value = [...useTaskType().taskTypes.value]
  users.value = await fetchUsers()
  loading.value = false
}

onMounted(async () => {
  await _syncWithRepo()
})
</script>
