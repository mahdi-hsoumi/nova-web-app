<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

const authStore = useAuthStore()
const { getKYC } = useKyc()

const items = [[{
  label: 'New mail',
  icon: 'i-heroicons-paper-airplane',
  to: '/inbox'
}, {
  label: 'New user',
  icon: 'i-heroicons-user-plus',
  to: '/users'
}]]

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')
const kycInfo = ref(null)
const loading = ref(true)
onMounted(async () => {
  if (authStore.role === 'user') {
    try {
      const response = await getKYC()
      console.log(response)
      kycInfo.value = response
    } catch (error) {
      console.error('Failed to fetch KYC information:', error)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})
</script>

<template>
  <UDashboardPage v-if="authStore.role === 'admin'">
    <UDashboardPanel

      grow
    >
      <UDashboardNavbar title="Home">
        <template #right>
          <UButton
            color="gray"
            variant="ghost"
            square
          >
            <UChip
              color="red"
              inset
            >
              <UIcon
                name="i-heroicons-bell"
                class="w-5 h-5"
              />
            </UChip>
          </UButton>

          <UDropdown :items="items">
            <UButton
              icon="i-heroicons-plus"
              size="md"
              class="ml-1.5 rounded-full"
            />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker
            v-model="range"
            class="-ml-2.5"
          />

          <HomePeriodSelect
            v-model="period"
            :range="range"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <HomeChart
          :period="period"
          :range="range"
        />

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <HomeSales />
          <HomeCountries />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
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
  </div>
</template>
