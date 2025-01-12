<script setup lang="ts">
const authStore = useAuthStore()
const { getKYC, getKPI } = useKyc()

const kycInfo = ref(null)
const loading = ref(true)
const kpiData = ref({
  totalUsers: 0,
  approvedKYCs: 0,
  rejectedKYCs: 0,
  pendingKYCs: 0
})

onMounted(async () => {
  if (authStore.role === 'user') {
    try {
      const response = await getKYC()
      kycInfo.value = response
    } catch (error) {
      console.error('Failed to fetch KYC information:', error)
    } finally {
      loading.value = false
    }
  } else if (authStore.role === 'admin') {
    try {
      const response = await getKPI()
      kpiData.value = response
    } catch (error) {
      console.error('Failed to fetch KPI data:', error)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel

      grow
    >
      <UDashboardNavbar :title="authStore.role === 'admin' ? 'Home' : 'KYC'" />

      <UDashboardPanelContent v-if="authStore.role === 'admin'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Total Users
            </h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ kpiData.totalUsers }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Approved KYCs
            </h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ kpiData.approvedKYCs }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Rejected KYCs
            </h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ kpiData.rejectedKYCs }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Pending KYCs
            </h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ kpiData.pendingKYCs }}
            </p>
          </div>
        </div>
      </UDashboardPanelContent>
      <UDashboardPanelContent
        v-else-if="authStore.role === 'user'"
        class="flex justify-center items-center w-full h-full"
      >
        <div
          v-if="loading"
        >
          Loading...
        </div>
        <div
          v-else
        >
          <div v-if="kycInfo">
            <h2 class="text-2xl font-semibold text-center mb-5">
              KYC Information
            </h2>
            <p><strong>Name:</strong> {{ kycInfo.name }}</p>
            <p><strong>Status:</strong> {{ kycInfo.status }}</p>
            <strong>ID Document:</strong>
            <img
              :src="kycInfo.idDocument"
              alt="ID Document"
              class="max-w-[300px] h-auto rounded"
            >
          </div>
          <div
            v-else
          >
            <KycForm />
          </div>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
