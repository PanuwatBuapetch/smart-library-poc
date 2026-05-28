import { createApp } from 'vue'

import App from './App.vue'

import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')