<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRequestStore } from '../store/request'
import kobbleClient from '../lib/kobbleClient'

const credits = ref(0)
const creditsLimit = ref(0)
const requestStore = useRequestStore()

watch(() => requestStore.loading, async (loading) => {
  if (loading) {
    const isAuth = await kobbleClient.isAuthenticated()
    if (isAuth) {
      const quotaLeft = await kobbleClient.acl.listQuotas()
      credits.value = quotaLeft[0].usage
      creditsLimit.value = quotaLeft[0].limit
    }
  }
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="bg-gray-200 rounded-lg p-1">
      <div class="flex items-center">
        <span class="text-3xl font-bold mr-2">{{ credits }} / {{ creditsLimit }}</span>
        <span class="text-gray-600">crédits</span>
      </div>
    </div>
  </div>
</template>
