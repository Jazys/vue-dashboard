import { defineStore } from 'pinia'

export const useRequestStore = defineStore({
  id: 'request',
  state: () => ({
    loading: false,
  }),
  actions: {
    startLoading() {
      this.loading = true
    },
    stopLoading() {
      this.loading = false
    },
  },
})
