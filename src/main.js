import Vue from 'vue'
// import App from './App.vue'

// const App = () => import('./App.vue').then(m => m.default);

const App = require('./App.vue').default

new Vue({
  el: '#app',
  render: h => h(App)
})
