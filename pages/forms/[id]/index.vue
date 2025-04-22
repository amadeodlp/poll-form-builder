<template>
  <div v-if="form" class="space-y-8">
    <div class="flex items-center mb-6">
      <NuxtLink to="/forms" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
        <ArrowLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Form</h1>
    </div>
    
    <div class="max-w-3xl mx-auto">
      <UiCard>
        <template #header>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ form.title }}</h2>
            <p v-if="form.description" class="mt-2 text-gray-600 dark:text-gray-400">
              {{ form.description }}
            </p>
          </div>
        </template>
        
        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Render questions directly in this component -->
          <div class="space-y-6">
            <div 
              v-for="question in form.questions" 
              :key="question.id"
              class="p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div class="mb-3">
                <label :for="question.id" class="block text-base font-medium text-gray-900 dark:text-gray-100">
                  {{ question.text }}
                  <span v-if="question.required" class="text-red-500 ml-1">*</span>
                </label>
              </div>
              
              <!-- Short Answer -->
              <UiInput
                v-if="question.type === 'short'"
                :id="question.id"
                v-model="answers[question.id]"
                :placeholder="question.placeholder || 'Your answer'"
                :required="question.required"
              />
              
              <!-- Long Answer -->
              <UiTextarea
                v-else-if="question.type === 'long'"
                :id="question.id"
                v-model="answers[question.id]"
                :placeholder="question.placeholder || 'Your answer'"
                :required="question.required"
                :rows="4"
              />
              
              <!-- Number -->
              <UiInput
                v-else-if="question.type === 'number'"
                :id="question.id"
                v-model="answers[question.id]"
                type="number"
                :placeholder="question.placeholder || 'Enter a number'"
                :required="question.required"
              />
              
              <!-- Radio -->
              <div v-else-if="question.type === 'radio'" class="space-y-2">
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  class="flex items-center"
                >
                  <input 
                    type="radio" 
                    :id="`${question.id}-${optIndex}`" 
                    :name="`question-${question.id}`"
                    :value="option"
                    v-model="answers[question.id]"
                    :required="question.required"
                    class="mr-2 h-4 w-4"
                  />
                  <label :for="`${question.id}-${optIndex}`">{{ option }}</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
              @click="reset"
            >
              Reset
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
        
        <template #footer>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Created {{ formatDate(form.createdAt) }}
          </div>
        </template>
      </UiCard>
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
import { ref, computed } from 'vue'
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
    
    const answers = ref({})
    
    function validateForm() {
      if (!form.value) return false
      
      // Check required questions
      const requiredQuestions = form.value.questions.filter(q => q.required)
      
      for (const question of requiredQuestions) {
        const answer = answers.value[question.id]
        
        if (answer === undefined || answer === '') {
          alert(`Please answer the question: ${question.text}`)
          return false
        }
      }
      
      return true
    }
    
    function submitForm() {
      if (!validateForm()) return
      
      // Format answers for submission
      const formattedAnswers = Object.entries(answers.value).map(([questionId, answer]) => ({
        questionId,
        answer
      }))
      
      // Submit the form
      formStore.submitFormResponse(formId.value, formattedAnswers)
      
      // Show a success message
      alert('Form submitted successfully!')
      
      // Reset the form
      reset()
      
      // Redirect to form responses
      router.push(`/forms/${formId.value}/responses`)
    }
    
    function reset() {
      answers.value = {}
    }
    
    function formatDate(date) {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
    
    return {
      form,
      answers,
      submitForm,
      reset,
      formatDate
    }
  },
  components: {
    ArrowLeftIcon
  }
}
</script>
