### 级联cascader组件
- Attributes

| 参数 | 类型 | 是否必须 | 说明  | 默认值  |
| --------  | ----- | --- | --- | --- |
| data | Array | 是 | 显示的数据源  | [] |
| props | Object | 否 | 配置项  | - |
| -key | String | 否 | 唯一索引key  | id |
| -label | String | 否 | 显示别名  | label |
| -children | String | 否 | 级联数组key名  | children |
| -checked | String | 否 | 是否选中判断key  | - |
| -disabled | String | 否 | 是否禁用判断key  | - |
| -selected | String | 否 | 是否选则判断key  | - |
| settings | Array | 是 | 每层配置项  | - |
| -level | Number | 是 | 层数(依次递增)  | - |
| -title | String | 是 | 该层标题  | - |
| -hasAllCheck | Boolean | 是 | 是否有全选  | - |
| -showCheckBox | Boolean | 是 | 是否显示选择框  | - |
| checkedLevel | Number | 是 | 选中的层级  | - |
| zipLevel | Number | 是 | 压缩层级,获取选中数据从第zipLevel层开始,列ziplevel= 3则1 2 层选中的不获取  | 1 |
| isSingle | Boolean | 是 | 是否单选,true时 只能选择一个 | false |
| showIndeterminate | Boolean | 是 | 是否有非全选状态  | true |
| showSelect | Boolean | 否 | 是否显示选中项 | false |
| selectTitle | String | 否 | 已选的标题 | 已选 |

- Events

| 事件名 | 说明 | 回调参数 |
| -------- | ----- | ------ |
| result-change | 选中结果改变回调 | 选中结果[],例:{id:xx,level:2,text:"",data:{}} |

- methods

| 方法名 | 说明 | 参数 |
| -------- | ----- | ------ |
| setCheckedNodes | 设定选中项 | 对应props.key[],对应的keyName |
| getCheckedNodes | 获取选中项 | isZip:Boolean(是否平级数据) |
| refreshAll | 刷新 | - |
| clearChecked | 清除选择项 | 对应props.key[],禁用的不能清除 |