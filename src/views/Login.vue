<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
function handleLogin() {
  // 這裡可以加上 API 請求
  // 模擬登入成功，寫入 token
  alert(`帳號: ${username.value}\n密碼: ${password.value}`)

  localStorage.setItem('token', username.value)
  // 如果成功，則跳轉到首頁
  // 如果失敗，則顯示錯誤訊息
  router.push('/')
}
</script>

<template>
  <div
    class="min-h-screen w-full bg-cover bg-center flex items-center justify-end"
    style="background-image: url('/images/login-bg.png')"
  >
    <div
      class="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-sm shadow-2xl p-10 flex flex-col justify-center min-h-screen"
    >
      <h2 class="text-3xl font-sans font-thin mb-8 text-left">Mini Lab 任務管理平台</h2>
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="relative max-w-sm">
          <Label class="text-md font-sans font-thin">帳號</Label>
          <Input v-model="username" type="text" required class="w-full" />
        </div>
        <div>
          <Label class="text-md font-sans font-thin">密碼</Label>
          <Input v-model="password" type="password" required class="w-full" />
        </div>
        <Button
          variant="default"
          type="submit"
          class="w-full flex flex-row items-center justify-between"
        >
          <span class="text-md font-sans font-thin"> 登入 Login </span>
          <ArrowRight class="w-5 h-5" />
        </Button>
      </form>
    </div>
  </div>
</template>
