<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

export default {
  name: 'OAuthRedirect',
  async created() {
    const { getAccessTokenSilently } = useAuth0()
    const token = await getAccessTokenSilently()

    if (token) {
      localStorage.setItem('bearer-token', token)
      this.$router.push('/dashboard')
    }
    else {
      this.$router.push('/login')
    }
  },
}
</script>

<template>
  <div>
    <slot />
  </div>
</template>
