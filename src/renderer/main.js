import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Util from "./assets/util"
import ElementUI from 'element-ui'
import '@/assets/css/main'
import $ from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
Vue.use(Util);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app')