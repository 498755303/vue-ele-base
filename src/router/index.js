import Vue from 'vue'
import Router from 'vue-router'
import {constRouter} from './constRouter.js';
import {asyncRouter} from './asyncRoute.js';

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
const createRouter = () => {
    return new Router({
        // mode: 'history',
        routes: constRouter.concat(asyncRouter),
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return {
                    x: 0,
                    y: 0
                }
            }
        }
    })
}

export const resetRouter = () => {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

const router = createRouter()
export default router
