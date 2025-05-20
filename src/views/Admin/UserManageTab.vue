<template>
  <DashboardCard title="實驗室人員管理" class="w-full">
    <div class="flex flex-col gap-2">
      <div v-for="user in users" :key="user._id" class="flex flex-col gap-2">
        <div
          class="flex flex-row justify-start items-stretch gap-4 border-2 border-gray-200 p-4 rounded-xl"
        >
          <div class="flex flex-col gap-2 items-start justify-start min-w-32">
            <UserRoleChip :role="user.userRole" />
            <p class="text-xl font-semibold px-2">{{ user.userName }}</p>
          </div>
          <Separator orientation="vertical" class="h-auto" />
          <DashboardData
            v-if="user.userRole == UserRole.Worker"
            title="任務類型"
            :content="user.user_task_types.map((task) => task.taskName).join(', ')"
          />
          <div v-else class="w-full flex flex-row gap-2 items-center justify-start">
            <p class="text-sm text-gray-500">管理職無需指派任務</p>
          </div>
          <Separator orientation="vertical" class="h-auto" />
          <div class="flex flex-row gap-2 items-center justify-center">
            <Button variant="ghost" size="icon">
              <Edit class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DashboardCard>
</template>
<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue'
import DashboardData from '@/components/DashboardData.vue'
import UserRoleChip from '@/components/User/UserRoleChip.vue'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
import { UserRole, type User } from '@/types/user'
import { Edit } from 'lucide-vue-next'

// defineProps({
//   users: {
//     type: Array as () => User[],
//     required: true,
//   },
// })
const { users } = defineProps<{ users: User[] }>()
console.log('UserManageTab props:', users)
</script>
