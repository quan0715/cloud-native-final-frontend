<template>
  <DashboardCard title="任務數量">
    <!-- 右上角「新增任務」按鈕 -->
    <template #action v-if="isDraft">
      <Dialog v-model:open="createOpen">
        <DialogTrigger as-child>
          <Button variant="outline">
            <div class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              新增任務
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>新增任務</DialogTitle>
          </DialogHeader>

          <form @submit.prevent="submitCreate" class="space-y-4">
            <!-- 任務項目 -->
            <div>
              <Label class="mb-1 block">任務項目</Label>
              <Select v-model="createTypeId">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="請選擇任務項目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="n in taskType"
                    :key="n._id"
                    :value="n._id"
                  >
                    {{ n.taskName }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- 任務名稱 -->
            <div>
              <Label class="mb-1 block">任務名稱</Label>
              <Input
                v-model="createName"
                placeholder="輸入任務名稱"
              />
            </div>

            <DialogFooter>
              <DialogClose as-child>
                <Button variant="secondary" @click="resetCreate">取消</Button>
              </DialogClose>
              <DialogClose as-child>
                <Button type="submit" >確定</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </template>


    <!-- 列表 -->
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task._id">
        <Card class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div>
            <!-- 任務標題 -->
            <p class="font-semibold" >
              {{ task.taskTypeId.taskName }} {{ task.taskName }}
            </p>

            <!-- 狀態敘述 -->
            <p class="text-xs text-gray-500">
              <span v-if="task.taskData.state === 'draft'">
                {{ task.assigner_id || '未指派' }} 將要操作
              </span>
              <span v-else>
                {{ task.assigner_id?.userName || '未知' }} 正在操作
              </span>

              <!-- 多台機器名稱用 , 連接 -->
              {{ machineNames(task.taskData.machine) }}
              進行 {{ task.taskName }}
            </p>
          </div>
          <Badge variant="outline">{{ task.taskData.state }}</Badge>
        </Card>
      </li>
    </ul>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import {
  Select,
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { Task, TaskType } from '@/types/task';
import { Plus } from 'lucide-vue-next';
import { defineProps, ref } from 'vue';




const { tasks, taskType } = defineProps<{
  tasks: Task[]
  taskType: TaskType[]       // 父層傳入所有任務類型名稱
  isDraft?: boolean          // 是否為草稿任務
}>()


function machineNames(arr: any[] | undefined) {
  if (!arr || arr.length === 0) return '尚未指派機器'
  // 若後端帶 { machineName } 物件
  if (typeof arr[0] === 'object') {
    return arr.map((m: any) => m.machineName).join(', ')
  }
  // 若為 ObjectId 字串
  return arr.join(', ')
}
const createOpen = ref(false)
const createTypeId = ref('')
const createName = ref('')

function resetCreate() {
  createTypeId.value = ''
  createName.value = ''
}

function submitCreate() {
  if (!createTypeId.value || !createName.value) return
  emit('create', { taskType: createTypeId.value, taskName: createName.value })
  resetCreate()
}


const emit = defineEmits(['create'])
</script>