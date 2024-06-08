import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import OAuthRedirect from './views/OAuthRedirect.vue'
import Profile from './views/Profile.vue'
import Contact from './views/Contact.vue'
import Landing from './views/Landing.vue'
import kobbleClient from './lib/kobbleClient'
import { useRequestStore } from './store/request'
import Login from './views/Login.vue'

let store

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: { layout: 'empty' },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/oauth-redirect',
    name: 'redirect',
    component: OAuthRedirect,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  /* {
    path: '/forms',
    name: 'Forms',
    component: Forms,
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Card,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/ui-elements',
    name: 'UIElements',
    component: UIElements,
  },
  {
    path: '/modal',
    name: 'Modal',
    component: Modal,
  },
  {
    path: '/blank',
    name: 'Blank',
    component: Blank,
  }, */
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global avant chaque route
router.beforeEach(async (to, from, next) => {
  if (to.path !== '/oauth-redirect' && to.path !== '/') {
    const store = useRequestStore()
    const token = localStorage.getItem('bearer-token')

    if (token) {
      if (await kobbleClient.isAuthenticated) {
        store.startLoading()
        next()
        store.stopLoading()
      }
      else {
        localStorage.setItem('bearer-token', '')
        next({ name: 'Login' })
      }
    }
    else {
      // Si pas de token, redirigez vers la page de connexion ou une autre action
      if (to.name !== 'Login') { // Évitez la redirection si vous êtes déjà sur la page de login
        next({ name: 'Login' })
      }
      else {
        next()
      }
    }
  }
  else {
    next()
  }
})

export default router
