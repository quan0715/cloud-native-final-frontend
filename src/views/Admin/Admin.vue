<template>
  <div class="flex flex-col justify-center items-center p-12">
    <div class="max-w-screen-lg w-full flex flex-col justify-start items-start gap-4">
      <h1 class="w-fit text-3xl font-thin">
        <span class="text-blue-600">LAB 11</span> / QUAN / {{ currentTab }}
      </h1>
      <DashboardCard title="Admin Dashboard" class="w-full">
        <Tabs v-model="currentTab" class="w-full p-0 m-0">
          <TabsList>
            <TabsTrigger value="使用者管理" :class="tabTriggerClass"> 使用者管理 </TabsTrigger>
            <TabsTrigger value="機器管理" :class="tabTriggerClass"> 機器管理 </TabsTrigger>
            <TabsTrigger value="任務類型管理" :class="tabTriggerClass"> 任務類型管理 </TabsTrigger>
          </TabsList>
          <TabsContent value="使用者管理"> <UserManageTab /> </TabsContent>
          <TabsContent value="機器管理"> <MachineManageTab /> </TabsContent>
          <TabsContent value="任務類型管理"> <TaskTypeManageTab /> </TabsContent>
          <Separator />
        </Tabs>
      </DashboardCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserManageTab from '@/views/Admin/UserManageTab.vue'
import MachineManageTab from '@/views/Admin/MachineManageTab.vue'
import TaskTypeManageTab from '@/views/Admin/TaskTypeManageTab.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ref } from 'vue'
import Separator from '@/components/ui/separator/Separator.vue'
import DashboardCard from '@/components/DashboardCard.vue'
const currentTab = ref('使用者管理')
const tabTriggerClass = 'w-full px-4 py-2'

const handleTabChange = (tab: string) => {
  currentTab.value = tab
}
</script>
