import MainLayout from '@/layouts/MainLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import Task from '@/views/Task/Task.vue'
import Admin from '@/views/Admin.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

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
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 1. 如果目標是登入頁
  if (to.path === '/login') {
    if (token) {
      try {
        const decodedToken = jwtDecode(token) as DecodedToken
        if (decodedToken.exp < Date.now() / 1000) {
          localStorage.removeItem('token')
          next()
        } else {
          if (decodedToken.role === 'admin') next('/admin')
          else if (decodedToken.role === 'leader') next('/dashboard')
          else if (decodedToken.role === 'worker') next('/task')
          else next('/dashboard') // 其他未知角色預設到 dashboard
        }
      } catch (error) {
        console.error('解析登入中Token時發生錯誤:', error)
        localStorage.removeItem('token')
        next()
      }
    } else {
      next()
    }
    return
  }

  // 2. 如果沒有 token (未登入) 且目標不是登入頁
  if (!token) {
    next('/login')
    return
  }

  // 3. 有 token，進行解析和權限驗證
  try {
    const decodedToken = jwtDecode(token) as DecodedToken
    const userRole = decodedToken.role

    if (decodedToken.exp < Date.now() / 1000) {
      localStorage.removeItem('token')
      alert('連線階段已過期，請重新登入。')
      next('/login')
      return
    }

    // 檢查是否是從登入頁來的，用於設定預設跳轉
    const fromLogin = from.path === '/login'

    switch (userRole) {
      case 'admin':
        if (fromLogin && (to.path === '/' || to.path === '/dashboard' || to.path === '/task')) {
          next('/admin')
        } else {
          next()
        }
        break
      case 'leader':
        if (to.path === '/admin') {
          alert('您沒有權限訪問此頁面。')
          next(fromLogin ? '/dashboard' : from.fullPath) // 從登入來就去預設，否則停在原地或預設
        } else if (fromLogin && (to.path === '/' || to.path === '/task')) {
          next('/dashboard')
        } else {
          next()
        }
        break
      case 'worker':
        if (to.path === '/admin' || to.path === '/dashboard') {
          alert('您沒有權限訪問此頁面。')
          next(fromLogin ? '/task' : from.fullPath) // 從登入來就去預設，否則停在原地或預設
        } else if (fromLogin && to.path === '/') {
          next('/task')
        } else {
          next()
        }
        break
      default: // 未知角色或無特定規則的角色
        alert('未知的用戶角色，將導向預設頁面。')
        localStorage.removeItem('token') // 清除 token，因為角色未知
        next('/login')
    }
  } catch (error) {
    console.error('驗證路由權限時解析Token失敗:', error)
    localStorage.removeItem('token')
    alert('無效的登入憑證，請重新登入。')
    next('/login')
  }
})

export default router
