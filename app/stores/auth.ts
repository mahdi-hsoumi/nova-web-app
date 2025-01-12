export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    username: '',
    role: ''
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      const tokenCookie = useCookie('jwtToken')
      tokenCookie.value = token
    },
    clearToken() {
      this.token = ''
      this.username = ''
      this.role = ''
      const tokenCookie = useCookie('jwtToken')
      tokenCookie.value = ''
    },
    setUsername(username: string) {
      this.username = username
    },
    setRole(role: string) {
      this.role = role
    }
  },
  getters: {
    isAuthenticated: state => !!state.token
  }
})
