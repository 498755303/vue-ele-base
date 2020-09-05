<!--
 * @Description: 修改显示组件,可单独使用,增加配置返回类型
 * @LastEditors  : HL
 * @LastEditTime : 2020-01-16 16:48:40
 -->
### 级联selectPannel组件
- Attributes

| 参数 | 类型 | 是否必须 | 说明  | 默认值  |
| --------  | ----- | --- | --- | --- |
| data | Array | 是 | 显示的数据源  | [] |
| setting | Object | 否 | 配置项  | - |
| -key | String | 否 | 唯一索引key  | id |
| -label | String | 否 | 显示别名  | text |
| -disabledKey | String | 否 | 控制disabled的key  | disabled |
| -returnType | String | 否 | event返回的参数类型(id/item)  | id |
| -onlyRead | Boolean | 否 | 是否只读(只读模式无删除按钮)  | false |

- Events

| 事件名 | 说明 | 回调参数 |
| -------- | ----- | ------ |
| clear-all | 清空全部(非只读模式有效) | setting.returnType =="item" ? object : object[setting.key] |
| remove | 删除单个(非只读模式有效) | setting.returnType =="item" ? object : object[setting.key] |

- methods

| 方法名 | 说明 | 参数 |
| -------- | ----- | ------ |
| setCheckedNodes | 设定选中项 | 对应props.key[],对应的keyName |
| getCheckedNodes | 获取选中项 | isZip:Boolean(是否平级数据) |
| refreshAll | 刷新 | - |
| clearChecked | 清除选择项 | 对应props.key[],禁用的不能清除 |