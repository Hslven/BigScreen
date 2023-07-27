import { cloneDeep } from 'lodash'
import router, { asyncRoutes } from '@/router/index'
import { ParentLayout } from '@/router/constant'

export const routerGenerator = (data) => {
  const currentRouterDara = generatorDynamicRouter(data)
  const resRouter = cloneDeep(asyncRoutes)
  currentRouterDara.forEach((item) => {
    resRouter[0].children.push(item)
  })
  router.addRoute(...resRouter)
  return resRouter
}

export const generatorDynamicRouter = (menus) => {
  return menus.map((item) => {
    const currentRouter = {
      path: item.path,
      // 路由名称，建议唯一
      name: item.name,
      // 该路由对应页面的 组件
      component: item.component === 'LAYOUT' || !item.isFrame ? ParentLayout : (resolve) => require([`@/views${item.component}`], resolve),
      meta: {
        ...item
      }
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generatorDynamicRouter(item.children, currentRouter)
    }
    return currentRouter
  })
}
