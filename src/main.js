import Vue from 'vue'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import router from './router'
import store from './store'
import './common/stylus/index.styl'
import http from './api/http'
Vue.use(VueLazyload, {
  preLoad: 1,
  error: require('./common/image/default.png'),
  loading: require('./common/image/default.png')
});
fastclick.attach(document.body)
Vue.prototype.$http = http
Vue.prototype.$bus = new Vue()
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
