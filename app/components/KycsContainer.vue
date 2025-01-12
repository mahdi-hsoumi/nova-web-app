<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useKyc } from '@/composables/useKyc'
import type { User } from '~/types'

// Default columns for the table
const defaultColumns = [
  { key: '#', label: '#' },
  { key: '_id', label: '_id', sortable: true },
  { key: 'userId', label: 'userId', sortable: true },
  { key: 'name', label: 'name', sortable: true },
  { key: 'idDocument', label: 'idDocument' },
  { key: 'status', label: 'status', sortable: true },
  { key: 'createdAt', label: 'createdAt', sortable: true },
  { key: 'updatedAt', label: 'updatedAt', sortable: true }
]

// Reactive state variables
const pending = ref(false)
const selected = ref<User[]>([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref<string[]>([])
const sort = ref({ column: 'createdAt', direction: 'desc' as const })
const isOpen = ref(false)
const selectedIdDocument = ref('')
const toast = useToast()

// Pagination state variables
const pages = ref(1)
const total = ref(10)
const perPage = 8
const page = ref(1)

// Users data and error state
const users = ref<User[]>([])
const error = ref('')

// Composables for KYC operations
const { listKYC, updateKYCStatus } = useKyc()

// Computed properties for columns and query parameters
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const query = computed(() => ({
  status: selectedStatuses.value.length ? selectedStatuses.value : undefined,
  sortBy: sort.value.column,
  sortOrder: sort.value.direction,
  page: page.value,
  limit: perPage
}))

// Function to fetch rows based on query parameters
async function fetchRows() {
  try {
    pending.value = true
    const response = await listKYC(query.value)
    users.value = response.kycs
    pages.value = response.pages
    total.value = response.total
  } catch (err) {
    error.value = 'Failed to load users'
    console.error(err)
    toast.add({
      title: 'Error',
      description: 'Failed to load users. Please try again later.'
    })
  } finally {
    pending.value = false
  }
}

// Fetch rows on component mount and when query parameters change
fetchRows()
watch(query, fetchRows, { immediate: true })

// Default statuses for KYC
const defaultStatuses = ['pending', 'approved', 'rejected']

// Menu items for updating KYC status
const items = [
  [{
    label: 'approved',
    click: async () => {
      try {
        for (const user of selected.value) {
          await updateKYCStatus(user.userId, 'approved')
        }
        fetchRows()
        toast.add({
          title: 'Success',
          description: 'Selected users have been approved.'
        })
      } catch (err) {
        console.error('Failed to update status to approved:', err)
        toast.add({
          title: 'Error',
          description: 'Failed to update status to approved. Please try again later.'
        })
      }
    }
  }], [{
    label: 'rejected',
    click: async () => {
      try {
        for (const user of selected.value) {
          await updateKYCStatus(user.userId, 'rejected')
        }
        fetchRows()
        toast.add({
          title: 'Success',
          description: 'Selected users have been rejected.'
        })
      } catch (err) {
        console.error('Failed to update status to rejected:', err)
        toast.add({
          title: 'Error',
          description: 'Failed to update status to rejected. Please try again later.'
        })
      }
    }
  }],
  [{
    label: 'pending',
    click: async () => {
      try {
        for (const user of selected.value) {
          await updateKYCStatus(user.userId, 'pending')
        }
        fetchRows()
        toast.add({
          title: 'Success',
          description: 'Selected users have been set to pending.'
        })
      } catch (err) {
        console.error('Failed to update status to pending:', err)
        toast.add({
          title: 'Error',
          description: 'Failed to update status to pending. Please try again later.'
        })
      }
    }
  }]
]

// Function to handle row selection
function onSelect(row: User) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="flex">
        <USelectMenu
          v-model="selectedStatuses"
          class="mr-2.5"
          icon="i-heroicons-check-circle"
          placeholder="Status"
          multiple
          :options="defaultStatuses"
          :ui-menu="{ option: { base: 'capitalize' } }"
        />
        <UDropdown
          :items="items"
          :popper="{ placement: 'bottom-start' }"
          class="mr-2.5   "
        >
          <UButton
            color="white"
            label="Actions"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
        </UDropdown>
      </div>
      <USelectMenu
        v-model="selectedColumns"
        icon="i-heroicons-adjustments-horizontal-solid"
        :options="defaultColumns"
        multiple
        class="hidden lg:block "
      >
        <template #label>
          Display
        </template>
      </USelectMenu>
    </div>
    <UModal v-model="isOpen">
      <div class="p-4">
        <img
          :src="selectedIdDocument"
          alt="ID Document"
          class="max-w-full h-auto rounded"
        >
      </div>
    </UModal>
    <UTable
      v-model="selected"
      v-model:sort="sort"
      :rows="users"
      :columns="columns"
      :loading="pending"
      sort-mode="manual"
      class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      @select="onSelect"
    >
      <template #name-data="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar
            v-bind="row.avatar"
            :alt="row.name"
            size="xs"
          />

          <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
        </div>
      </template>

      <template #status-data="{ row }">
        <UBadge
          :label="row.status"
          :color="row.status === 'approved' ? 'green' : row.status === 'pending' ? 'orange' : 'red'"
          variant="subtle"
          class="capitalize"
        />
      </template>
      <template #idDocument-data="{ row }">
        <img
          :src="row.idDocument"
          alt="ID Document"
          class="w-auto h-[30px] rounded"
          @click="selectedIdDocument = row.idDocument; isOpen = true"
        >
      </template>
    </UTable>
    <UPagination
      v-model="page"
      :page-count="perPage"
      :total="total"
    />
    <p v-if="error">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
