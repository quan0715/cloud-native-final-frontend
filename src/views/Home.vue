

<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between px-10 py-4 border-b">
      <h1 class="text-2xl font-semibold">Mini Lab Analysis Task Management</h1>
      <UserHeader
        :username="username"
        role-label="管理者"
        @logout="handleLogout"
      />
    </div>
    <h2 class="px-10 py-4 border-b text-3xl">組長儀錶板/</h2>

    <!-- Main Content（Grid）-->
    <div class="flex-1 overflow-auto p-6">
      <div class="grid grid-cols-3 gap-6 h-full">
        <!-- task dashboard -->
        <div class="space-y-6">
          <TaskSummaryCard />
          <TaskRequestList @create="onCreateRequest" />
        </div>

        <!-- task running list -->
        <TaskList />

        <!-- status and workers list -->
        <div class="space-y-6">
          <MachineStatusList />
          <UserAssignmentList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import TaskSummaryCard   from '@/components/Task/TaskSummaryCard.vue'
import TaskRequestList   from '@/components/Task/TaskRequestList.vue'
import TaskList          from '@/components/Task/TaskList.vue'
import MachineStatusList from '@/components/Machine/MachineStatusList.vue'
import UserAssignmentList from '@/components/User/UserAssignmentList.vue'
import UserHeader        from '@/components/User/UserHeader.vue'

import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-vue-next'
const router = useRouter()

const username = localStorage.getItem('token')
if (!username) {
  router.push('/login')
}

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
}

function onCreateRequest() {
  // todo: popout
  console.log('create new request')
}
</script>


