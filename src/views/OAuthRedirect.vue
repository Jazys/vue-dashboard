<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import kobbleClient from '../lib/kobbleClient'

export default {
  name: 'OAuthRedirect',
  async created() {
    let token

    if (import.meta.env.VITE_ENABLE_AUTH_KOBBLE === 'true') {
      await kobbleClient.handleRedirectCallback()
      await kobbleClient.getUser()
      token = await kobbleClient.getAccessToken()
      console.log(token)
      console.log(await kobbleClient.getIdToken())
    }

    if (import.meta.env.VITE_ENABLE_AUTH0 === 'true') {
      const { getAccessTokenSilently } = useAuth0()
      token = await getAccessTokenSilently()
    }

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
