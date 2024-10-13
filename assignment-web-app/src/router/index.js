import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseLoginView from '../views/FirebaseLoginView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import SendEmailView from '../views/SendEmailView.vue'
import DataTableView from '../views/DataTableView.vue'
import MapView from '../views/MapView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/register',
    name: 'Register',
    component: FirebaseRegisterView
  },
  {
    path: '/login',
    name: 'Login',
    component: FirebaseLoginView
  },
  {
    path: '/email',
    name: 'Email',
    component: SendEmailView
  },
  {
    path: '/data',
    name: 'DataTable',
    component: DataTableView
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router