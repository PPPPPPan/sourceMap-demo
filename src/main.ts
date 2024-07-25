import './assets/main.css'
import ErrorStackParser from "error-stack-parser"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { findCodeBySourceMap } from './utils/index.ts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err,vm) => {
  const errorStack = ErrorStackParser.parse(err as Error)
  findCodeBySourceMap(errorStack[0])
}

app.mount('#app')
