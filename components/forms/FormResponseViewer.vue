<template>
  <div class="space-y-4">
    <div v-if="responses.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
      <ClipboardIcon class="h-12 w-12 mx-auto text-gray-400" />
      <p class="mt-2 text-gray-500 dark:text-gray-400">No responses yet</p>
    </div>
    
    <div v-else>
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          {{ responses.length }} {{ responses.length === 1 ? 'Response' : 'Responses' }}
        </h3>
        
        <div class="flex space-x-2">
          <UiButton variant="outline" size="sm" @click="toggleExpandAll">
            {{ allExpanded ? 'Collapse All' : 'Expand All' }}
          </UiButton>
        </div>
      </div>
      
      <div class="space-y-4">
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
                <UiButton 
                  variant="ghost" 
                  size="sm" 
                  @click="toggleExpanded(response.id)"
                >
                  <ChevronDownIcon v-if="!expandedResponses[response.id]" class="h-5 w-5" />
                  <ChevronUpIcon v-else class="h-5 w-5" />
                </UiButton>
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
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ClipboardIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { Form, FormResponse } from '~/stores/form'

const props = defineProps({
  form: {
    type: Object as () => Form,
    required: true
  },
  responses: {
    type: Array as () => FormResponse[],
    required: true
  }
})

const expandedResponses = reactive<Record<string, boolean>>({})

// Automatically expand the first response if there's only one
if (props.responses.length === 1) {
  expandedResponses[props.responses[0].id] = true
}

function toggleExpanded(responseId: string) {
  expandedResponses[responseId] = !expandedResponses[responseId]
}

const allExpanded = computed(() => {
  return props.responses.every(response => expandedResponses[response.id])
})

function toggleExpandAll() {
  const newValue = !allExpanded.value
  
  props.responses.forEach(response => {
    expandedResponses[response.id] = newValue
  })
}

function findAnswer(response: FormResponse, questionId: string): string | number | undefined {
  const answer = response.answers.find(a => a.questionId === questionId)
  return answer ? answer.answer : undefined
}

function formatDate(date: Date): string {
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
</script>