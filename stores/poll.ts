import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface PollOption {
  id: string
  text: string
  votes: number
}

// Make sure this interface is properly exported
export interface Poll {
  id: string
  question: string
  options: PollOption[]
  createdAt: Date
}

// Export a type-only Poll class to ensure compatibility
export const Poll = {} as { new(): Poll }

export const usePollStore = defineStore('poll', () => {
  const polls = ref<Poll[]>([])

  // Load polls from localStorage when the store is created (client-side only)
  if (process.client) {
    const savedPolls = localStorage.getItem('polls')
    if (savedPolls) {
      try {
        const parsedPolls = JSON.parse(savedPolls)
        // Convert string dates back to Date objects
        polls.value = parsedPolls.map((poll: any) => ({
          ...poll,
          createdAt: new Date(poll.createdAt)
        }))
      } catch (e) {
        console.error('Failed to parse polls from localStorage', e)
      }
    }
  }

  // Watch for changes and save to localStorage
  watch(polls, (newPolls) => {
    if (process.client) {
      localStorage.setItem('polls', JSON.stringify(newPolls))
    }
  }, { deep: true })

  // Getters
  const getPollById = (id: string) => {
    return polls.value.find((poll) => poll.id === id)
  }

  // Actions
  function createPoll(question: string, options: string[]) {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map((text) => ({
        id: Math.random().toString(36).substring(2, 9),
        text,
        votes: 0
      })),
      createdAt: new Date()
    }
    
    polls.value.push(newPoll)
    return newPoll.id
  }
  
  function voteOnPoll(pollId: string, optionId: string) {
    const poll = polls.value.find(p => p.id === pollId)
    if (!poll) return false
    
    const option = poll.options.find(o => o.id === optionId)
    if (!option) return false
    
    option.votes++
    return true
  }
  
  function deletePoll(pollId: string) {
    const index = polls.value.findIndex(p => p.id === pollId)
    if (index !== -1) {
      polls.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    polls,
    getPollById,
    createPoll,
    voteOnPoll,
    deletePoll
  }
})
