import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
export const useLogout = () => {
  const router = useRouter()
  const { toast } = useToast()

  async function logout() {
    localStorage.removeItem('token')
    toast({
      title: '登出成功',
      description: '已登出',
    })
    router.push('/login')
  }

  return {
    logout,
  }
}
