<template>
  <UiCard>
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Create a new poll</h2>
    </template>
    
    <form @submit.prevent="createPoll" class="space-y-6">
      <UiInput
        v-model="question"
        label="Question"
        placeholder="What's your question?"
        :required="true"
        :error-message="errors.question"
      />
      
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Poll Options <span class="text-red-500">*</span>
        </label>
        
        <div v-for="(option, index) in options" :key="index" class="flex items-center space-x-2">
          <UiInput
            v-model="options[index]"
            placeholder="Option text"
            :required="true"
            class="flex-1"
          />
          <UiButton
            v-if="options.length > 2"
            variant="ghost"
            size="sm"
            type="button"
            @click="removeOption(index)"
          >
            <XMarkIcon class="h-5 w-5 text-red-500" />
          </UiButton>
        </div>
        
        <p v-if="errors.options" class="text-sm text-red-500 mt-1">{{ errors.options }}</p>
        
        <UiButton
          type="button"
          variant="outline"
          size="sm"
          @click="addOption"
          class="mt-2"
        >
          <PlusIcon class="h-4 w-4 mr-1" />
          Add Option
        </UiButton>
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <UiButton type="button" variant="outline" @click="reset">
          Reset
        </UiButton>
        <UiButton type="submit" variant="primary">
          Create Poll
        </UiButton>
      </div>
    </form>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { usePollStore } from '~/stores/poll'

const pollStore = usePollStore()
const emit = defineEmits(['created'])

const question = ref('')
const options = ref(['', '']) // Start with two empty options
const errors = reactive({
  question: '',
  options: ''
})

function addOption() {
  options.value.push('')
}

function removeOption(index: number) {
  options.value.splice(index, 1)
}

function validateForm(): boolean {
  let isValid = true
  
  // Reset errors
  errors.question = ''
  errors.options = ''
  
  // Validate question
  if (!question.value.trim()) {
    errors.question = 'Question is required'
    isValid = false
  }
  
  // Validate options
  const nonEmptyOptions = options.value.filter(opt => opt.trim() !== '')
  
  if (nonEmptyOptions.length < 2) {
    errors.options = 'At least two options are required'
    isValid = false
  }
  
  // Check for duplicate options
  const uniqueOptions = new Set(options.value.map(opt => opt.trim().toLowerCase()))
  if (uniqueOptions.size !== nonEmptyOptions.length) {
    errors.options = 'All options must be unique'
    isValid = false
  }
  
  return isValid
}

function createPoll() {
  if (!validateForm()) return
  
  // Filter out empty options
  const validOptions = options.value.filter(opt => opt.trim() !== '')
  
  // Create the poll
  const pollId = pollStore.createPoll(question.value, validOptions)
  
  // Reset the form
  reset()
  
  // Emit created event with the new poll ID
  emit('created', pollId)
}

function reset() {
  question.value = ''
  options.value = ['', '']
  errors.question = ''
  errors.options = ''
}
</script>