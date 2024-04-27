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
const userId = ref(localStorage.getItem('user-id') || '')
const showModal = ref(false)
const currentContact = ref<Contact>()
const isLoadingSave = ref(false)
const isLoadingDelete = ref(false)
const isLoadingEnrich = ref(false)
const isLoadingSync = ref(false)
const messageSaveDisplay = ref ('Save')
const messageDeleteDisplay = ref ('Delete')
const displaySuccess = ref(false)
const displayError = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await getListAll()
  }
  catch (error) {
    console.error('Failed to fetch contacts:', error)
  }
  loading.value = false
})

watch([pageSize, searchQuery, currentPage], () => {
  updateDisplayedContacts()
})

function toggleModal(index: number) {
  currentContact.value = displayedContacts.value[index]
  showModal.value = !showModal.value
}

async function getListAll() {
  const response = await ApiService.get<Contact[]>(endpoints.contacts, { user: userId.value })
  allContacts.value = response
  totalEntries.value = response.length
  updateDisplayedContacts()
}

function updateDisplayedContacts() {
  const filteredContacts = allContacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
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

async function updateUser() {
  try {
    isLoadingSave.value = true
    await axios.post('/api/user/activate', { currentContact })
    messageSaveDisplay.value = 'Succes !'
  }
  catch (error) {
    console.error('Erreur lors de lactivation', error)
    messageSaveDisplay.value = 'Error !'
  }
  finally {
    isLoadingSave.value = false
    setTimeout(() => {
      messageSaveDisplay.value = 'Save'
    }, 2000)
  }
}

async function deleteUser() {
  try {
    isLoadingDelete.value = true
    await axios.post('/api/user/activate', { currentContact })
    messageDeleteDisplay.value = 'Succes !'
  }
  catch (error) {
    console.error('Erreur lors de lactivation', error)
    messageDeleteDisplay.value = 'Error !'
  }
  finally {
    isLoadingDelete.value = false
    setTimeout(() => {
      messageDeleteDisplay.value = 'Delete'
    }, 2000)
  }
}

async function enrichUser(id: number) {
  try {
    isLoadingEnrich.value = true
    const response = await axios.post('/api/user/activate', { id })
    displaySuccess.value = true
    // Mettre à jour les données de l'utilisateur ou rafraîchir les données ici
  }
  catch (error) {
    console.error('Erreur lors de lactivation', error)
    displayError.value = true
  }
  finally {
    isLoadingEnrich.value = false
    setTimeout(() => {
      displaySuccess.value = false
      displayError.value = false
    }, 2000)
  }
}

async function syncUser(id: number) {
  try {
    isLoadingSync.value = true
    const response = await axios.post('/api/user/activate', { id })
    displaySuccess.value = true
  }
  catch (error) {
    console.error('Erreur lors de lactivation', error)
    displayError.value = true
  }
  finally {
    isLoadingSync.value = false
    setTimeout(() => {
      displaySuccess.value = false
      displayError.value = false
    }, 2000)
  }
}
</script>

<template>
  <div v-if="!loading">
    <div class="relative mt-4">
      <div v-if="displaySuccess" class="fixed top-0 right-0 mt-4 mr-4 z-50 px-4 py-2 bg-red-100 border border-green-400 rounded shadow-lg transition-opacity duration-300 ease-in-out" :class="{ 'opacity-0': !displaySuccess, 'opacity-100': displaySuccess }">
        <div class="mx-3">
          <span class="font-semibold text-green-500">Success</span>
          <p class="text-sm text-gray-600">
            Success
          </p>
        </div>
      </div>

      <div v-if="displayError" class="fixed top-0 right-0 mt-4 mr-4 z-50 px-4 py-2 bg-red-100 border border-red-400 rounded shadow-lg transition-opacity duration-300 ease-in-out" :class="{ 'opacity-0': !displayError, 'opacity-100': displayError }">
        <div class="mx-3">
          <span class="font-semibold text-red-500">Error</span>
          <p class="text-sm text-gray-600">
            Error
          </p>
        </div>
      </div>

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

            <div class="mt-2 sm:mt-0 space-x-4">
              <button
                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                New contact
              </button>
              <button
                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Import List
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
                      Email
                    </th>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      Phone
                    </th>
                    <th
                      class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                    >
                      Action
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
                          <p class="text-gray-900 whitespace-nowrap font-bold">
                            {{ u.name }}
                          </p>
                          <p class="text-gray-900 whitespace-nowrap">
                            {{ u.title }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                      <p class="text-gray-900 whitespace-nowrap font-bold">
                        {{ u.company }}
                      </p>
                      <p class="text-gray-900 whitespace-nowrap">
                        {{ u.industry }}
                      </p>
                    </td>
                    <td
                      class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                    >
                      <p class="text-gray-900 whitespace-nowrap">
                        {{ u.email.length > 30 ? `${u.email.substring(0, 30)}...` : u.email }}
                      </p>
                    </td>
                    <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                      <div class="flex items-center justify-between">
                        <span :class="`relative inline-block px-3 py-1 font-semibold text-${u.title}-900 leading-tight`">
                          <a :href="`tel:${u.phone}`">
                            {{ u.phone }}
                          </a>
                        </span>
                      </div>
                    </td>
                    <td class="px-5 py-5 text-sm bg-white border-b border-gray-200 relative">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                          <div class="relative flex flex-col items-center group">
                            <button class="px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring ml-2" :disabled="isLoadingEnrich" @click="enrichUser(u.id)">
                              <div v-if="isLoadingEnrich" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Loading...
                              </div>
                              <div v-else>
                                Enrich
                              </div>
                            </button>

                            <div class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                              <span class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">Find mail/phone</span>
                              <div class="w-3 h-3 -mt-2 rotate-45 bg-black" />
                            </div>
                          </div>

                          <div class="relative flex flex-col items-center group">
                            <button class="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring ml-2" :disabled="isLoadingSync" @click="syncUser(u.id)">
                              <div v-if="isLoadingSync" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Loading...
                              </div>
                              <div v-else>
                                Sync
                              </div>
                            </button>

                            <div class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                              <span class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">Update hubspot user</span>
                              <div class="w-3 h-3 -mt-2 rotate-45 bg-black" />
                            </div>
                          </div>

                          <div class="relative flex flex-col items-center group">
                            <button
                              class="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring ml-2"
                              @click="toggleModal(index)"
                            >
                              Edit
                            </button>
                            <div class="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                              <span class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">Edit current user</span>
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

    <!-- Overlay -->
    <div v-if="showModal" class="fixed inset-0 z-40 bg-gray-600 bg-opacity-50" />

    <!-- Modal à droite prenant toute la hauteur -->
    <div v-if="showModal" class="fixed top-0 right-0 bottom-0 z-50 overflow-auto">
      <div class="relative bg-white p-8 w-full sm:w-auto h-full flex flex-col rounded-l-lg shadow-lg">
        <!-- En-tête de la modal -->
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold">
            Edit User
          </p>
          <button class="p-2 bg-blue-500 rounded-full inline-flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="toggleModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="fill-current">
              <path d="M12.707 11.293l-1.414 1.414L9 10.414l-2.293 2.293-1.414-1.414L7.586 9 5.293 6.707l1.414-1.414L9 7.586l2.293-2.293 1.414 1.414L10.414 9l2.293 2.293z" />
            </svg>
          </button>
        </div>

        <div>
          <label class="text-gray-700" for="username">Name</label>
          <input
            v-model="currentContact.name"
            readonly
            class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text"
          >
        </div>

        <div>
          <label class="text-gray-700" for="username">Title</label>
          <input
            v-model="currentContact.title"
            readonly
            class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text"
          >
        </div>

        <div>
          <label class="text-gray-700" for="username">Company</label>
          <input
            v-model="currentContact.company"
            readonly
            class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text"
          >
        </div>

        <div>
          <label class="text-gray-700" for="username">Industry</label>
          <input
            v-model="currentContact.industry"
            readonly
            class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text"
          >
        </div>

        <div>
          <label class="text-gray-700" for="username">Email</label>
          <input
            v-model="currentContact.email"
            readonly
            class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text"
          >
        </div>

        <div>
          <label class="text-gray-700" for="username">Phone</label>
          <input
            v-model="currentContact.phone"
            readonly
            class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            type="text"
          >
        </div>

        <div class="mt-auto pt-4 space-y-4">
          <button class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 w-full focus:outline-none focus:ring" :disabled="isLoadingSave" @click="updateUser">
            <div v-if="isLoadingSave" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ messageSaveDisplay }}
            </div>
            <div v-else>
              {{ messageSaveDisplay }}
            </div>
          </button>

          <button class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 w-full focus:outline-none focus:ring" :disabled="isLoadingDelete" @click="deleteUser">
            <div v-if="isLoadingDelete" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ messageDeleteDisplay }}
            </div>
            <div v-else>
              {{ messageDeleteDisplay }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    <p class="mt-3 text-lg text-gray-600">
      Loading...
    </p> <!-- Texte de chargement -->
  </div>
</template>
