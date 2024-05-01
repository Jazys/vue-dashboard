import { createKobbleClient } from '@kobbleio/javascript'

const kobbleClient = createKobbleClient({
  domain: import.meta.env.VITE_DOMAIN,
  clientId: import.meta.env.VITE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_REDIRECT_URL,
})

export default kobbleClient
