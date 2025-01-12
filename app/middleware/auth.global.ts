// FILE: app/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '@/stores/auth'
import { useCookie } from '#app'

export default defineNuxtRouteMiddleware((to, _from) => {
  const authStore = useAuthStore()
  const tokenCookie = useCookie('jwtToken')

  authStore.setToken(tokenCookie.value || '')
  if (authStore.isAuthenticated) {
    if (to.path === '/auth') {
      return navigateTo('/')
    }
  } else {
    if (to.path !== '/auth') {
      return navigateTo('/auth')
    }
  }
})
