// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  typescript: {
    strict: true
  },
  
  app: {
    head: {
      title: 'Poll & Form Builder',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Create and respond to polls and forms' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    },
    baseURL: '/poll-form-builder/'
  },
  
  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore']
    ]
  },
  
  // Set to SPA mode for cleaner static deployment
  ssr: false,
  
  // Disable prerendering since we're using client-side routing
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/']
    }
  }
})
