import Vue from 'vue'
import App from './App.vue'

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // const store = createStore()
  const app = new Vue({
    render: h => h(App)
  })

  return { app }
}