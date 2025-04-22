<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Polls</h1>
      <NuxtLink to="/polls/create">
        <UiButton variant="primary">
          <PlusIcon class="h-5 w-5 mr-1" />
          Create Poll
        </UiButton>
      </NuxtLink>
    </div>
    
    <div v-if="polls.length === 0" class="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
      <ChartPieIcon class="h-16 w-16 mx-auto text-gray-400" />
      <h2 class="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">No polls yet</h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Create your first poll to get started</p>
      <NuxtLink to="/polls/create">
        <UiButton variant="primary" class="mt-6">
          Create Poll
        </UiButton>
      </NuxtLink>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="poll in polls" :key="poll.id">
        <PollsPollCard
          :poll="poll"
          :show-vote-form="true"
          :show-results="false"
          :show-delete="true"
          @vote="handleVote(poll.id, $event)"
          @delete="deletePoll(poll.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChartPieIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { usePollStore } from '~/stores/poll'

const pollStore = usePollStore()

// Get polls sorted by creation date (newest first)
const polls = computed(() => {
  return [...pollStore.polls]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

function handleVote(pollId: string, optionId: string) {
  pollStore.voteOnPoll(pollId, optionId)
}

function deletePoll(pollId: string) {
  if (confirm('Are you sure you want to delete this poll?')) {
    pollStore.deletePoll(pollId)
  }
}
</script>