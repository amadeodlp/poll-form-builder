<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Forms</h1>
      <NuxtLink to="/forms/create">
        <UiButton variant="primary">
          <PlusIcon class="h-5 w-5 mr-1" />
          Create Form
        </UiButton>
      </NuxtLink>
    </div>
    
    <div v-if="forms.length === 0" class="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
      <ClipboardDocumentListIcon class="h-16 w-16 mx-auto text-gray-400" />
      <h2 class="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">No forms yet</h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Create your first form to get started</p>
      <NuxtLink to="/forms/create">
        <UiButton variant="primary" class="mt-6">
          Create Form
        </UiButton>
      </NuxtLink>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="form in forms" :key="form.id">
        <FormsFormCard
          :form="form"
          :show-delete="true"
          @delete="deleteForm(form.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '~/stores/form'

const formStore = useFormStore()

// Get forms sorted by creation date (newest first)
const forms = computed(() => {
  return [...formStore.forms]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

function deleteForm(formId: string) {
  if (confirm('Are you sure you want to delete this form? All responses will also be deleted.')) {
    formStore.deleteForm(formId)
  }
}
</script>