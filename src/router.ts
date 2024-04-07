import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Forms from './views/Forms.vue'
import Tables from './views/Tables.vue'
import UIElements from './views/UIElements.vue'
import LoginOAuth from './views/LoginOAuth.vue'
import Modal from './views/Modal.vue'
import Card from './views/Card.vue'
import Blank from './views/Blank.vue'
import OAuthRedirect from './views/OAuthRedirect.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: LoginOAuth,
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
  {
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
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard global avant chaque route
router.beforeEach(async (to, from, next) => {
  if (to.path !== '/oauth-redirect') {
    const token = localStorage.getItem('bearer-token')
    console.log(token)

    if (token) {
      next()
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
