import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.ts'
import './assets/global.css'
import { i18n } from './i18n/index.ts'


import vue3GoogleLogin from 'vue3-google-login'
const app = createApp(App)

app.use(vue3GoogleLogin, {
    clientId: '280444808440-eho58j22h1eilcp4es7ec11hpr9oavc4.apps.googleusercontent.com'
})


app.use(createPinia())
app.use(router)
app.use(i18n)



app.mount('#app')


