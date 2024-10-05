import { createRouter, createWebHistory } from 'vue-router'
import Todo from '../components/Todo.vue'
import Profiles from '../components/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Profiles',
      component: Profiles
    },
    {
      path: '/todo',
      name: 'todo',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/Todo.vue')
    }
  ]
})

export default router
