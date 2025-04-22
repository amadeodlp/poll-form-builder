<template>
  <div class="space-y-6">
    <div class="flex items-center mb-6">
      <NuxtLink to="/forms" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
        <ArrowLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create a New Form</h1>
    </div>
    
    <UiCard>
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Create a new form</h2>
      </template>
      
      <form @submit.prevent="createForm" class="space-y-6">
        <UiInput
          v-model="title"
          label="Form Title"
          placeholder="Enter a title for your form"
          required
        />
        
        <UiTextarea
          v-model="description"
          label="Form Description (optional)"
          placeholder="Provide a brief description"
          :rows="3"
        />
        
        <!-- Questions Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Questions</h3>
            <button 
              type="button"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              @click="addQuestion"
            >
              Add Question
            </button>
          </div>
          
          <div v-if="questions.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p class="text-gray-500">No questions added yet</p>
          </div>
          
          <div 
            v-for="(question, index) in questions" 
            :key="index"
            class="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
          >
            <div class="flex justify-between">
              <h4>Question {{ index + 1 }}</h4>
              <button 
                type="button" 
                class="text-red-500"
                @click="removeQuestion(index)"
              >
                Remove
              </button>
            </div>
            
            <div class="mt-4 space-y-4">
              <UiInput
                v-model="question.text"
                label="Question Text"
                placeholder="Enter your question"
                required
              />
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Type
                </label>
                <select 
                  v-model="question.type"
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800"
                >
                  <option value="short">Short Answer</option>
                  <option value="long">Long Answer</option>
                  <option value="number">Number</option>
                  <option value="radio">Multiple Choice</option>
                </select>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :id="'required-' + index"
                  v-model="question.required"
                  class="h-4 w-4"
                />
                <label :for="'required-' + index" class="ml-2">
                  Required Question
                </label>
              </div>
              
              <!-- Placeholder field - only for short and long answer types -->
              <UiInput
                v-if="question.type === 'short' || question.type === 'long'"
                v-model="question.placeholder"
                label="Placeholder (optional)"
                placeholder="Enter text to show as a placeholder for this question"
              />
              
              <!-- Placeholder field - only for number type with special validation -->
              <UiInput
                v-if="question.type === 'number'"
                v-model="question.placeholder"
                label="Placeholder (optional)"
                placeholder="Enter a number as placeholder"
                type="number"
              />
              
              <!-- Options for radio type -->
              <div v-if="question.type === 'radio'" class="space-y-3 border-t pt-3">
                <label class="block font-medium">Answer Options</label>
                
                <div v-for="(option, optIndex) in question.options" :key="optIndex" class="flex space-x-2">
                  <UiInput
                    v-model="question.options[optIndex]"
                    placeholder="Option text"
                    class="flex-1"
                  />
                  <button 
                    v-if="question.options.length > 2"
                    type="button" 
                    class="text-red-500"
                    @click="removeOption(question, optIndex)"
                  >
                    Remove
                  </button>
                </div>
                
                <button 
                  type="button"
                  class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-md"
                  @click="addOption(question)"
                >
                  Add Option
                </button>
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
            Create Form
          </button>
        </div>
      </form>
    </UiCard>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '~/stores/form'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const formStore = useFormStore()
    
    const title = ref('')
    const description = ref('')
    const questions = ref([])
    
    function addQuestion() {
      const questionType = 'short'
      questions.value.push({
        id: Math.random().toString(36).substring(2, 9),
        text: '',
        type: questionType,
        required: false,
        placeholder: '', // Empty placeholder by default
        options: questionType === 'radio' ? ['', ''] : []
      })
    }
    
    function removeQuestion(index) {
      questions.value.splice(index, 1)
    }
    
    function addOption(question) {
      if (!question.options) {
        question.options = []
      }
      question.options.push('')
    }
    
    function removeOption(question, index) {
      question.options.splice(index, 1)
    }
    
    // Watch for question type changes to handle placeholder appropriately
    watch(() => questions.value, (newQuestions) => {
      if (!newQuestions) return
      
      newQuestions.forEach(question => {
        // Clear placeholder for radio questions as they don't need one
        if (question.type === 'radio') {
          question.placeholder = ''
        }
      })
    }, { deep: true })
    
    function validateForm() {
      if (!title.value.trim()) {
        alert('Form title is required')
        return false
      }
      
      if (questions.value.length === 0) {
        alert('At least one question is required')
        return false
      }
      
      // Validate each question
      for (const question of questions.value) {
        if (!question.text.trim()) {
          alert('All questions must have text')
          return false
        }
        
        // Validate radio options
        if (question.type === 'radio') {
          if (!question.options || question.options.length < 2) {
            alert('Multiple choice questions must have at least 2 options')
            return false
          }
          
          if (question.options.some(opt => !opt.trim())) {
            alert('All options must have text')
            return false
          }
        }
        
        // Validate number placeholders
        if (question.type === 'number' && question.placeholder) {
          if (isNaN(Number(question.placeholder))) {
            alert('Number questions must have numeric placeholders')
            return false
          }
        }
      }
      
      return true
    }
    
    function createForm() {
      if (!validateForm()) return
      
      // Clean up questions data
      const cleanQuestions = questions.value.map(({ id, ...rest }) => {
        // Make sure radio questions have non-empty options
        if (rest.type === 'radio' && rest.options) {
          rest.options = rest.options.filter(opt => opt.trim() !== '')
          
          // Ensure radio questions don't have placeholders
          rest.placeholder = ''
        }
        
        // For number questions, ensure placeholder is a number
        if (rest.type === 'number' && rest.placeholder) {
          rest.placeholder = Number(rest.placeholder).toString()
        }
        
        return rest
      })
      
      // Create the form
      const formId = formStore.createForm(title.value, description.value, cleanQuestions)
      
      // Reset the form
      reset()
      
      // Redirect to forms list page
      router.push('/forms')
    }
    
    function reset() {
      title.value = ''
      description.value = ''
      questions.value = []
    }
    
    return {
      title,
      description,
      questions,
      addQuestion,
      removeQuestion,
      addOption,
      removeOption,
      createForm,
      reset
    }
  },
  components: {
    ArrowLeftIcon
  }
}
</script>
