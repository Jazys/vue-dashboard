<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ApiService from '../api/ApiService'
import endpoints from '../api/endpoints'
import type { Contact } from '../types/apiTypes'

const userId = ref(localStorage.getItem('user-id') || '')
const nbContacts = ref(0)

onMounted(async () => {
  try {
    const response = await ApiService.get<Contact[]>(endpoints.contacts, { user: userId.value })

    if (response != null)
      nbContacts.value = response.length
  }
  catch (error) {
    console.error('Failed to fetch contacts:', error)
  }
})
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">
      Dashboard
    </h3>

    <div class="mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Section Contacts -->
        <div class="bg-white rounded-md shadow-sm">
          <div class="flex items-center px-5 py-6">
            <div class="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z" fill="currentColor" />
                <path d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z" fill="currentColor" />
                <path d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z" fill="currentColor" />
                <path d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z" fill="currentColor" />
                <path d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z" fill="currentColor" />
                <path d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z" fill="currentColor" />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                {{ nbContacts }}
              </h4>
              <div class="text-gray-500">
                Contacts
              </div>
            </div>
          </div>
        </div>

        <!-- Section Total Quota -->
        <div class="bg-white rounded-md shadow-sm">
          <div class="flex items-center px-5 py-6">
            <div class="p-3 bg-blue-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z" fill="currentColor" />
                <path d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z" fill="currentColor" />
                <path d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z" fill="currentColor" />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                100 Crédits
              </h4>
              <div class="text-gray-500">
                Total Quota
              </div>
            </div>
          </div>
        </div>

        <!-- Section Use Case 1 -->
        <div class="bg-white rounded-md shadow-sm">
          <div class="flex items-center px-5 py-6">
            <div class="p-3 bg-green-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0ZM12.474 21.5H9.5V12.852H12.474V21.5ZM10.987 11.351C9.887 11.351 9 10.447 9 9.362C9 8.276 9.887 7.372 10.987 7.372C12.087 7.372 12.974 8.276 12.974 9.362C12.974 10.447 12.087 11.351 10.987 11.351ZM23.5 21.5H20.526V17.479C20.526 16.31 20.5 14.892 18.826 14.892C17.126 14.892 16.872 16.052 16.872 17.402V21.5H13.9V12.852H16.744V14.048H16.788C17.226 13.223 18.263 12.348 19.796 12.348C23.148 12.348 23.5 14.521 23.5 16.879V21.5Z" fill="currentColor" />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                Use Case 1 (Video Tutorial)
              </h4>
              <div class="text-gray-500">
                How to import my contact from a LinkedIn Sales Navigator search
              </div>
            </div>
          </div>
          <!-- Loom Video 1 -->
          <div class="mt-4">
            <iframe src="https://www.loom.com/embed/9faee6b2ab7842758d838174c2233703" width="100%" height="400" frameborder="0" allowfullscreen />
          </div>
        </div>

        <!-- Section Use Case 2 -->
        <div class="bg-white rounded-md shadow-sm">
          <div class="flex items-center px-5 py-6">
            <div class="p-3 bg-purple-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0ZM12.474 21.5H9.5V12.852H12.474V21.5ZM10.987 11.351C9.887 11.351 9 10.447 9 9.362C9 8.276 9.887 7.372 10.987 7.372C12.087 7.372 12.974 8.276 12.974 9.362C12.974 10.447 12.087 11.351 10.987 11.351ZM23.5 21.5H20.526V17.479C20.526 16.31 20.5 14.892 18.826 14.892C17.126 14.892 16.872 16.052 16.872 17.402V21.5H13.9V12.852H16.744V14.048H16.788C17.226 13.223 18.263 12.348 19.796 12.348C23.148 12.348 23.5 14.521 23.5 16.879V21.5Z" fill="currentColor" />
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">
                Use Case 2 (Video Tutorial)
              </h4>
              <div class="text-gray-500">
                How to extract people that commented whatever LinkedIn post
              </div>
            </div>
          </div>
          <!-- Loom Video 2 -->
          <div class="mt-4">
            <iframe src="https://www.loom.com/embed/d9db9d38982a4c53bf5f620f586ed15c?sid=711d891f-7abe-41a3-b25a-f191a575c0f5" width="100%" height="400" frameborder="0" allowfullscreen />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add your custom styles here */
</style>
