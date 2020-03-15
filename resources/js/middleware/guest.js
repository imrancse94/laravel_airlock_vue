import store from './../store'
import Cookies from "js-cookie";
export default function guest({ next, router }) {
    if (Cookies.get('token')) {
        return router.push({ name: 'welcome' });
    }

    return next();
}
