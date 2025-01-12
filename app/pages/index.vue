<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

const authStore = useAuthStore()

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
    v-else
    class="w-full flex justify-center items-center"
  >
    <KycForm />
  </div>
</template>
