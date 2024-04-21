<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import ApiService from '../api/ApiService'
import endpoints from '../api/endpoints'
import type { Contact } from '../types/apiTypes'

const allContacts = ref<Contact[]>([])
const displayedContacts = ref<Contact[]>([])
const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const totalEntries = ref(0)
const searchQuery = ref('')

onMounted(async () => {
  loading.value = true
  try {
    const response = await ApiService.get<Contact[]>(endpoints.contacts, { user: '01ff5b2e-65d4-4199-a1cf-fedb3090a9f5' })
    allContacts.value = response
    totalEntries.value = response.length
    updateDisplayedContacts()
  }
  catch (error) {
    console.error('Failed to fetch contacts:', error)
  }
  loading.value = false
})

watch([pageSize, searchQuery, currentPage], () => {
  updateDisplayedContacts()
})

function updateDisplayedContacts() {
  const filteredContacts = allContacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
  console.log(filteredContacts)
  totalEntries.value = filteredContacts.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  displayedContacts.value = filteredContacts.slice(start, end)
}

function nextPage() {
  if (currentPage.value * pageSize.value < totalEntries.value) {
    currentPage.value++
    updateDisplayedContacts()
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    updateDisplayedContacts()
  }
}

async function activateUser(id: number) {
  try {
    const response = await axios.post('/api/user/activate', { id })
    console.log('Utilisateur activé', response.data)
    // Mettre à jour les données de l'utilisateur ou rafraîchir les données ici
  }
  catch (error) {
    console.error('Erreur lors de lactivation', error)
  }
}

async function deactivateUser(id: number) {
  try {
    const response = await axios.post('/api/user/deactivate', { id })
    console.log('Utilisateur désactivé', response.data)
    // Mettre à jour les données de l'utilisateur ou rafraîchir les données ici
  }
  catch (error) {
    console.error('Erreur lors de la désactivation', error)
  }
}
</script>

<template>
  <div v-if="!loading">
    <div class="mt-8">
      <div class="mt-6">
        <div class="flex flex-col mt-3 sm:flex-row sm:justify-between">
          <div class="flex">
            <div class="relative">
              <select
                v-model="pageSize"
                class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="5">
                  5
                </option>
                <option value="10">
                  10
                </option>
                <option value="20">
                  20
                </option>
              </select>

              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>

            <div class="relative">
              <select
                class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border-t border-b border-r border-gray-400 rounded-r appearance-none sm:rounded-r-none sm:border-r-0 focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              >
                <option>All</option>
              </select>

              <div
                class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
              >
                <svg
                  class="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="relative block mt-2 sm:mt-0">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                viewBox="0 0 24 24"
                class="w-4 h-4 text-gray-500 fill-current"
              >
                <path
                  d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
                />
              </svg>
            </span>

            <input
              v-model="searchQuery"
              placeholder="Search"
              class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            >
          </div>

          <div class="mt-2 sm:mt-0">
            <button
              class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              New contact
            </button>
          </div>
        </div>

        <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div
            class="inline-block min-w-full overflow-hidden rounded-lg shadow"
          >
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    User
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Company
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Role
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(u, index) in displayedContacts" :key="index">
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        <img
                          class="w-full h-full rounded-full"
                          alt="profile pic"
                        >
                      </div>

                      <div class="ml-3">
                        <p class="text-gray-900 whitespace-nowrap">
                          {{ u.name }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                    <p class="text-gray-900 whitespace-nowrap">
                      {{ u.company }}
                    </p>
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                    <p class="text-gray-900 whitespace-nowrap">
                      {{ u.title.length > 30 ? `${u.title.substring(0, 30)}...` : u.title }}
                    </p>
                  </td>
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200 relative">
                    <div class="flex items-center justify-between">
                      <span :class="`relative inline-block px-3 py-1 font-semibold text-${u.title}-900 leading-tight`">
                        <a :href="`tel:${u.phone}`">
                          {{ u.phone }}
                        </a>

                      </span>
                      <div class="flex items-center space-x-2">
                        <div class="relative flex flex-col items-center group">
                          <button
                            class="px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring"
                            @click="activateUser(u.id)"
                          >
                            Kaspr
                          </button>
                          <div class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">Activer</span>
                            <div class="w-3 h-3 -mt-2 rotate-45 bg-black" />
                          </div>
                        </div>

                        <div class="relative flex flex-col items-center group">
                          <button
                            class="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring ml-2"
                            @click="deactivateUser(u.id)"
                          >
                            DropContact
                          </button>
                          <div class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">Désactiver</span>
                            <div class="w-3 h-3 -mt-2 rotate-45 bg-black" />
                          </div>
                        </div>

                        <div class="relative flex flex-col items-center group">
                          <button
                            class="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring ml-2"
                          >
                            Hubspot
                          </button>
                          <div class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                            <span class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">Quelque chose</span>
                            <div class="w-3 h-3 -mt-2 rotate-45 bg-black" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
            >
              <span class="text-xs text-gray-900 xs:text-sm">Page {{ currentPage }} of {{ Math.ceil(totalEntries / pageSize) }}</span>
              <div class="inline-flex mt-2 xs:mt-0">
                <button :disabled="currentPage === 1" class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400" @click="prevPage">
                  Prev
                </button>
                <button :disabled="currentPage * pageSize >= totalEntries" class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400" @click="nextPage">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    <p class="mt-3 text-lg text-gray-600">
      Chargement...
    </p> <!-- Texte de chargement -->
  </div>
</template>
