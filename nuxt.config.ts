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
    // This ensures all asset URLs are correct when deployed to a subdirectory
    baseURL: '/poll-form-builder/',
    // Ensure the build process uses relative paths for assets
    buildAssetsDir: '/_nuxt/',
    // CDN URL - leave empty for GitHub Pages
    cdnURL: ''
  },
  
  vite: {
    // This ensures the correct base path for all assets
    base: '/poll-form-builder/'
  },
  
  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore']
    ]
  },
  
  // Set to SPA mode for GitHub Pages
  ssr: false,
  
  // Basic static site configuration
  nitro: {
    preset: 'github-pages',
    prerender: {
      crawlLinks: false,
      routes: ['/']
    },
    output: {
      publicDir: 'dist'
    }
  },
  
  // For the router
  router: {
    options: {
      // Add this to ensure client-side routing works properly with gh-pages
      hashMode: false
    }
  }
})
