import store from './../store'
import Cookies from 'js-cookie'
/*export default function auth ({ next, store }){
    /!*if(!store.getters['auth/check']){
        return next({
            name: 'login'
        })
    }*!/

    return next()
}*/
export default function auth({ next, router }) {
    if (!Cookies.get('token')) {
        return router.push({ name: `login` });
    }

    return next();
}
