import { useAuthStore } from '@/stores/auth'

export function useKyc() {
  const { $fetch } = useNuxtApp()

  const authStore = useAuthStore()

  const submitKYC = (data: FormData) => {
    return $fetch('/api/kyc/submit', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': authStore.token ? `Bearer ${authStore.token}` : ''
      }
    })
  }

  const getKYC = () => {
    return $fetch('/api/kyc', {
      headers: {
        Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
      }
    })
  }

  const updateKYCStatus = (userId: string, status: string) => {
    return $fetch(`/api/kyc/${userId}/status`, {
      method: 'PUT',
      body: { status },
      headers: {
        Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
      }
    })
  }

  const listKYC = (params: { status?: string, sortBy?: string, sortOrder?: string, page?: number, limit?: number }) => {
    return $fetch('/api/kyc/list', {
      params,
      headers: {
        Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
      }
    })
  }

  const getKPI = () => {
    return $fetch('/api/kyc/kpi', {
      headers: {
        Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
      }
    })
  }

  return {
    submitKYC,
    getKYC,
    updateKYCStatus,
    listKYC,
    getKPI
  }
}
