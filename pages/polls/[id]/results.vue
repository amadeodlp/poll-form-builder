<template>
  <div v-if="poll" class="space-y-6">
    <div class="flex items-center mb-6">
      <NuxtLink to="/polls" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
        <ArrowLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Poll Results</h1>
    </div>
    
    <div class="max-w-2xl mx-auto">
      <PollsPollCard
        :poll="poll"
        :show-vote-form="false"
        :show-results="true"
      />
      
      <div class="mt-8">
        <UiCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Poll Details</h2>
          </template>
          
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Question</h3>
              <p class="mt-1 text-lg text-gray-900 dark:text-gray-100">{{ poll.question }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Votes</h3>
              <p class="mt-1 text-lg text-gray-900 dark:text-gray-100">{{ totalVotes }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
              <p class="mt-1 text-gray-900 dark:text-gray-100">{{ formatDate(poll.createdAt) }}</p>
            </div>
          </div>
          
          <template #footer>
            <div class="flex justify-between">
              <NuxtLink :to="`/polls/${poll.id}`">
                <UiButton variant="outline">
                  Back to Poll
                </UiButton>
              </NuxtLink>
              
              <UiButton variant="danger" @click="deletePoll">
                <TrashIcon class="h-5 w-5 mr-1" />
                Delete Poll
              </UiButton>
            </div>
          </template>
        </UiCard>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-12">
    <p class="text-gray-500 dark:text-gray-400">Poll not found</p>
    <NuxtLink to="/polls" class="mt-4 inline-block">
      <UiButton variant="primary">Back to Polls</UiButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeftIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { usePollStore } from '~/stores/poll'

const route = useRoute()
const router = useRouter()
const pollStore = usePollStore()

const pollId = computed(() => route.params.id as string)
const poll = computed(() => pollStore.getPollById(pollId.value))

const totalVotes = computed(() => {
  if (!poll.value) return 0
  return poll.value.options.reduce((sum, option) => sum + option.votes, 0)
})

function deletePoll() {
  if (!poll.value) return
  
  if (confirm('Are you sure you want to delete this poll?')) {
    pollStore.deletePoll(pollId.value)
    router.push('/polls')
  }
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