import './assets/main.css'
import ErrorStackParser from "error-stack-parser"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { findCodeBySourceMap } from './utils/index.ts'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.config.errorHandler = (err: any,vm) => {
  const errorStack = ErrorStackParser.parse(err as Error)
  const jsError = {
    stack_frames: errorStack,
    message: err.message,
    stack: err.stack,
    name: err.name,
  }
  vm!.$message.error(err.name)
  localStorage.setItem('jsErrorList', JSON.stringify(jsError))
  // findCodeBySourceMap(errorStack[0])
}

app.mount('#app')
