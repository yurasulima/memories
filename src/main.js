import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.ts'
import './assets/global.css'
import { i18n } from './i18n/index.ts'

import {StatusBar, Style} from '@capacitor/status-bar'
import {EdgeToEdge} from "@capawesome/capacitor-android-edge-to-edge-support";
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)



app.mount('#app')


