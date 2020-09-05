#### 枚举类参数约定如下字段
* @param code:String 前端标识字段 大写
* @param label:String 展示文字
* @param value:Any 后端枚举值
* @param id?:Number 如需ID可使用
* @paran showTip?:Boolean 是否使用? popover方式展示desc描述标识
* @param group?:String[] 分组参数,详见ENUM类group方法
* @param desc?:String 描述字段
* 对应使用Enum.ts类生成Enum

#### 常量枚举约定如下
* 命名:以constant结尾 如:targetLadingTypeConstant
* string[],用于整体描述


#### 使用时建议使用code作为key 