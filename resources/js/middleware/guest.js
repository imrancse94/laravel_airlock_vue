export default function guest ({ next, store }){
    if(store.getters['auth\check']){
        return next({
            name: '/'
        })
    }

    return next()
}
