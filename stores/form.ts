import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type QuestionType = 'short' | 'long' | 'number' | 'radio'

export interface FormQuestion {
  id: string
  text: string
  type: QuestionType
  required: boolean
  placeholder?: string
  options?: string[] // For radio questions
}

export interface Form {
  id: string
  title: string
  description?: string
  questions: FormQuestion[]
  createdAt: Date
}

// Export a type-only Form class to ensure compatibility
export const Form = {} as { new(): Form }

export interface FormResponse {
  id: string
  formId: string
  answers: {
    questionId: string
    answer: string | number
  }[]
  submittedAt: Date
}

// Export a type-only FormResponse class to ensure compatibility
export const FormResponse = {} as { new(): FormResponse }

export const useFormStore = defineStore('form', () => {
  const forms = ref<Form[]>([])
  const responses = ref<FormResponse[]>([])
  
  // Load from localStorage on client-side only
  if (process.client) {
    // Load forms
    const savedForms = localStorage.getItem('forms')
    if (savedForms) {
      try {
        const parsedForms = JSON.parse(savedForms)
        forms.value = parsedForms.map((form: any) => ({
          ...form,
          createdAt: new Date(form.createdAt)
        }))
      } catch (e) {
        console.error('Failed to parse forms from localStorage', e)
      }
    }
    
    // Load responses
    const savedResponses = localStorage.getItem('formResponses')
    if (savedResponses) {
      try {
        const parsedResponses = JSON.parse(savedResponses)
        responses.value = parsedResponses.map((response: any) => ({
          ...response,
          submittedAt: new Date(response.submittedAt)
        }))
      } catch (e) {
        console.error('Failed to parse form responses from localStorage', e)
      }
    }
  }
  
  // Watch for changes and save to localStorage
  watch(forms, (newForms) => {
    if (process.client) {
      localStorage.setItem('forms', JSON.stringify(newForms))
    }
  }, { deep: true })
  
  watch(responses, (newResponses) => {
    if (process.client) {
      localStorage.setItem('formResponses', JSON.stringify(newResponses))
    }
  }, { deep: true })
  
  // Getters
  const getFormById = (id: string) => {
    return forms.value.find((form) => form.id === id)
  }
  
  const getResponsesByFormId = (formId: string) => {
    return responses.value.filter((response) => response.formId === formId)
  }
  
  // Actions
  function createForm(title: string, description: string, questions: Omit<FormQuestion, 'id'>[]) {
    const newForm: Form = {
      id: Date.now().toString(),
      title,
      description,
      questions: questions.map((q) => ({
        ...q,
        id: Math.random().toString(36).substring(2, 9)
      })),
      createdAt: new Date()
    }
    
    forms.value.push(newForm)
    return newForm.id
  }
  
  function submitFormResponse(formId: string, answers: { questionId: string, answer: string | number }[]) {
    const newResponse: FormResponse = {
      id: Date.now().toString(),
      formId,
      answers,
      submittedAt: new Date()
    }
    
    responses.value.push(newResponse)
    return newResponse.id
  }
  
  function deleteForm(formId: string) {
    const index = forms.value.findIndex(f => f.id === formId)
    if (index !== -1) {
      forms.value.splice(index, 1)
      // Also delete associated responses
      responses.value = responses.value.filter(r => r.formId !== formId)
      return true
    }
    return false
  }
  
  return {
    forms,
    responses,
    getFormById,
    getResponsesByFormId,
    createForm,
    submitFormResponse,
    deleteForm
  }
})
