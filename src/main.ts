import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

const app = createApp(App)

app.use(
  createAuth0({
    domain: 'dev-qu2xg1uwk243o82u.us.auth0.com',
    clientId: 'HbjRKXn14MvtSXVlODYeuh7CUwjcWs4Q',
    authorizationParams: {
      redirect_uri: 'http://localhost:5173/oauth-redirect',
      audience: 'https://dev-qu2xg1uwk243o82u.us.auth0.com/api/v2/',
    },
  }),
)

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.use(router)
app.mount('#app')
