
export function useAuth() {
  const { $fetch } = useNuxtApp()

  const register = async (data: { username: string, email: string, password: string }) => {
    return $fetch('/api/auth/register', {
      method: 'POST',
      body: data
    })
  }

  const login = async (data: { email: string, password: string }) => {
    return $fetch('/api/auth/login', {
      method: 'POST',
      body: data
    })
  }

  return {
    register,
    login
  }
}
