import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(false)
  
  // Initialize on client-side only
  if (process.client) {
    // Check if user preference exists in localStorage
    const savedTheme = localStorage.getItem('darkMode')
    
    if (savedTheme !== null) {
      darkMode.value = savedTheme === 'true'
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      darkMode.value = prefersDark
    }
    
    // Apply theme to document
    updateDocumentClass()
  }
  
  // Watch for changes and save to localStorage
  watch(darkMode, () => {
    if (process.client) {
      localStorage.setItem('darkMode', darkMode.value.toString())
      updateDocumentClass()
    }
  })
  
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }
  
  function setDarkMode(value: boolean) {
    darkMode.value = value
  }
  
  function updateDocumentClass() {
    if (process.client) {
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
  
  return {
    darkMode,
    toggleDarkMode,
    setDarkMode
  }
})
