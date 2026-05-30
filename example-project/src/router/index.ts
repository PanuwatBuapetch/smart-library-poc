/// <reference types="vite/client" />
import { createRouter, createWebHistory } from 'vue-router'
import BookView from '../views/BookView.vue'
import UserView from '../views/UserView.vue'
import BorrowView from '../views/BorrowView.vue'
import FinesView from '../views/FinesView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'books',
      component: BookView
    },
    {
      path: '/users',
      name: 'users',
      component: UserView
    },
    {
      path:  '/borrows',
      name:  'borrows',
      component: BorrowView
    },
    {
      path: '/fines',
      name: 'fines',
      component: FinesView
    }
  ]
})

export default router