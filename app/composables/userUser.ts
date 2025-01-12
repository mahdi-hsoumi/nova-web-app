import { useAuthStore } from '@/stores/auth'

export function useUser() {
  const { $fetch } = useNuxtApp()
  const authStore = useAuthStore()

  const getUserInfo = () => {
    return $fetch('/api/user/me', {
      headers: {
        Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
      }
    })
  }

  return {
    getUserInfo
  }
}
