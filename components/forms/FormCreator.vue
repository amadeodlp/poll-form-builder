<template>
  <UiCard>
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Create a new form</h2>
    </template>
    
    <form @submit.prevent="createForm" class="space-y-6">
      <UiInput
        v-model="title"
        label="Form Title"
        placeholder="Enter a title for your form"
        :required="true"
        :error-message="errors.title"
      />
      
      <UiTextarea
        v-model="description"
        label="Form Description (optional)"
        placeholder="Provide a brief description"
        :rows="3"
      />
      
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Questions</h3>
          <UiButton
            type="button"
            variant="outline"
            size="sm"
            @click="addQuestion"
          >
            <PlusIcon class="h-4 w-4 mr-1" />
            Add Question
          </UiButton>
        </div>
        
        <p v-if="errors.questions" class="text-sm text-red-500 mt-1">{{ errors.questions }}</p>
        
        <div v-if="questions.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
          <DocumentTextIcon class="h-12 w-12 mx-auto text-gray-400" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No questions added yet</p>
          <UiButton
            type="button"
            variant="primary"
            size="sm"
            @click="addQuestion"
            class="mt-3"
          >
            <PlusIcon class="h-4 w-4 mr-1" />
            Add your first question
          </UiButton>
        </div>
        
        <TransitionGroup name="question-list" tag="div" class="space-y-6">
          <div
            v-for="(question, index) in questions"
            :key="question.id"
            class="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
          >
            <div class="flex justify-between items-start">
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100">
                Question {{ index + 1 }}
              </h4>
              <div class="flex space-x-2">
                <UiButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="moveQuestion(index, -1)"
                  :disabled="index === 0"
                >
                  <ArrowUpIcon class="h-4 w-4" />
                </UiButton>
                <UiButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="moveQuestion(index, 1)"
                  :disabled="index === questions.length - 1"
                >
                  <ArrowDownIcon class="h-4 w-4" />
                </UiButton>
                <UiButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="removeQuestion(index)"
                >
                  <XMarkIcon class="h-4 w-4 text-red-500" />
                </UiButton>
              </div>
            </div>
            
            <div class="mt-4 space-y-4">
              <UiInput
                v-model="question.text"
                label="Question Text"
                placeholder="Enter your question"
                :required="true"
              />
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Type</label>
                  <select 
                    v-model="question.type"
                    class="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="short">Short Answer</option>
                    <option value="long">Long Answer</option>
                    <option value="number">Number</option>
                    <option value="radio">Multiple Choice</option>
                  </select>
                </div>
                
                <div>
                  <div class="flex items-center h-full pt-7">
                    <input
                      type="checkbox"
                      :id="`required-${question.id}`"
                      v-model="question.required"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label :for="`required-${question.id}`" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Required Question
                    </label>
                  </div>
                </div>
              </div>
              
              <UiInput
                v-model="question.placeholder"
                label="Placeholder (optional)"
                placeholder="Enter placeholder text"
              />
              
              <div v-if="question.type === 'radio'" class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Answer Options <span class="text-red-500">*</span>
                </label>
                
                <div
                  v-for="(option, optIndex) in question.options || []"
                  :key="optIndex"
                  class="flex items-center space-x-2"
                >
                  <UiInput
                    v-model="question.options[optIndex]"
                    placeholder="Option text"
                    :required="true"
                    class="flex-1"
                  />
                  <UiButton
                    v-if="(question.options?.length || 0) > 2"
                    variant="ghost"
                    size="sm"
                    type="button"
                    @click="removeOption(question, optIndex)"
                  >
                    <XMarkIcon class="h-5 w-5 text-red-500" />
                  </UiButton>
                </div>
                
                <UiButton
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="addOption(question)"
                  class="mt-2"
                >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  Add Option
                </UiButton>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <UiButton type="button" variant="outline" @click="reset">
          Reset
        </UiButton>
        <UiButton type="submit" variant="primary">
          Create Form
        </UiButton>
      </div>
    </form>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { 
  PlusIcon, 
  XMarkIcon, 
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'
import { useFormStore, QuestionType, FormQuestion } from '~/stores/form'

const formStore = useFormStore()
const emit = defineEmits(['created'])

const title = ref('')
const description = ref('')
const questions = ref<(FormQuestion & { id: string })[]>([])
const errors = reactive({
  title: '',
  questions: ''
})

const placeholders = {
  short: [
    "Enter your favorite game title",
    "What gaming platform do you use?",
    "Enter your gamer tag",
    "What's your preferred game genre?",
    "Name your favorite game character"
  ],
  long: [
    "Describe your ideal gaming experience",
    "What features would you like to see in our next game?",
    "Share your feedback about our latest release",
    "Tell us about your most memorable gaming moment",
    "Describe any bugs or issues you've encountered"
  ],
  number: [
    "Hours played weekly",
    "Rate this game from 1-10",
    "How many games do you own?",
    "Your age when you started gaming",
    "How much would you spend on a new release?"
  ],
  radio: [
    "Select your preference",
    "Choose the most important feature",
    "Pick your favorite",
    "Select what matters most to you",
    "Choose one option"
  ]
}

function addQuestion() {
  const questionType = 'short' as QuestionType
  const newQuestion: FormQuestion & { id: string } = {
    id: Math.random().toString(36).substring(2, 9),
    text: '',
    type: questionType,
    required: false,
    placeholder: getRandomPlaceholder(questionType),
    options: questionType === 'radio' ? ['', ''] : undefined
  }
  
  questions.value.push(newQuestion)
}

function removeQuestion(index: number) {
  questions.value.splice(index, 1)
}

function moveQuestion(index: number, direction: number) {
  const newIndex = index + direction
  
  if (newIndex < 0 || newIndex >= questions.value.length) return
  
  const question = questions.value[index]
  questions.value.splice(index, 1)
  questions.value.splice(newIndex, 0, question)
}

function addOption(question: FormQuestion & { id: string }) {
  if (!question.options) {
    question.options = []
  }
  question.options.push('')
}

function removeOption(question: FormQuestion & { id: string }, index: number) {
  if (!question.options) return
  
  question.options.splice(index, 1)
}

function getRandomPlaceholder(type: QuestionType): string {
  const pholders = placeholders[type]
  const randomIndex = Math.floor(Math.random() * pholders.length)
  return pholders[randomIndex]
}

function validateForm(): boolean {
  let isValid = true
  
  // Reset errors
  errors.title = ''
  errors.questions = ''
  
  // Validate title
  if (!title.value.trim()) {
    errors.title = 'Form title is required'
    isValid = false
  }
  
  // Validate questions
  if (questions.value.length === 0) {
    errors.questions = 'At least one question is required'
    isValid = false
  }
  
  // Validate each question
  for (const question of questions.value) {
    if (!question.text.trim()) {
      errors.questions = 'All questions must have text'
      isValid = false
      break
    }
    
    // Validate radio options
    if (question.type === 'radio') {
      if (!question.options || question.options.length < 2) {
        errors.questions = 'Multiple choice questions must have at least 2 options'
        isValid = false
        break
      }
      
      if (question.options.some(opt => !opt.trim())) {
        errors.questions = 'All options must have text'
        isValid = false
        break
      }
      
      // Check for duplicate options
      const uniqueOptions = new Set(question.options.map(opt => opt.trim().toLowerCase()))
      if (uniqueOptions.size !== question.options.length) {
        errors.questions = 'All options must be unique'
        isValid = false
        break
      }
    }
  }
  
  return isValid
}

function createForm() {
  if (!validateForm()) return
  
  // Clean up questions data
  const cleanQuestions = questions.value.map(({ id, ...rest }) => {
    // Make sure radio questions have non-empty options
    if (rest.type === 'radio' && rest.options) {
      rest.options = rest.options.filter(opt => opt.trim() !== '')
    }
    return rest
  })
  
  // Create the form
  const formId = formStore.createForm(title.value, description.value, cleanQuestions)
  
  // Reset the form
  reset()
  
  // Emit created event with the new form ID
  emit('created', formId)
}

function reset() {
  title.value = ''
  description.value = ''
  questions.value = []
  errors.title = ''
  errors.questions = ''
}

// When a question type changes, set an appropriate placeholder
watch(() => questions.value.map(q => q.type), (newTypes, oldTypes) => {
  if (!newTypes || !oldTypes) return
  
  newTypes.forEach((type, index) => {
    if (type !== oldTypes[index]) {
      const question = questions.value[index]
      
      // Set placeholder based on new type
      question.placeholder = getRandomPlaceholder(type)
      
      // Initialize/clear options for radio type
      if (type === 'radio') {
        question.options = ['', '']
      } else {
        question.options = undefined
      }
    }
  })
}, { deep: true })
</script>

<style scoped>
.question-list-move,
.question-list-enter-active,
.question-list-leave-active {
  transition: all 0.3s ease;
}

.question-list-enter-from,
.question-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.question-list-leave-active {
  position: absolute;
}
</style>