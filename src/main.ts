import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

const app = createApp(App)

if (import.meta.env.VITE_ENABLE_AUTH0 === 'true') {
  app.use(createAuth0({
    domain: import.meta.env.VITE_ENABLE_AUTH0,
    clientId: import.meta.env.VITE_CLIENT_ID_AUTH0,
    authorizationParams: {
      redirect_uri: import.meta.env.VITE_REDIRECT_URL_AUTH0,
      audience: import.meta.env.VITE_AUDIENCE_AUTH0,
    },
  }))
}

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.use(router)
app.mount('#app')
