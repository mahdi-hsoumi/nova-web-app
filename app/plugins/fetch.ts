export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  nuxtApp.hook('app:created', () => {
    const originalFetch = $fetch.create({
      baseURL: config.public.apiBase

    })

    nuxtApp.provide('fetch', originalFetch)
  })
})
