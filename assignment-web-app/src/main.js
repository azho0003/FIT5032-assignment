import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Rating from 'primevue/rating'
import { initializeApp } from "firebase/app"

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCR3WLHPaO0qrzCW1jOWDOzxgOX92YO24k",
    authDomain: "azho0003-5032.firebaseapp.com",
    projectId: "azho0003-5032",
    storageBucket: "azho0003-5032.appspot.com",
    messagingSenderId: "101945142707",
    appId: "1:101945142707:web:a04187b001489b4d6fafc6"
  };
  
  // Initialise Firebase
initializeApp(firebaseConfig);

const app = createApp(App);
app.use(PrimeVue, { theme: {preset: Aura} })
app.component('RatingComponent',Rating)
app.use(router);
app.mount('#app');
