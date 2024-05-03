<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import Papa from 'papaparse'

const emits = defineEmits<{
  (event: 'close-modal', value: boolean): void
  (event: 'data-imported', data: any[]): void
}>()

const data = ref([])

function closeModal() {
  emits('close-modal', false)
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file)
    parseCSV(file)
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

  // Stocke les données dans la variable 'data'
  data.value = results
  emits('data-imported', data.value)
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
          <button class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
            Importer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
