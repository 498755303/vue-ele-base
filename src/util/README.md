# 封装工具类

## ajax.js axios封装及拦截器
## errHandle.js 异常捕获类,搭配sentry
## common.js 


## app 应用相关

#### dom.js
> dom相关操作

#### localforage.js
> 基于localForage封装
> 已做兼容性处理

- export

| 参数         | 类型    | 说明      |说明      | 参数      |
| ------------ | -------| -------   |-------   |-------   |
| lfKeyMap     | Object  | 本地存储的key记录    |  原始配置在config目录下   |    |
| createDbLink | Function | 创建数据库连接    |  原始配置在config目录下,参数key可以直接使用dbMap中的key   |  key:dbMap中对应的key值 config:配置  |

## decorate 装饰器

#### baseGet.ts
基础get装饰器
#### baseSave.ts
基础save装饰器
#### column.ts
ts class 无法在new 时获取到定义的key,该装饰器可以在new之后获取到定义key 参见CopyProperty中
#### page.ts
分页获取装饰器
#### simpleGet.ts
简单获取装饰器


## deptools

#### auth.ts 用户相关class
export class AuthUtil

#### autoImport.ts 自动导入
export class AutoImportUtil 
自动导入模块 

#### DebugTool.ts debug相关
export class DebugTool 

#### LsUtil.ts localStorage操作
export class LsUtil

#### notify.ts 通知相关
export const Notify  
封装了一个基于ele-pro-hl和notification的通知

#### Watermark.ts 水印类
export class Watermark
背景水印类

## expand 数据类型扩展工具类
> 详情见每个文件中方法



## record 项目记录

#### busrecord vue-bus key记录,便于维护


## tools

#### ajax.js 原生ajax封装
#### CopyPropertyUtil.ts 拷贝工具类,包含class的copy
#### enum.ts 枚举工具类,使用通过new Enums(数据源)
#### formControl.ts 一个嵌套表单检验工具类
#### MaterialInfoUtil.ts 素材工具类
#### validate.ts 校验工具类

