// FILE: nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/ui', '@vueuse/nuxt', '@pinia/nuxt'],
  plugins: ['~/plugins/fetch.ts'],
  devtools: {
    enabled: false
  },

  colorMode: {
    disableTransition: true
  },

  ui: {
    safelistColors: ['primary', 'red', 'orange', 'green']
  },
  runtimeConfig: {
    // can be overridden by NUXT_... environment variable
    public: {
      // can be overridden by NUXT_PUBLIC_... environment variable
      apiBase: ''
    }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-01',

  typescript: {
    strict: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
