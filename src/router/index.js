import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import LandingView from "@/views/LandingView.vue";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { public: true }
    },

    { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
    {
      path: '/app',
      component: () => import('../views/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'app',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'day/:id',
          name: 'day',
          component: () => import('../views/DayView.vue')
        },
        {
          path: 'stats',
          name: 'stats',
          component: () => import('../views/StatsView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue')
        }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'auth' }
  }
  if (to.name === 'auth' && auth.isAuthenticated) {
    return { name: 'app' }
  }
})

export default router
