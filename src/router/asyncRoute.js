/*
 * @Description: 异步路由自动导入
 */
import { AutoImportUtil } from '@/util/deptools/autoImport.ts'
import { CopyPropertyUtil } from '@/util/tools/CopyPropertyUtil.ts';
const routeModules = AutoImportUtil.importAll(
  require.context('@/router/modules', false, /\.js$/)
)

const asyncRouterOri = routeModules.reduce(
  (asyncRouterOri, routerModule) => asyncRouterOri.concat(routerModule.module),
  []
)
export const asyncRouter = CopyPropertyUtil.objDeepCopy(asyncRouterOri)
