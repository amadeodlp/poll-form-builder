<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="space-y-2">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="flex items-center"
      >
        <input
          :id="`${id}-${index}`"
          type="radio"
          :name="name"
          :value="option.value || option"
          :checked="(option.value || option) === modelValue"
          :required="required"
          :disabled="disabled"
          @change="$emit('update:modelValue', (option.value || option))"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
        <label :for="`${id}-${index}`" class="ml-3 block text-sm text-gray-700 dark:text-gray-300">
          {{ option.label || option }}
        </label>
      </div>
    </div>
    <p v-if="errorMessage" class="text-sm text-red-500 mt-1">{{ errorMessage }}</p>
    <p v-else-if="hint" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Option = string | { label: string; value: string }

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `radio-${Math.random().toString(36).substring(2, 9)}`
  },
  name: {
    type: String,
    default: () => `radio-group-${Math.random().toString(36).substring(2, 9)}`
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array as () => Option[],
    default: () => []
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>