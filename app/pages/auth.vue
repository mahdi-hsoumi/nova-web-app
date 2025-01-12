<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useUser } from '@/composables/userUser'

const { getUserInfo } = useUser()
const isLogin = ref(true)
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()
const { login, register } = useAuth()
const toast = useToast()

const state = reactive({
  username: '',
  email: '',
  password: ''
})

const validate = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^.{6,}$/

  if (!isLogin.value && !state.username) {
    errorMessage.value = 'Please enter a username.'
    return true
  }
  if (!state.email) {
    errorMessage.value = 'Please enter an email.'
    return true
  }
  if (!emailRegex.test(state.email)) {
    errorMessage.value = 'Please enter a valid email address.'
    return true
  }
  if (!state.password) {
    errorMessage.value = 'Please enter a password.'
    return true
  }
  if (!passwordRegex.test(state.password)) {
    errorMessage.value = 'Password must be at least 6 characters long.'
    return true
  }
  return false
}

const handleAuth = async () => {
  const error = validate()
  if (error) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    if (isLogin.value) {
      const response = await login({ email: state.email, password: state.password })
      const token = response.token
      authStore.setToken(token)
      router.push('/')
      const userInfo = await getUserInfo()
      if (userInfo) {
        authStore.setUsername(userInfo.username)
        authStore.setRole(userInfo.role)
        toast.add({
          title: 'Login successful',
          description: 'You have logged in successfully.'
        })
      }
    } else {
      await register({ username: state.username, email: state.email, password: state.password })
      isLogin.value = true
      toast.add({
        title: 'Registration successful',
        description: 'You have registered successfully. Please log in to continue.'
      })
    }
  } catch (error) {
    errorMessage.value = error.data?.message || `${isLogin.value ? 'Login' : 'Registration'} failed.`
    console.error(`${isLogin.value ? 'Login' : 'Registration'} failed:`, error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <UCard
      :ui="{ body: { base: 'w-full ' } }"
      class="w-full max-w-md p-6 space-y-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
    >
      <template #header>
        <h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          {{ isLogin ? 'Login' : 'Register' }}
        </h2>
      </template>

      <div
        class="space-y-4 w-full"
      >
        <div v-if="!isLogin">
          <UInput
            v-model="state.username"
            type="text"
            placeholder="Username"
            required
            class="w-full"
            @keyup.enter="handleAuth"
          />
        </div>
        <UInput
          v-model="state.email"
          type="email"
          placeholder="Email"
          required
          class="w-full"
          @keyup.enter="handleAuth"
        />
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Password"
          required
          class="w-full"
          @keyup.enter="handleAuth"
        />
        <div
          class="text-red-500 text-center mt-4 h-[24px]"
        >
          {{ errorMessage }}
        </div>
      </div>

      <template #footer>
        <div class="text-center">
          <UButton
            type="submit"
            :loading="loading"
            class="w-full mb-5 justify-center"
            color="primary"
            @click="handleAuth"
          >
            {{ isLogin ? 'Login' : 'Register' }}
          </UButton>
          <button
            class="text-primary-600 hover:underline text-sm"
            @click="isLogin = !isLogin"
          >
            {{ isLogin ? 'Switch to Register' : 'Switch to Login' }}
          </button>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>
/* Add any additional custom styles here */
</style>
