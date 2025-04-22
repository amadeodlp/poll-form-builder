<template>
  <div class="space-y-6">
    <div class="flex items-center mb-6">
      <NuxtLink to="/polls" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-2">
        <ArrowLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create a New Poll</h1>
    </div>
    
    <PollsPollCreator @created="handlePollCreated" />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

function handlePollCreated(pollId: string) {
  // Navigate to the poll
  router.push(`/polls/${pollId}`)
}
</script>