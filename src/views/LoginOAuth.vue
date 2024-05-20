<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted } from 'vue'
import kobbleClient from '../lib/kobbleClient'
import router from '../router'

onMounted(async () => {
  const User = await kobbleClient.getUser()
  if (User != null && User.id)
    router.push('/contact')
})

async function login() {
  if (import.meta.env.VITE_ENABLE_AUTH_KOBBLE === 'true')
    kobbleClient.loginWithRedirect()

  if (import.meta.env.VITE_ENABLE_KOBBLE === 'true') {
    const { loginWithRedirect } = useAuth0()
    await loginWithRedirect()
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/favicon.png" alt="alternate text">
        <span class="text-2xl font-semibold text-gray-700">PreCRM</span>
      </div>

      <form class="mt-4" @submit.prevent="login">
        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
