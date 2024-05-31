<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'

const { isOpen } = useSidebar()
const isExpanded = ref(false)
const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
)
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
)

const activeIconClass = ref('text-gray-100')
const inactiveIconClass = ref('text-gray-500 hover:text-gray-100')

const whatsappSupport = ref('https://wa.me/33756798439')

// État pour contrôler l'affichage du texte au survol
const showText = ref(false)

// Gérer l'affichage au survol
function handleMouseEnter() {
  isExpanded.value = true
}
function handleMouseLeave() {
  isExpanded.value = false
}

function toggleSidebar() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-50 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <router-link
            class="flex items-center"
            :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
            to="/dashboard"
          >
            <img src="../assets/favicon.png" alt="alternate text">
            <span v-if="isExpanded" class="mx-2 text-2xl font-semibold text-white">PreCRM</span>
          </router-link>
        </div>
      </div>

      <nav class="mt-10">
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Profile' ? activeClass : inactiveClass]"
          to="/profile"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
            />
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clip-rule="evenodd"
            />
          </svg>

          <span v-if="isExpanded" class="mx-4">Profile</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Contact' ? activeClass : inactiveClass]"
          to="/contact"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>

          <span v-if="isExpanded" class="mx-4">Contact</span>
        </router-link>
      </nav>

      <!-- WhatsApp Support Button -->
      <a
        :href="whatsappSupport"
        class="p-2 m-4 bg-green-500 text-white fixed bottom-20 left-0 mb-4 ml-4 rounded-full shadow-lg hover:bg-green-600"
        aria-label="WhatsApp Support"
        target="_blank"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.107 1.514 5.855L0 24l6.32-1.548A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.807 17.224c-.274.771-1.352 1.442-2.116 1.535-.566.07-1.268.1-2.03-.314-.947-.482-1.577-1.238-2.155-1.406-.559-.165-1.274-.08-1.792.124-2.83 1.072-5.313-2.286-5.813-4.633-.073-.336-.09-.872.077-1.337.183-.497.645-1.086 1.18-1.337.353-.164.812-.232 1.277-.032.436.186.94.742 1.07 1.176.133.443-.112.803-.271 1.007-.245.315-.642.818-.439 1.18.383.684 1.531 2.439 3.586 2.793.236.05.572-.194.897-.556.251-.288.718-.727 1.118-.584.413.147.942.545 1.168.773.334.343.56.748.62 1.122.092.562.018 1.03-.07 1.214z" />
        </svg>
      </a>

      <button
        class="p-2 m-4 bg-blue-900 text-white fixed bottom-0 left-0 mb-4 ml-4 rounded-full shadow-lg hover:bg-blue-600"
        aria-label="Toggle Sidebar"
        @click="toggleSidebar"
      >
        <svg v-if="!isExpanded" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>

        <svg v-if="isExpanded" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
