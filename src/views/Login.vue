<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/composables/useLogin'
import { ArrowRight, Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const envTag = import.meta.env.VITE_ENV_TAG
const { login, isLogin } = useLogin()

async function handleLogin() {
  await login({
    userName: username.value,
    password: password.value,
  })
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
      <span class="text-md font-sans font-thin"> {{ envTag }} version </span>
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
          :disabled="isLogin"
          variant="default"
          type="submit"
          class="w-full flex flex-row items-center justify-between"
        >
          <span class="text-md font-sans font-thin"> 登入 Login </span>
          <Loader2 v-if="isLogin" class="w-5 h-5 animate-spin" />
          <ArrowRight v-else class="w-5 h-5" />
        </Button>
      </form>
    </div>
  </div>
</template>
