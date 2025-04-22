<template>
  <div v-if="poll" class="space-y-6">
    <div class="flex items-center mb-6">
      <NuxtLink to="/polls" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
        <ArrowLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Poll</h1>
    </div>
    
    <div class="max-w-2xl mx-auto">
      <PollsPollCard
        :poll="poll"
        :show-vote-form="true"
        :show-results="false"
        @vote="handleVote"
      />
      
      <div class="mt-6 flex justify-center">
        <NuxtLink :to="`/polls/${poll.id}/results`">
          <UiButton variant="outline">
            <ChartBarIcon class="h-5 w-5 mr-1" />
            View Results
          </UiButton>
        </NuxtLink>
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
import { ref, computed } from 'vue'
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { usePollStore } from '~/stores/poll'

const route = useRoute()
const router = useRouter()
const pollStore = usePollStore()

const pollId = computed(() => route.params.id as string)
const poll = computed(() => pollStore.getPollById(pollId.value))

function handleVote(optionId: string) {
  pollStore.voteOnPoll(pollId.value, optionId)
  
  // Redirect to results after voting
  router.push(`/polls/${pollId.value}/results`)
}
</script>