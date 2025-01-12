<script setup lang="ts">
const authStore = useAuthStore()
const { getKYC, getKPI } = useKyc()

const loading = ref(true)

onMounted(async () => {
  if (authStore.role === 'user' && !authStore.kycInfo) {
    try {
      const response = await getKYC()
      authStore.setKYC(response)
    } catch (error) {
      console.error('Failed to fetch KYC information:', error)
    } finally {
      loading.value = false
    }
  } else if (authStore.role === 'admin') {
    try {
      const response = await getKPI()
      authStore.setKPI(response)
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
  <div>
    <div
      v-if="authStore.role === 'admin'"
      class="my-5 px-2.5"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Total Users
          </h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ authStore.kpiData.totalUsers }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Approved KYCs
          </h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ authStore.kpiData.approvedKYCs }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Rejected KYCs
          </h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ authStore.kpiData.rejectedKYCs }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Pending KYCs
          </h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ authStore.kpiData.pendingKYCs }}
          </p>
        </div>
      </div>
      <KycsContainer />
    </div>
    <div
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
        <div v-if="authStore.kycInfo">
          <h2 class="text-2xl font-semibold text-center mb-5">
            KYC Information
          </h2>
          <p><strong>Name:</strong> {{ authStore.kycInfo.name }}</p>
          <p><strong>Status:</strong> {{ authStore.kycInfo.status }}</p>
          <strong>ID Document:</strong>
          <img
            :src="authStore.kycInfo.idDocument"
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
    </div>
  </div>
</template>
