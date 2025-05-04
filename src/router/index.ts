import Login from '@/views/Login.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
const routes = [
  {
    path: '/login',
    component: Login,
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next('/login')
  } else {
    next()
  }
})
export default router
