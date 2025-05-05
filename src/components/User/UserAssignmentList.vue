<template>
  <DashboardCard title="人員清單">
    <ul class="space-y-3">
      <li v-for="u in users" :key="u.id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <p class="font-semibold">{{ u.name }}</p>
            <p v-if="u.status === UserStatus.Working" class="text-xs text-gray-500">
              正在進行 {{ u.task }}
            </p>
            <p v-else-if="u.status === UserStatus.Idle" class="text-xs text-gray-500">
              空閒中
            </p>
            <p v-else-if="u.status === UserStatus.Assigned" class="text-xs text-gray-500">
              已指派任務 {{ u.task }}
            </p>
          </div>
          <Badge :class="statusClass(u.status)">{{ u.status }}</Badge>
        </Card>
      </li>
    </ul>
  </DashboardCard>
</template>

<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';
import Card from '@/components/ui/card/Card.vue';
import { UserStatus, type UserAssignment } from '@/types/user';

const props = defineProps<{ users: UserAssignment[] }>()
const users = props.users

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
