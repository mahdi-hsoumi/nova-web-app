<script setup lang="ts">
import { ref, computed } from 'vue'
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

const username = ref('')
const role = ref('')

if (isAuthenticated.value && userInfo.value) {
  username.value = userInfo.value.username
  role.value = userInfo.value.role
  authStore.setUsername(username.value)
  authStore.setRole(role.value)
}

const links = [{
  id: 'home',
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: 'Home',
    shortcuts: ['G', 'H']
  }
}]
if (role.value === 'admin') {
  links.push({
    id: 'users',
    label: 'Users',
    icon: 'i-heroicons-user-group',
    to: '/users',
    tooltip: {
      text: 'Users',
      shortcuts: ['G', 'U']
    }
  })
}
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      v-if="isAuthenticated"
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <LogoButton />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <div class="flex-1" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />
  </UDashboardLayout>
</template>
