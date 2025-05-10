import MainLayout from '@/layouts/MainLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import Task from '@/views/Task/Task.vue'
import Admin from '@/views/Admin/Admin.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

interface DecodedToken {
  id: string
  role: string
  exp: number
}

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/dashboard', // 預設重導，稍後會根據角色調整
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: DashboardView,
        meta: {
          title: '任務儀錶板',
        },
      },
      {
        path: 'task',
        component: Task,
        meta: {
          title: '個人任務管理',
        },
      },
      {
        path: 'admin',
        component: Admin,
        meta: {
          title: '管理員儀錶板',
        },
        // redirect: '/task',
        // children: [
        //   {
        //     path: 'task',
        //     component: Admin,
        //     meta: {
        //       title: '管理員儀錶板/任務類型管理',
        //     },
        //   },
        //   {
        //     path: 'user',
        //     component: Admin,
        //     meta: {
        //       title: '管理員儀錶板/實驗室人員管理',
        //     },
        //   },
        //   {
        //     path: 'machine',
        //     component: Admin,
        //     meta: {
        //       title: '管理員儀錶板/實驗室機器管理',
        //     },
        //   },
        // ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const publicRoutes = ['/login']

const userLabelWithRoutesMapping = {
  admin: ['/admin'],
  leader: ['/dashboard'],
  worker: ['/task'],
}

function isValidRoute(route: string, userRole: string) {
  const userRoutes = userLabelWithRoutesMapping[userRole as keyof typeof userLabelWithRoutesMapping]
  return userRoutes.includes(route)
}

export function getUserDefaultRoute(userRole: string) {
  return userLabelWithRoutesMapping[userRole as keyof typeof userLabelWithRoutesMapping][0]
}

router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  const token = localStorage.getItem('token')
  const isLoginRoute = to.path === '/login'

  if (!token) {
    if (isLoginRoute) {
      next()
    } else {
      toast({
        title: '請先登入',
        description: '請先登入',
      })
      next('/login')
    }
    return
  }
  const decodedToken = jwtDecode(token) as DecodedToken
  // 檢查 Token 是否過期
  if (decodedToken.exp < Date.now() / 1000) {
    localStorage.removeItem('token')
    toast({
      title: '連線階段已過期，請重新登入。',
      description: '連線階段已過期，請重新登入。',
    })
    next('/login')
    return
  }
  const userRole = decodedToken.role
  if (to.path === '/') {
    next(getUserDefaultRoute(userRole))
    return
  }
  if (publicRoutes.includes(to.path)) {
    // 您已經登入了，進入對應的頁面
    toast({
      title: '您已經登入了，進入對應的頁面',
      description: `route setting ${from.path} -> ${to.path}`,
    })

    const userDefaultRoute = getUserDefaultRoute(userRole)
    next(userDefaultRoute)
    return
  } else {
    if (isValidRoute(to.path, userRole)) {
      next()
      return
    } else {
      toast({
        title: '您沒有權限訪問此頁面。',
        description: `role: ${userRole} route setting ${from.path} -> ${to.path}`,
      })
      next(getUserDefaultRoute(userRole))
      return
    }
  }
})

export default router
