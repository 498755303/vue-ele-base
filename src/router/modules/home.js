/*
 * @Description: 首页路由
 * @LastEditors: HL
 * @LastEditTime: 2020-05-25 12:34:20
 */
export default [
  // 首页路由
  {
    path: '/home',
    name: 'home',
    component: resolve => require(['@/views/layout'], resolve),
    redirect: '/home/index',
    meta: {
      id: 2010000
    },
    children: [
      {
        path: '/home/index',
        name: 'homeindex',
        component: resolve => require(['@/views/home/index.vue'], resolve),
        meta: {
          id: 2010000
        }
      }
    ]
  }
]
