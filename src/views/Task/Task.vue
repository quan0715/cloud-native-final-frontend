<template>
  <div class="flex flex-col justify-center items-center p-12">
    <div class="max-w-5xl w-full flex flex-col justify-start items-start gap-4">
      <h1 class="w-fit text-3xl font-thin">
        <span class="text-blue-600">LAB 11</span> / QUAN 歡迎回來
      </h1>
      <div class="w-full grid grid-cols-3 gap-4">
        <UserWeaklyReview class="col-span-1" />
        <InprogressTaskCard class="col-span-2" />
        <AssignedTaskCard class="col-span-3" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InprogressTaskCard from '@/views/Task/InprogressTaskCard.vue'
import UserWeaklyReview from '@/views/Task/UserWeaklyReview.vue'
import AssignedTaskCard from '@/views/Task/AssignedTaskCard.vue'
</script>
