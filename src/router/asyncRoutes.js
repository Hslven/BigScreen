// // import layout from '@/Layout/Layout'
// import { ParentLayout } from '@/router/constant'
// /**
//  * 需要授权访问的路由
//  */
// const asyncRoutesChildren = [
//   {
//     path: '/',
//     name: 'Home',
//     meta: {
//       roles: ['admin', 'editor', 'test'],
//       title: '主页',
//       icon: 'home',
//       keepAlive: true
//     },
//     component: () => import('@/views/home/Home')
//   },
//   {
//     path: '/test',
//     name: 'test',
//     meta: {
//       roles: ['admin', 'editor'],
//       title: '测试',
//       icon: 'design_services',
//       keepAlive: true
//     },
//     component: ParentLayout,
//     children: [
//       {
//         path: 'one',
//         name: 'one',
//         meta: {
//           roles: ['admin', 'editor'],
//           title: '测试组件1',
//           icon: 'tune',
//           keepAlive: true
//         },
//         component: () => import('@/views/test/modDate')
//       }
//     ]
//   },
//   {
//     path: '/menu-1',
//     name: 'menu-1',
//     meta: {
//       roles: ['admin'],
//       title: '三级菜单',
//       icon: 'filter_3',
//       keepAlive: true
//     },
//     component: ParentLayout,
//     children: [
//       {
//         path: 'menu-2',
//         name: 'menu-2',
//         meta: {
//           roles: ['admin', 'test'],
//           title: '菜单 1-1',
//           icon: 'filter_2',
//           keepAlive: true
//         },
//         component: ParentLayout,
//         children: [
//           {
//             path: 'menu-3',
//             name: 'Menu-3',
//             meta: {
//               roles: ['admin', 'test'],
//               title: '菜单 1-2',
//               icon: 'filter_1',
//               keepAlive: true
//             },
//             component: () => import('@/views/components/Menu-3.vue')
//           }
//         ]
//       }
//     ]
//   },
//   {
//     path: 'http://www.quasarchs.com/vue-components/button',
//     name: 'external-link',
//     meta: {
//       roles: ['admin', 'editor'],
//       title: '外部链接/更多组件',
//       icon: 'send'
//     }
//   },
//   {
//     path: '/tableDetail',
//     name: 'TableDetail',
//     meta: {
//       roles: ['admin', 'editor'],
//       title: 'Treats 详情',
//       icon: 'blur_linear',
//       isHidden: true
//     },
//     component: () => import('@/views/home/TableDetail')
//   },
//   {
//     path: '/cimo',
//     name: 'Cimo',
//     meta: {
//       title: '关于作者',
//       icon: 'fab fa-studiovinari',
//       isHidden: true
//     },
//     component: () => import('@/views/components/Cimo')
//   },
//   {
//     path: '*', // 此处需置于最底部
//     name: '404',
//     redirect: '/NoFound404',
//     meta: {
//       title: '404',
//       icon: 'fab fa-studiovinari',
//       isHidden: true
//     }
//   }
// ]

// export { asyncRoutesChildren }
