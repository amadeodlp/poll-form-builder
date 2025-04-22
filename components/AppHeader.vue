<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">Poll & Form</span>
      </NuxtLink>
      
      <nav class="hidden md:flex items-center space-x-6">
        <NuxtLink 
          to="/" 
          class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition"
          active-class="text-primary-600 dark:text-primary-400 font-semibold"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/polls" 
          class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition"
          active-class="text-primary-600 dark:text-primary-400 font-semibold"
        >
          Polls
        </NuxtLink>
        <NuxtLink 
          to="/forms" 
          class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition"
          active-class="text-primary-600 dark:text-primary-400 font-semibold"
        >
          Forms
        </NuxtLink>
      </nav>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="toggleTheme"
          class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          aria-label="Toggle dark mode"
        >
          <SunIcon v-if="themeStore.darkMode" class="h-5 w-5" />
          <MoonIcon v-else class="h-5 w-5" />
        </button>
        
        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="container mx-auto px-4 py-3 space-y-2 bg-gray-50 dark:bg-gray-700">
        <NuxtLink 
          to="/" 
          class="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          active-class="bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium"
          @click="mobileMenuOpen = false"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/polls" 
          class="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          active-class="bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium"
          @click="mobileMenuOpen = false"
        >
          Polls
        </NuxtLink>
        <NuxtLink 
          to="/forms" 
          class="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          active-class="bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium"
          @click="mobileMenuOpen = false"
        >
          Forms
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '~/stores/theme'

const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)

function toggleTheme() {
  themeStore.toggleDarkMode()
}
</script>