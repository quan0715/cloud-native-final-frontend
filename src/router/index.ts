import MainLayout from '@/layouts/MainLayout.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'task',
        component: Home,
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
    next('/')
  } else {
    next()
  }
})
export default router
