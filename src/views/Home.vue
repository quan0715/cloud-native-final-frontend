<template>
  <div class="flex flex-col h-screen">
    <!-- Main Content（Grid）-->
    <div class="flex-1 overflow-auto p-6 bg-gray-100">
      <div class="grid grid-cols-3 gap-4 h-full">
        <!-- task dashboard -->
        <div class="space-y-4">
          <TaskSummaryCard />
          <TaskRequestList @create="onCreateRequest" />
        </div>
        <!-- task running list -->
        <TaskList />
        <!-- status and workers list -->
        <div class="space-y-4">
          <MachineStatusList />
          <UserAssignmentList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MachineStatusList from '@/components/Machine/MachineStatusList.vue'
import TaskList from '@/components/Task/TaskList.vue'
import TaskRequestList from '@/components/Task/TaskRequestList.vue'
import TaskSummaryCard from '@/components/Task/TaskSummaryCard.vue'
import UserAssignmentList from '@/components/User/UserAssignmentList.vue'

function onCreateRequest() {
  // todo: popout
  console.log('create new request')
}
</script>
