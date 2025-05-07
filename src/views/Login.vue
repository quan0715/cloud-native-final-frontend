<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
const router = useRouter()
const username = ref('')
const password = ref('')
async function handleLogin() {
  try {
    const response = await fetch('http://127.0.0.1:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: username.value, // 使用者輸入的帳號
        password: password.value, // 使用者輸入的密碼
      }),
    })

    const data = await response.json() // 解析 API 回應

    if (response.ok) {
      const token = data.token
      localStorage.setItem('token', token) // 儲存 token
      router.push('/') // 導向到首頁 (通常是 Dashboard)
    } else {
      alert(data.message || '登入失敗，請檢查帳號或密碼。')
    }
  } catch (error) {
    console.error('登入時發生錯誤:', error)
    alert('登入請求失敗，請稍後再試或檢查網路連線。')
  }
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
