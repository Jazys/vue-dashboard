<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import Papa from 'papaparse'
import ApiService from '../api/ApiService'
import type { Contact } from '../types/apiTypes'
import endpoints from '../api/endpoints'

const props = defineProps<{
  userId: string
}>()

const emits = defineEmits<{
  (event: 'close-modal', value: boolean): void
  (event: 'data-imported', data: any[]): void
}>()

const data = ref<Contact[]>([])
const isLoading = ref(false)
let file: File | undefined

function closeModal() {
  emits('close-modal', false)
}

function handleFileUpload(event: Event) {
  file = (event.target as HTMLInputElement).files?.[0]
}

async function parseCSV(file: File) {
  if (!file)
    return

  const results = await new Promise<any>((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: (parsedData) => {
        resolve(parsedData.data)
      },
    })
  })

  data.value = results

  // TODO - if request fail display information
  for (let i = 0; i < data.value.length; i++) {
    try {
      await ApiService.post<Contact>(endpoints.createContact, { idUser: props.userId, firstname: data.value[0].title, name: data.value[0].title })
    }
    catch {

    }
  }

  emits('data-imported', data.value)
}

async function importContact() {
  isLoading.value = true
  if (file)
    await parseCSV(file)
  isLoading.value = false
}
</script>

<template>
  <div>
    <div class="fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-gray-800 bg-opacity-50">
      <div class="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
        <div class="flex justify-between items-center pb-3">
          <h2 class="text-2xl font-bold">
            Import Contact List from Linkedin
          </h2>
          <button class="p-2 bg-blue-500 rounded-full inline-flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="fill-current">
              <path d="M12.707 11.293l-1.414 1.414L9 10.414l-2.293 2.293-1.414-1.414L7.586 9 5.293 6.707l1.414-1.414L9 7.586l2.293-2.293 1.414 1.414L10.414 9l2.293 2.293z" />
            </svg>
          </button>
        </div>
        <div class="flex items-center space-x-4">
          <input type="file" class="flex-grow" @change="handleFileUpload">
          <button class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700" @click="importContact">
            <div v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </div>
            <div v-else>
              Importer
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
