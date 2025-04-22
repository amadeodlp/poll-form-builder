<template>
  <div class="space-y-12">
    <section class="text-center max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Poll & Form Builder</h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">Create and share polls and forms quickly and easily</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <NuxtLink to="/polls/create" class="block">
          <UiCard class="h-full transform transition-transform hover:scale-105">
            <div class="text-center p-6">
              <div class="bg-primary-100 dark:bg-primary-900 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <ChartPieIcon class="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Create a Poll</h2>
              <p class="text-gray-600 dark:text-gray-300">
                Quick single-question polls with multiple-choice options
              </p>
            </div>
          </UiCard>
        </NuxtLink>
        
        <NuxtLink to="/forms/create" class="block">
          <UiCard class="h-full transform transition-transform hover:scale-105">
            <div class="text-center p-6">
              <div class="bg-secondary-100 dark:bg-secondary-900 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <ClipboardDocumentListIcon class="h-12 w-12 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Create a Form</h2>
              <p class="text-gray-600 dark:text-gray-300">
                Customizable forms with various question types
              </p>
            </div>
          </UiCard>
        </NuxtLink>
      </div>
    </section>
    
    <section class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <ChartPieIcon class="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
            Recent Polls
          </h2>
          
          <div v-if="recentPolls.length === 0" class="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">No polls created yet</p>
            <NuxtLink to="/polls/create">
              <UiButton variant="primary" class="mt-4">
                Create Your First Poll
              </UiButton>
            </NuxtLink>
          </div>
          
          <div v-else class="space-y-4">
            <PollsPollCard
              v-for="poll in recentPolls"
              :key="poll.id"
              :poll="poll"
              :show-vote-form="false"
              :show-results="true"
            />
            
            <div class="text-center mt-6">
              <NuxtLink to="/polls">
                <UiButton variant="outline">
                  View All Polls
                </UiButton>
              </NuxtLink>
            </div>
          </div>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <ClipboardDocumentListIcon class="h-6 w-6 text-secondary-600 dark:text-secondary-400 mr-2" />
            Recent Forms
          </h2>
          
          <div v-if="recentForms.length === 0" class="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <p class="text-gray-500 dark:text-gray-400">No forms created yet</p>
            <NuxtLink to="/forms/create">
              <UiButton variant="primary" class="mt-4">
                Create Your First Form
              </UiButton>
            </NuxtLink>
          </div>
          
          <div v-else class="space-y-4">
            <FormsFormCard
              v-for="form in recentForms"
              :key="form.id"
              :form="form"
            />
            
            <div class="text-center mt-6">
              <NuxtLink to="/forms">
                <UiButton variant="outline">
                  View All Forms
                </UiButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChartPieIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'
import { usePollStore } from '~/stores/poll'
import { useFormStore } from '~/stores/form'

const pollStore = usePollStore()
const formStore = useFormStore()

// Get recent polls and forms
const recentPolls = computed(() => {
  return [...pollStore.polls]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
})

const recentForms = computed(() => {
  return [...formStore.forms]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
})
</script>