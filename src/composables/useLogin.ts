import { useToast } from '@/components/ui/toast/use-toast'
import { login as loginApi } from '@/repositories/authRepo'
import { getUserDefaultRoute } from '@/router'
import { jwtDecode } from 'jwt-decode'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type LoginRequest = {
  userName: string
  password: string
}

export const useLogin = () => {
  const { toast } = useToast()
  const router = useRouter()
  const isLogin = ref(false)
  async function login(request: LoginRequest) {
    try {
      isLogin.value = true
      const response = await loginApi(request)
      localStorage.setItem('token', response.token)
      const decodedToken = jwtDecode(response.token) as { id: string; role: string }
      const userRole = decodedToken.role
      toast({
        title: '登入成功',
        description: '歡迎使用Mini Lab 任務管理平台',
      })
      router.push(getUserDefaultRoute(userRole))
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: '登入失敗',
        description: '失敗原因: ' + (error as Error).message,
      })
    } finally {
      isLogin.value = false
    }
  }

  return {
    login,
    isLogin,
  }
}
