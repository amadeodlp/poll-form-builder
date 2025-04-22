<template>
  <div v-if="form" class="space-y-8">
    <div class="flex items-center mb-6">
      <NuxtLink to="/forms" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
        <ArrowLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Form Responses</h1>
    </div>
    
    <div class="max-w-5xl mx-auto">
      <UiCard class="mb-6">
        <template #header>
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ form.title }}</h2>
              <p v-if="form.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ form.description }}
              </p>
            </div>
            <div>
              <NuxtLink :to="`/forms/${form.id}`">
                <button class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Fill Form</span>
                </button>
              </NuxtLink>
            </div>
          </div>
        </template>
        
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">{{ form.questions.length }}</span> 
              {{ form.questions.length === 1 ? 'question' : 'questions' }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              <span class="font-medium">{{ responses.length }}</span> 
              {{ responses.length === 1 ? 'response' : 'responses' }}
            </p>
          </div>
          
          <button 
            v-if="responses.length === 0" 
            @click="deleteForm"
            class="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete Form</span>
          </button>
        </div>
      </UiCard>
      
      <!-- Custom Response Viewer -->
      <div class="space-y-4">
        <div v-if="responses.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p class="text-gray-500">No responses yet</p>
        </div>
        
        <UiCard
          v-for="(response, index) in responses"
          :key="response.id"
          class="overflow-visible"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-900 dark:text-gray-100">
                Response #{{ index + 1 }}
              </h4>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(response.submittedAt) }}
                </span>
                <button 
                  @click="toggleExpanded(response.id)"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <span v-if="!expandedResponses[response.id]">▼</span>
                  <span v-else>▲</span>
                </button>
              </div>
            </div>
          </template>
          
          <div v-if="expandedResponses[response.id]" class="space-y-4">
            <div 
              v-for="question in form.questions" 
              :key="question.id"
              class="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
            >
              <h5 class="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {{ question.text }}
              </h5>
              
              <div class="text-gray-700 dark:text-gray-300">
                <template v-if="findAnswer(response, question.id) !== undefined">
                  <template v-if="question.type === 'radio'">
                    {{ findAnswer(response, question.id) }}
                  </template>
                  <template v-else-if="question.type === 'long'">
                    <p class="whitespace-pre-line">{{ findAnswer(response, question.id) }}</p>
                  </template>
                  <template v-else>
                    {{ findAnswer(response, question.id) }}
                  </template>
                </template>
                <span v-else class="text-gray-400 dark:text-gray-500 italic">No answer provided</span>
              </div>
            </div>
          </div>
          
          <template v-else>
            <div class="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
              Click to expand
            </div>
          </template>
        </UiCard>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-12">
    <p class="text-gray-500 dark:text-gray-400">Form not found</p>
    <NuxtLink to="/forms" class="mt-4 inline-block">
      <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Back to Forms
      </button>
    </NuxtLink>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '~/stores/form'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formStore = useFormStore()
    
    const formId = computed(() => route.params.id)
    const form = computed(() => formStore.getFormById(formId.value))
    const responses = computed(() => formStore.getResponsesByFormId(formId.value))
    
    const expandedResponses = reactive({})
    
    // Automatically expand the first response if there's only one
    if (responses.value && responses.value.length === 1) {
      expandedResponses[responses.value[0].id] = true
    }
    
    function toggleExpanded(responseId) {
      expandedResponses[responseId] = !expandedResponses[responseId]
    }
    
    function findAnswer(response, questionId) {
      const answer = response.answers.find(a => a.questionId === questionId)
      return answer ? answer.answer : undefined
    }
    
    function deleteForm() {
      if (!form.value) return
      
      if (confirm('Are you sure you want to delete this form?')) {
        formStore.deleteForm(formId.value)
        router.push('/forms')
      }
    }
    
    function formatDate(date) {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
    
    return {
      form,
      responses,
      expandedResponses,
      toggleExpanded,
      findAnswer,
      deleteForm,
      formatDate
    }
  },
  components: {
    ArrowLeftIcon
  }
}
</script>
