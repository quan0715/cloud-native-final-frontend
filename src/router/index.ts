import MainLayout from '@/layouts/MainLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Task from '@/views/Task.vue'
import Admin from '@/views/Admin.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
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
  if (!token && to.path !== '/login') {
    next('/login')
  } else if (token && to.path === '/login') {
    next('/dashboard')
  } else {
    next()
  }
})
export default router
