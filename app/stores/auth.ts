export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    username: '',
    role: '',
    kycInfo: null,
    kpiData: {
      totalUsers: 0,
      approvedKYCs: 0,
      rejectedKYCs: 0,
      pendingKYCs: 0
    }
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
    },
    setKYC(kycInfo) {
      this.kycInfo = kycInfo
    },
    setKPI(kpiData) {
      this.kpiData = kpiData
    }
  },
  getters: {
    isAuthenticated: state => !!state.token
  }
})
