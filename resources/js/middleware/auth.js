//import store from './../store'

export default function auth ({ next, store }){
    /*if(!store.getters['auth/check']){
        return next({
            name: 'login'
        })
    }*/

    return next()
}
