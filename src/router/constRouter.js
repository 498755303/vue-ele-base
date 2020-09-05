import Layout from '@/views/layout/index'

export const constRouter = [
    {
        path: '/401',
        name: '401page',
        component: resolve => require(['@/views/others/error/401'], resolve),
        meta: {
            roleId: 29300,
            activeLabel: '401page',
            title: '401'
        }
    },
    {
        path: '/404',
        name: '404page',
        component: resolve => require(['@/views/others/error/404'], resolve),
        meta: {
            roleId: 29310,
            activeLabel: '404page',
            title: '404'
        }
    },
    {
        path: '',
        name: 'home',
        redirect: '/home',
        component: Layout,
        meta: {
            id: 2010000
        }
    }
]
