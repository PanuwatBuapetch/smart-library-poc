import { createApp } from 'vue'

import App from './App.vue'
import router from './router' // ตรวจสอบว่ามีบรรทัดนี้
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')