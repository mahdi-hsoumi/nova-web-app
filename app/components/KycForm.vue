<script setup lang="ts">
import { ref } from 'vue'
import { useKyc } from '@/composables/useKyc'

const { submitKYC } = useKyc()

const state = reactive({
  name: '',
  documentFile: null as File | null
})

const errorMessage = ref('')
const loading = ref(false)

const previewFiles = (files: FileList): void => {
  state.documentFile = files[0]
}
const handleSubmit = async () => {
  if (!state.name || !state.documentFile) {
    errorMessage.value = 'All fields are required.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('name', state.name)
    formData.append('idDocument', state.documentFile) // Ensure this matches the server's expected field name

    await submitKYC(formData)
    alert('KYC submitted successfully!')
  } catch (error) {
    errorMessage.value = error.data.message || 'Failed to submit KYC. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="kyc-form">
    <h2 class="text-2xl font-semibold text-center">
      Submit KYC
    </h2>
    <div class="space-y-4">
      <UInput
        v-model="state.name"
        type="text"
        placeholder="Full Name"
        required
        class="w-full"
      />
      <UInput
        type="file"
        required
        class="w-full"
        @change="previewFiles"
      />
      <div class="text-red-500 text-center mt-4 h-[24px]">
        {{ errorMessage }}
      </div>
      <UButton
        :loading="loading"
        class="w-full justify-center"
        color="primary"
        @click="handleSubmit"
      >
        Submit
      </UButton>
    </div>
  </div>
</template>
