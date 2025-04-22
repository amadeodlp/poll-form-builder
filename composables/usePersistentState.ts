import { ref, watch } from 'vue'

export function usePersistentState<T>(key: string, defaultValue: T) {
  // Create a ref to hold the current value
  const state = ref<T>(defaultValue)
  
  // Try to load the value from localStorage on client-side only
  if (process.client) {
    const savedValue = localStorage.getItem(key)
    if (savedValue) {
      try {
        state.value = JSON.parse(savedValue)
      } catch (e) {
        console.error(`Error loading state for ${key}:`, e)
      }
    }
  }
  
  // Watch for changes to the state and save to localStorage
  watch(state, (newValue) => {
    if (process.client) {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })
  
  return state
}
