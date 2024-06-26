<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ApiService from '../api/ApiService'
import endpoints from '../api/endpoints'
import type { User } from '../types/apiTypes'
import Modal from './ModalTooltip.vue'

const inputValues = ref([
  { label: 'Enrich', value: '', tooltip: 'You can eather use Kaspr or FullEnrich API (but not both) to enrich your data', loom: 'https://www.loom.com/embed/d891dbfa7a5e4849bc64a31ef6e88215?sid=a3d18411-2189-40da-b943-ec65bd13ae7f' },
  { label: 'Phantombuster', value: '', tooltip: 'We explain how to get your phantombuster API key here', loom: 'https://www.loom.com/embed/8f13ff3ae7f041e0bb73dedb621d7ccd?sid=e1c38b23-c7a0-4bbe-b23b-c1e83a8fce7a' },
  { label: 'Hubspot', value: '', tooltip: 'PRECRM needs to have the following scopes: crm.objects.contacts.read and crm.objects.contacts.write.', loom: 'https://www.loom.com/embed/b1bc2044199e41d7bb74b3d2dc77f4b0?sid=8387baf4-efda-48fa-811b-7e39dde9f90d' },
])

const displaySuccess = ref(false)
const displayError = ref(false)
const showCopyToast = ref(false)
const toastCoordinates = ref({ x: 0, y: 0 })
const isLoading = ref(false)
const isLoadingPAccountAPI = ref(true)
const tooltipURLApi = ref(false)

const userId = ref(localStorage.getItem('user-id') || '')
const userMail = ref(localStorage.getItem('user-email') || '')
const showTooltip = ref(Array(inputValues.value.length).fill(false))

const tooltipWebhook = ref('Webhook to specify for Phantombuster to deal with PRECRM')

const isModalVisible = ref(false)
const modalTitle = ref('')
const modalDescription = ref('')
const modalVideoUrl = ref('')

function openTooltipModal(title: string, description: string, videoUrl: string) {
  modalTitle.value = title
  modalDescription.value = description
  modalVideoUrl.value = videoUrl
  isModalVisible.value = true
}

onMounted(async () => {
  const response = await ApiService.get<User[]>(endpoints.getUser, { user: userId.value })
  if (response != null && response.length === 1) {
    inputValues.value[0].value = response[0].enrich
    inputValues.value[1].value = response[0].phantombuster
    inputValues.value[2].value = response[0].hubspot
  }
  isLoadingPAccountAPI.value = false
})

async function copyToClipboard(url: string, event: any) {
  try {
    event.preventDefault()
    await navigator.clipboard.writeText(url)
    const rect = event.target.getBoundingClientRect()
    toastCoordinates.value = {
      x: rect.right + 10,
      y: rect.top - 5,
    }
    showCopyToast.value = true
  }
  catch (err) {
    showCopyToast.value = true
    console.error('Erreur lors de la copie:', err)
  }
  finally {
    setTimeout(() => {
      showCopyToast.value = false
    }, 2000)
  }
}

async function manageAccount() {
  let url = ''
  if (import.meta.env.VITE_ENABLE_AUTH_KOBBLE === 'true')
    url = import.meta.env.VITE_DOMAIN

  window.open(url, '_blank')
}

async function saveData() {
  isLoading.value = true
  const requestBody = {
    id: userId.value,
    enrich: inputValues.value[0].value,
    phantombuster: inputValues.value[1].value,
    hubspot: inputValues.value[2].value,
  }
  try {
    const response = await ApiService.patch(endpoints.modifyUser, requestBody)
    displaySuccess.value = true
    if (response != null)
      displaySuccess.value = true
  }
  catch (err) {
    displayError.value = true
  }
  finally {
    isLoading.value = false
    setTimeout(() => {
      displayError.value = false
      displaySuccess.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="relative mt-4">
    <div v-if="displaySuccess" class="fixed top-0 right-0 mt-4 mr-4 z-50 px-4 py-2 bg-green-100 border border-green-400 rounded shadow-lg transition-opacity duration-300 ease-in-out" :class="{ 'opacity-0': !displaySuccess, 'opacity-100': displaySuccess }">
      <div class="mx-3">
        <span class="font-semibold text-green-500">Success</span>
        <p class="text-sm text-gray-600">
          User has been updated
        </p>
      </div>
    </div>

    <div v-if="displayError" class="fixed top-0 right-0 mt-4 mr-4 z-50 px-4 py-2 bg-green-100 border border-green-400 rounded shadow-lg transition-opacity duration-300 ease-in-out" :class="{ 'opacity-0': !displayError, 'opacity-100': displayError }">
      <div class="mx-3">
        <span class="font-semibold text-green-500">Error</span>
        <p class="text-sm text-gray-600">
          Error during update !
        </p>
      </div>
    </div>

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize">
          Account informations
        </h2>

        <form>
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label class="text-gray-700" for="username">User Identification</label>
              <input
                v-model="userId"
                readonly
                class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="text"
              >
            </div>

            <div>
              <label class="text-gray-700" for="emailAddress">Email Address</label>
              <input
                v-model="userMail"
                readonly
                class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="email"
              >
            </div>

            <div>
              <label class="text-gray-700" for="emailAddress">Webhook</label>
              <div class="relative flex items-center space-x-2">
                <!-- Conteneur du bouton et du toast -->
                <input :value="`https://mg5kwnb748.execute-api.eu-west-1.amazonaws.com/PROD/webhook-n8n/direct-phantom?id=${userId}`" type="text" class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
                <button class="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded" @click="copyToClipboard(`https://mg5kwnb748.execute-api.eu-west-1.amazonaws.com/PROD/webhook-n8n/direct-phantom?id=${userId}`, $event)">
                  <!-- Icône de copie ici -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-2m-4 0V7m4 0v6a2 2 0 002 2h2" />
                  </svg>
                </button>
                <!-- Toast -->
                <div v-if="showCopyToast" class="absolute top-0 left-full ml-2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 ease-in-out" :class="{ 'opacity-0': !showCopyToast, 'opacity-100': showCopyToast }">
                  Copy in Clipboard
                </div>
                <span
                  class="ml-1 cursor-pointer flex items-center justify-center rounded-full bg-blue-500 text-white w-5 h-5 hover:bg-blue-600"
                  @click="openTooltipModal('Webhook URL Explanation', tooltipWebhook, 'https://www.loom.com/embed/8f13ff3ae7f041e0bb73dedb621d7ccd?sid=e1c38b23-c7a0-4bbe-b23b-c1e83a8fce7a')"
                  @mouseover="openTooltipModal('Webhook URL Explanation', tooltipWebhook, 'https://www.loom.com/embed/8f13ff3ae7f041e0bb73dedb621d7ccd?sid=e1c38b23-c7a0-4bbe-b23b-c1e83a8fce7a')"
                >
                  ?
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button
              class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              @click="manageAccount"
            >
              Manage Account
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize">
          Account API <b v-if="isLoadingPAccountAPI"> (Loading ..)</b>
        </h2>
        <div v-for="(item, index) in inputValues" :key="index" class="flex flex-col space-y-2 mb-4">
          <label :for="`copyInput${index}`" class="text-gray-700 flex items-center">
            {{ item.label }} :
            <!-- Icône d'interrogation -->
            <span
              class="ml-1 cursor-pointer flex items-center justify-center rounded-full bg-blue-500 text-white w-5 h-5 hover:bg-blue-600"
              @click="openTooltipModal(item.label, item.tooltip, item.loom)"
              @mouseover="openTooltipModal(item.label, item.tooltip, item.loom)"
            >
              ?
            </span>
          </label>
          <!-- Champ d'entrée -->
          <input :id="`copyInput${index}`" v-model="item.value" type="text" class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </div>

        <div class="flex justify-end">
          <button class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700" :disabled="isLoading" @click="saveData">
            <div v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </div>
            <div v-else>
              Save
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Component -->
    <Modal
      :is-visible="isModalVisible"
      :title="modalTitle"
      :description="modalDescription"
      :video-url="modalVideoUrl"
      @close="isModalVisible = false"
    />
  </div>
</template>
