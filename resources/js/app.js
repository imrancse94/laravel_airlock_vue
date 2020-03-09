require('./bootstrap');
import Vue from 'vue'
import router from './routes';
import store from  './store';
import App from './components/ExampleComponent.vue';
import axios from 'axios'
axios.defaults.withCredentials = true;
Vue.use({
    install (Vue) {
        Vue.prototype.$api = axios.create({
            baseURL: 'http://localhost:8000/api/v1/'
        })
    }
})

Vue.component('default', require('./layouts/default.vue').default);
Vue.component('login', require('./layouts/login.vue').default);

Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
