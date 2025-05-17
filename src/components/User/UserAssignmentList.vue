<template>
  <DashboardCard title="人員清單">
    <ul class="space-y-3">
      <li v-for="u in userAssignmentList" :key="u._id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <p class="font-semibold">{{ u.userName }}</p>
            <p v-if="u.inProgressTasks.length > 0" class="text-xs text-gray-500">
              正在進行 {{ u.inProgressTasks }}
            </p>
            <p v-else-if="u.inProgressTasks.length == 0" class="text-xs text-gray-500">
              空閒中
            </p>
            <p v-else-if="u.assignedTasks.length > 0" class="text-xs text-gray-500">
              已指派任務 {{ u.assignedTasks }}
            </p>
          </div>
          <Badge :class="statusClass(userStatus(u))" class="text-xs">{{ userStatus(u) }}</Badge>
        </Card>
      </li>
    </ul>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue';
import Card from '@/components/ui/card/Card.vue';
import { UserStatus, type UserWithTasks } from '@/types/user';

const { userAssignmentList } = defineProps<{ userAssignmentList: UserWithTasks[] }>()

const userStatus = function(user: UserWithTasks) {
  if (user.inProgressTasks.length > 0) {
    return UserStatus.Working
  } else if (user.assignedTasks.length > 0) {
    return UserStatus.Assigned
  } else {
    return UserStatus.Idle
  }
}

function statusClass(status: string) {
  switch (status) {
    case UserStatus.Working:
      return 'bg-yellow-100 text-yellow-800'
    case UserStatus.Idle:
      return 'bg-green-100 text-green-800'
    case UserStatus.Assigned:
      return 'bg-blue-100 text-blue-800'
    default:
      return ''
  }
}
</script>
