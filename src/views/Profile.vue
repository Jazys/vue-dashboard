<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const inputValues = ref([
      { label: 'Clé 1', value: '' },
      { label: 'Clé 2', value: '' },
      { label: 'Clé 3', value: '' },
      { label: 'Clé 4', value: '' },
      { label: 'Clé 5', value: '' },
    ])

    const copyToClipboard = (index: number) => {
      navigator.clipboard.writeText(inputValues.value[index].value).then(() => {
        // Logique de succès
      }).catch((err) => {
        // Gestion des erreurs
      })
    }

    const saveData = () => {
      // Logique de sauvegarde
      // Par exemple, sauvegarder les données dans une base de données ou un fichier
      console.log(inputValues.value[0].value)
    }

    return { inputValues, copyToClipboard, saveData }
  },
})
</script>

<template>
  <div class="mt-4">
    <div class="p-6 bg-white rounded-md shadow-md">
      <h2 class="text-lg font-semibold text-gray-700 capitalize">
        Account informations
      </h2>

      <form>
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label class="text-gray-700" for="username">Username</label>
            <input
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              type="text"
            >
          </div>

          <div>
            <label class="text-gray-700" for="emailAddress">Email Address</label>
            <input
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              type="email"
            >
          </div>

          <div>
            <label class="text-gray-700" for="password">Mobile</label>
            <input
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              type="text"
            >
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button
            class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
  <div class="mt-4">
    <div class="p-6 bg-white rounded-md shadow-md">
      <h2 class="text-lg font-semibold text-gray-700 capitalize">
        Account API
      </h2>
      <div v-for="(item, index) in inputValues" :key="index" class="flex flex-col space-y-2 mb-4">
        <label :for="`copyInput${index}`" class="text-gray-700">{{ item.label }} :</label>
        <div class="flex items-center space-x-2">
          <input :id="`copyInput${index}`" v-model="item.value" type="text" class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
          <button class="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded" @click="copyToClipboard(index)">
            <!-- Icône de copie ici -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-2m-4 0V7m4 0v6a2 2 0 002 2h2" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex justify-end">
        <button class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700" @click="saveData">
          Save
        </button>
      </div>
    </div>
  </div>
</template>
