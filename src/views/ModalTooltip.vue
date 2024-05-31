<!-- Modal.vue -->
<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  title: String,
  description: String,
  videoUrl: String,
})

const emit = defineEmits(['close'])
const isLoading = ref(true)

function closeModal() {
  emit('close')
}

// Reset the loading state whenever the modal becomes visible
watch(() => props.isVisible, (newVal) => {
  if (newVal)
    isLoading.value = true
})

function onIframeLoad() {
  isLoading.value = false
}
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3">
      <div class="flex justify-between items-center border-b p-4">
        <h3 class="text-xl font-semibold">
          {{ title }}
        </h3>
        <button class="text-gray-600 hover:text-gray-900" @click="closeModal">
          &times;
        </button>
      </div>
      <div class="p-4">
        <p>{{ description }}</p>
        <div class="mt-4 relative">
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div class="loader">
              Loading...
            </div>
          </div>
          <iframe v-show="!isLoading" :src="videoUrl" width="100%" height="315" frameborder="0" allowfullscreen @load="onIframeLoad" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
