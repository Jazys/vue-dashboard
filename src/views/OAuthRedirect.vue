<script lang="ts">
import { createKobbleClient } from '@kobbleio/auth-spa-js'

const kobbleClient = createKobbleClient({
  domain: 'https://jjtest.portal.kobble.io',
  clientId: 'clubq73m700aam6v9athetal1',
  redirectUri: 'http://localhost:5173/oauth-redirect',
})

export default {
  name: 'OAuthRedirect',
  async created() {
    const redirectResult = await kobbleClient.handleRedirectCallback()
    const user = await kobbleClient.getUser()
    console.log(await kobbleClient.getAccessToken())
    /* const { getAccessTokenSilently } = useAuth0()
    const token = await getAccessTokenSilently()

    if (token) {
      localStorage.setItem('bearer-token', token)
      this.$router.push('/dashboard')
    }
    else {
      this.$router.push('/login')
    } */
  },
}
</script>

<template>
  <div>
    <slot />
  </div>
</template>
