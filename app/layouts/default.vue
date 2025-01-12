<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface UserInfo {
  username: string
  role: string
}

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const { data: userInfo } = await useAsyncData<UserInfo>('userInfo', () => useNuxtApp().$fetch('/api/user/me', {
  headers: {
    Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
  }
}))

if (isAuthenticated.value && userInfo.value) {
  authStore.setUsername(userInfo.value.username)
  authStore.setRole(userInfo.value.role)
}
</script>

<template>
  <UContainer>
    <div
      v-if="isAuthenticated"
      class="my-10 flex justify-end"
    >
      <UserDropdown class="w-fit" />
    </div>
    <slot />
  </UContainer>
</template>
