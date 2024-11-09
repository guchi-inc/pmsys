import '@/assets/main.css'
import './assets/styles/index.scss'

import { createApp } from 'vue'
import pinia from './store' // <-- Make sure to call createPinia!
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import dialogResize from './utils/dialog'
import print from 'vue3-print-nb'

import App from './App.vue'
import router from './router/routers'
import './router/index'
import 'default-passive-events' //--Unable to preventDefault inside passive event listener invocation.
// import { configStore } from './store/config'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(dialogResize)
app.use(print)

app.mount('#app')
// load config
// configStore().loadConfig()