<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import kobbleClient from '../lib/kobbleClient'

export default {
  name: 'OAuthRedirect',
  async created() {
    let token
    let user_id

    try {
      await kobbleClient.handleRedirectCallback()
      user_id = await kobbleClient.getUser()
      token = await kobbleClient.getAccessToken()
    }
    catch (error) {
      console.error('Une erreur s\'est produite lors de l\'authentification avec Kobble:', error)
    }

    if (import.meta.env.VITE_ENABLE_AUTH0 === 'true') {
      const { getAccessTokenSilently } = useAuth0()
      token = await getAccessTokenSilently()
    }

    if (token && user_id) {
      localStorage.setItem('bearer-token', token)
      localStorage.setItem('user-id', user_id.id)
      if (user_id.email)
        localStorage.setItem('user-email', user_id.email)
      this.$router.push('/dashboard')
    }
    else {
      this.$router.push('/')
    }
  },
}
</script>

<template>
  <div>
    <slot />
  </div>
</template>
