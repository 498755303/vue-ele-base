/*
 * @Description:自动导入工具类
 * @LastEditors: HL
 * @LastEditTime: 2020-06-19 01:17:43
 */
// @ts-nocheck
import _ from "lodash";
const fileNameRE = /^\.\/([^\s]+)\.js$/;
export class AutoImportUtil {
  public static Components(filedir) {
    let components = [];
    const requireComponent = require.context(
      // 其组件目录的相对路径
      filedir + "/components",
      // 是否查询其子目录
      false,
      // 匹配基础组件文件名的正则表达式
      /\w+\.vue$/
    );

    requireComponent.keys().forEach((fileName) => {
      // 获取组件配置
      const componentConfig = requireComponent(fileName);

      // 获取组件的 PascalCase 命名
      const componentName = _.upperFirst(
        _.camelCase(
          // 获取和目录深度无关的文件名
          fileName
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
      );
      console.log(componentName, componentConfig);
      components.push(componentName);
    });
  }
  public static importAll(modulesContext) {
    return modulesContext.keys().map((modulesPath) => {
      const moduleName = modulesPath.match(fileNameRE);
      return {
        moduleName,
        camelModuleName: moduleName[1].replace(/-(\w)/g, (_, c) =>
          c ? c.toUpperCase() : ""
        ),
        module: modulesContext(modulesPath).default,
      };
    });
  }
}
