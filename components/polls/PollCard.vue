<template>
  <UiCard class="h-full flex flex-col">
    <template #header>
      <div class="flex justify-between items-start">
        <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ poll.question }}</h3>
        <div class="flex space-x-2">
          <NuxtLink :to="`/polls/${poll.id}/results`">
            <UiButton variant="ghost" size="sm">
              <ChartBarIcon class="h-4 w-4 mr-1" />
              Results
            </UiButton>
          </NuxtLink>
          <UiButton v-if="showDelete" variant="ghost" size="sm" @click="$emit('delete')">
            <TrashIcon class="h-4 w-4 text-red-500" />
          </UiButton>
        </div>
      </div>
    </template>
      
    <div class="flex-1">
      <p v-if="showVoteForm" class="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Select an option and vote.
      </p>
        
      <div v-if="showVoteForm" class="space-y-3">
        <UiRadioGroup
          v-model="selectedOption"
          :options="poll.options.map(option => ({ label: option.text, value: option.id }))"
          :required="true"
        />
          
        <div class="mt-4">
          <UiButton 
            variant="primary" 
            :disabled="!selectedOption" 
            @click="submitVote"
          >
            Vote
          </UiButton>
        </div>
      </div>
        
      <div v-else-if="showResults" class="space-y-4">
        <div v-for="option in poll.options" :key="option.id" class="space-y-1">
          <div class="flex justify-between text-sm">
            <span>{{ option.text }}</span>
            <span class="font-medium">{{ calculatePercentage(option.votes) }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              class="bg-primary-600 h-2.5 rounded-full" 
              :style="{ width: `${calculatePercentage(option.votes)}%` }"
            ></div>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ option.votes }} {{ option.votes === 1 ? 'vote' : 'votes' }}
          </div>
        </div>
          
        <p class="text-sm text-gray-500 dark:text-gray-400 pt-2">
          Total votes: {{ totalVotes }}
        </p>
      </div>
    </div>
      
    <template #footer v-if="showTimestamp">
      <div class="text-xs text-gray-500 dark:text-gray-400">
        Created {{ formatDate(poll.createdAt) }}
      </div>
    </template>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChartBarIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { Poll } from '~/stores/poll'

const props = defineProps({
  poll: {
    type: Object as () => Poll,
    required: true
  },
  showVoteForm: {
    type: Boolean,
    default: true
  },
  showResults: {
    type: Boolean,
    default: false
  },
  showTimestamp: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['vote', 'delete'])

const selectedOption = ref('')

const totalVotes = computed(() => {
  return props.poll.options.reduce((sum, option) => sum + option.votes, 0)
})

function calculatePercentage(votes: number): number {
  if (totalVotes.value === 0) return 0
  return Math.round((votes / totalVotes.value) * 100)
}

function submitVote() {
  if (selectedOption.value) {
    emit('vote', selectedOption.value)
    selectedOption.value = ''
  }
}

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