import auth from "../middleware/auth";
import guest from "../middleware/guest";
import store from './../store';

function page (path) {
    return () => import(/* webpackChunkName: '' */ './../pages/'+path).then(m => m.default || m)
}




export default [
    { path: '/', name: 'welcome', component: page('welcome.vue'),
        meta: {
            middleware: [
                auth
            ]

        }
        /*,
        beforeEnter(to, from, next) {
            if (!store.getters['auth/check'] && store.getters['auth/token']) {
                store.dispatch('auth/fetchUser')
                next()
            }else{
                next({path:"/login"})
            }

        }*/
    },
    { path: '/login', name: 'login', component: page('auth/login.vue'),
        meta: {
            middleware: [
                guest
            ],
            layout:"login"
        } },
    { path: '*', redirect: '/login' },
    { path: '/register', name: 'register', component: page('auth/register.vue') },
    { path: '/password/reset', name: 'password.request', component: page('auth/password/email.vue') },
    { path: '/password/reset/:token', name: 'password.reset', component: page('auth/password/reset.vue') },
    { path: '/email/verify/:id', name: 'verification.verify', component: page('auth/verification/verify.vue') },
    { path: '/email/resend', name: 'verification.resend', component: page('auth/verification/resend.vue') },

    { path: '/home', name: 'home', component: page('home.vue') },
    { path: '/settings',
        component: page('settings/index.vue'),
        children: [
            { path: '', redirect: { name: 'settings.profile' } },
            { path: 'profile', name: 'settings.profile', component: page('settings/profile.vue') },
            { path: 'password', name: 'settings.password', component: page('settings/password.vue') }
        ] }


]
