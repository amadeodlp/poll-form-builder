<template>
  <div class="space-y-6">
    <div 
      v-for="question in questions" 
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
        v-model="localAnswers[question.id]"
        :placeholder="question.placeholder || 'Your answer'"
        :required="question.required"
      />
      
      <!-- Long Answer -->
      <UiTextarea
        v-else-if="question.type === 'long'"
        :id="question.id"
        v-model="localAnswers[question.id]"
        :placeholder="question.placeholder || 'Your answer'"
        :required="question.required"
        :rows="4"
      />
      
      <!-- Number -->
      <UiInput
        v-else-if="question.type === 'number'"
        :id="question.id"
        v-model="localAnswers[question.id]"
        type="number"
        :placeholder="question.placeholder || 'Enter a number'"
        :required="question.required"
      />
      
      <!-- Radio -->
      <UiRadioGroup
        v-else-if="question.type === 'radio'"
        :id="question.id"
        v-model="localAnswers[question.id]"
        :options="question.options || []"
        :required="question.required"
        :name="`question-${question.id}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { FormQuestion } from '~/stores/form'

const props = defineProps({
  questions: {
    type: Array as () => FormQuestion[],
    required: true
  },
  modelValue: {
    type: Object as () => Record<string, string | number>,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

// Create a local reactive proxy of the answers
const localAnswers = reactive<Record<string, string | number>>({})

// Initialize localAnswers with values from modelValue
watch(() => props.modelValue, (newValue) => {
  Object.keys(newValue).forEach(key => {
    localAnswers[key] = newValue[key]
  })
}, { immediate: true, deep: true })

// Initialize empty answers for new questions
watch(() => props.questions, (newQuestions) => {
  for (const question of newQuestions) {
    if (localAnswers[question.id] === undefined) {
      if (question.type === 'number') {
        localAnswers[question.id] = ''
      } else if (question.type === 'radio' && question.options && question.options.length > 0) {
        // Don't set a default value for radio
        localAnswers[question.id] = ''
      } else {
        localAnswers[question.id] = ''
      }
    }
  }
}, { immediate: true })

// Update the parent component when localAnswers changes
watch(localAnswers, (newAnswers) => {
  emit('update:modelValue', { ...newAnswers })
}, { deep: true })
</script>