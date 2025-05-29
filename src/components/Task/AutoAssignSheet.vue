<template>
  <Sheet :open="props.open" @update:open="handleOpenChange">
    <SheetContent side="right" class="w-[500px] sm:w-[600px] p-0 flex flex-col">
      <SheetHeader class="p-6 pb-4">
        <SheetTitle>自動指派預覽</SheetTitle>
        <SheetDescription>以下是系統建議的自動指派結果，請檢閱後確認。</SheetDescription>
      </SheetHeader>

      <div class="flex-1 px-6 pb-6 pt-2 overflow-y-auto">
        <div v-if="isLoadingPreview" class="text-center py-10">
          <p>正在載入預覽...</p>
        </div>
        <div v-else-if="errorPreview" class="text-center py-10 text-red-500">
          <p>載入預覽失敗：{{ errorPreview }}</p>
        </div>
        <div v-else-if="previewAssignments.length === 0" class="text-center py-10 text-gray-500">
          <p>目前沒有可建議的指派任務。</p>
        </div>
        <ul v-else class="space-y-4">
          <li v-for="item in previewAssignments" :key="item.taskId" class="p-1 flex flex-col gap-2">
            <div class="flex items-stretch justify-between space-x-3">
              <!-- Task Info -->
              <div class="flex-1 min-w-0 p-4 rounded-md flex flex-col gap-1">
                <p class="px-1 text-sm text-muted-foreground">任務</p>
                <p class="px-1 text-xl font-thin truncate" :title="item.taskName">
                  {{ item.taskName }}
                </p>
                <ColorBadge
                  class="w-fit"
                  :label="getDraftTask(item.taskId)?.taskTypeId.taskName ?? '未知'"
                  :primaryColor="getDraftTask(item.taskId)?.taskTypeId.color ?? '#EA4B44'"
                />
              </div>

              <!-- Arrow Icon -->
              <div class="flex-shrink-0 px-2 flex items-center justify-center">
                <ArrowRight class="w-6 h-6 text-muted-foreground" />
              </div>

              <!-- Assignee Info -->
              <div
                class="flex-1 min-w-0 p-4 rounded-md flex flex-col gap-1 justify-start items-start"
              >
                <p class="px-1 text-sm text-muted-foreground">預計指派給</p>
                <template v-if="item.previewAssignee">
                  <p class="px-1 text-xl font-thin truncate" :title="item.previewAssignee.userName">
                    {{ item.previewAssignee.userName }}
                  </p>
                  <div class="flex flex-wrap gap-1">
                    <ColorBadge
                      v-for="taskType in getWorker(item.previewAssignee._id)?.user_task_types"
                      :key="taskType._id"
                      :label="taskType.taskName"
                      :primaryColor="taskType.color ?? '#EA4B44'"
                    />
                  </div>
                </template>
                <template v-else>
                  <p class="font-semibold text-orange-500">無法自動指派</p>
                  <p class="text-sm text-muted-foreground">請手動處理</p>
                </template>
              </div>
            </div>
            <Separator />
          </li>
        </ul>
      </div>

      <SheetFooter class="p-6 mt-auto pt-6 border-t">
        <Button
          @click="confirmAndAssign"
          :disabled="isLoadingPreview || isAssigning || previewAssignments.length === 0"
          class="w-full sm:w-auto"
        >
          {{ isAssigning ? '正在指派中...' : '確認並執行指派' }}
        </Button>
        <SheetClose as-child>
          <Button variant="outline" :disabled="isAssigning" class="w-full sm:w-auto mt-2 sm:mt-0"
            >取消</Button
          >
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet' // Assuming sheet components are in this path
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast/use-toast'
import { ArrowRight } from 'lucide-vue-next' // Import the icon
import { Separator } from '@/components/ui/separator'
import { autoAssignTasksPreview, autoAssignTasks } from '@/repositories/taskRepo' // Import your functions
import type { AutoAssignPreview } from '@/types/task'
import type { UserWithTasks } from '@/types/user'
import type { Task } from '@/types/task'
import ColorBadge from '@/components/ColorBadge.vue'

// --- Props & Emits ---
const props = defineProps<{
  open: boolean
  assignerId: string // Added assignerId prop
  workers: UserWithTasks[]
  draftTasks: Task[]
}>()

const emit = defineEmits(['update:open', 'assignments-confirmed', 'assignments-failed'])

// --- State ---
const previewAssignments = ref<AutoAssignPreview[]>([])
const isLoadingPreview = ref(false)
const errorPreview = ref<string | null>(null)
const isAssigning = ref(false)

function getDraftTask(taskId: string) {
  return props.draftTasks.find((task) => task._id === taskId)
}

function getWorker(workerId: string) {
  return props.workers.find((worker) => worker._id === workerId)
}

// --- API Functions ---
async function fetchPreview() {
  if (!props.open) return
  isLoadingPreview.value = true
  errorPreview.value = null
  previewAssignments.value = []
  try {
    const data = await autoAssignTasksPreview() // Use your imported function
    previewAssignments.value = data as AutoAssignPreview[] // Assuming it returns the correct type

    if (previewAssignments.value.length === 0) {
      toast({
        title: '自動指派預覽',
        description: '目前沒有可建議的指派任務。',
      })
    }
  } catch (err) {
    console.error('Failed to fetch auto-assign preview:', err)
    const errorMessage = err instanceof Error ? err.message : '無法獲取指派預覽數據'
    errorPreview.value = errorMessage
    toast({
      title: '載入預覽失敗',
      description: errorMessage,
      variant: 'destructive',
    })
  } finally {
    isLoadingPreview.value = false
  }
}

async function confirmAndAssign() {
  if (previewAssignments.value.filter((item) => item.previewAssignee).length === 0) {
    toast({
      title: '無有效指派建議',
      description: '預覽中的任務沒有明確的指派對象或列表為空。',
      variant: 'default',
    })
    isAssigning.value = false // Reset assigning state if no valid items
    return
  }
  isAssigning.value = true
  try {
    // Pass the raw previewAssignments that are already typed as PreviewAssignmentItem[]
    // Your taskRepo autoAssignTasks will handle the mapping if needed based on AutoAssignPreview type
    await autoAssignTasks(props.assignerId, previewAssignments.value) // Types are compatible

    toast({
      title: '指派成功',
      description: '任務已成功自動指派。',
    })
    emit('assignments-confirmed')
    handleOpenChange(false)
  } catch (err) {
    console.error('Failed to confirm assignments:', err)
    const errorMessage = err instanceof Error ? err.message : '執行指派時發生錯誤。'
    toast({
      title: '指派失敗',
      description: errorMessage,
      variant: 'destructive',
    })
    emit('assignments-failed')
  } finally {
    isAssigning.value = false
  }
}

// --- Watchers & Lifecycle ---
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      fetchPreview()
    }
  },
)

// --- Methods ---
function handleOpenChange(newOpenState: boolean) {
  emit('update:open', newOpenState)
}
</script>
