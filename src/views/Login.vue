<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../supabase'
import router from '../router'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const success = ref<string | null>(null)

onMounted(async () => {
  await checkSession()
})

async function checkSession() {
  const session = await supabase.auth.getSession()
  console.log(session)
  if (session) {
    router.push('/contact')
  }
  else {
    const refreshToken = localStorage.getItem('refresh_token')
    const accesToken = localStorage.getItem('bearer-token')
    if (refreshToken) {
      const { error } = await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accesToken!,
      })
      if (!error)
        router.push('/contact')
      else
        console.error('Error refreshing session:', error)
    }
  }
}

async function handleSignUp() {
  error.value = null
  success.value = null
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (signUpError) {
    error.value = signUpError.message
  }
  else {
    success.value = 'Votre compte a été créé avec succès. Redirection en cours...'
    setTimeout(() => {
      localStorage.setItem('bearer-token', data.session!.access_token)
      localStorage.setItem('refresh-token', data.session!.refresh_token)
      localStorage.setItem('user-id', data.user!.id)
      localStorage.setItem('user-email', data.user!.email!)
      router.push('/contact')
    }, 3000)
  }
}

async function handleSignIn() {
  error.value = null
  const { data, error: signUpError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (signUpError) {
    error.value = signUpError.message
  }
  else {
    localStorage.setItem('bearer-token', data.session!.access_token)
    localStorage.setItem('user-id', data.user!.id)
    localStorage.setItem('user-email', data.user!.email!)
    router.push('/contact')
  }
}

async function resetPassword() {
  success.value = null
  error.value = null
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value)

  if (resetError)
    error.value = resetError.message
  else
    success.value = 'A reset link has been sent to your email address.'
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/favicon.png" alt="alternate text">
        <span class="text-2xl font-semibold text-gray-700">PreCRM</span>
      </div>

      <form class="mt-4">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input
            v-model="email"
            type="email"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            v-model="password"
            type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox" class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-indigo-700 fontme hover:underline"
              href="#"
              @click="resetPassword"
            >Forgot your password?</a>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            type="button"
            class="w-1/2 mr-2 px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
            @click="handleSignIn"
          >
            Sign in
          </button>
          <button
            type="button"
            class="w-1/2 ml-2 px-4 py-2 text-sm text-center text-white bg-green-600 rounded-md focus:outline-none hover:bg-green-500"
            @click="handleSignUp"
          >
            Sign up
          </button>
        </div>

        <p v-if="error" class="mt-4 text-red-500">
          {{ error }}
        </p>
        <p v-if="success" class="mt-4 text-green-500">
          {{ success }}
        </p>
      </form>
    </div>
  </div>
</template>
