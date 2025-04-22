<template>
  <UiCard class="h-full flex flex-col">
    <template #header>
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ form.title }}</h3>
          <p v-if="form.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ form.description }}
          </p>
        </div>
        <div class="flex space-x-2">
          <NuxtLink :to="`/forms/${form.id}/responses`">
            <UiButton variant="ghost" size="sm">
              <ClipboardDocumentListIcon class="h-4 w-4 mr-1" />
              Responses
            </UiButton>
          </NuxtLink>
          <UiButton v-if="showDelete" variant="ghost" size="sm" @click="$emit('delete')">
            <TrashIcon class="h-4 w-4 text-red-500" />
          </UiButton>
        </div>
      </div>
    </template>
      
    <div class="flex-1">
      <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {{ form.questions.length }} {{ form.questions.length === 1 ? 'question' : 'questions' }}
      </p>
      
      <NuxtLink :to="`/forms/${form.id}`" class="block w-full">
        <UiButton variant="primary" class="w-full flex items-center justify-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Fill Form</span>
        </UiButton>
      </NuxtLink>
    </div>
      
    <template #footer>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        Created {{ formatDate(form.createdAt) }}
      </div>
    </template>
  </UiCard>
</template>

<script setup lang="ts">
import { ClipboardDocumentListIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { Form } from '~/stores/form'

const props = defineProps({
  form: {
    type: Object as () => Form,
    required: true
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])

function formatDate(date: Date): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>
