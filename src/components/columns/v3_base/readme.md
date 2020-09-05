### 自定义列组件
## auth:hl
- 
拖拽 基于 Vue.Draggable，需先npm i -S vuedraggable
- Attributes

| 参数         | 类型    | 是否必须 | 说明                                                          | 默认值                                    |
| ------------ | ------- | -------- | ------------------------------------------------------------- | ----------------------------------------- |
| data         | Array   | 是       | 显示的数据源                                                  | []                                        |
| -id          | Number  | 是       | 唯一索引 key                                                  | id                                        |
| -label       | String  | 是       | 显示别名                                                      | label                                     |
| -children    | String  | 是       | 级联数组 key 名                                               | children                                  |
| -subItems    | id[]    | 否       | 该项控制的禁用项                                              | 该项选中,对应项启用,该项未选中,对应项禁用 |
| -disabled    | Boolean | 否       | 是否禁用判断 key                                              | -                                         |
| mustColumns  | Array   | 是       | 必选项,结构同 data                                            | []                                        |
| props        | Object  | 否       | 配置项                                                        | -                                         |
| -key         | String  | 否       | 唯一索引 key                                                  | id                                        |
| -label       | String  | 否       | 显示别名                                                      | label                                     |
| -children    | String  | 否       | 级联数组 key 名                                               | children                                  |
| -controlList | String  | 否       | 控制禁用字段名                                                | subItems                                  |
| -disabled    | String  | 否       | 是否禁用判断 key                                              | -                                         |
| -hidden    | String  | hide       | 用于判断是否展示(仅必选生效)                                             | -                                         |
| settings     | Array   | 是       | 每层配置项                                                    | -                                         |
| -header      | String  | 否       | 标题                                                          | -                                         |
| checkedLevel | Number  | 是       | 选中的层级                                                    | -                                         |
| zipLevel     | Number  | 是       | 压缩层级,获取选中数据从第 zipLevel 层开始,列 ziplevel= 3 则 1 |
| showSelect   | Boolean | 否       | 是否显示选中项                                                | true                                      |
| dragable     | Boolean | 否       | 是否选中项可拖拽                                              | false                                      |

- Events

| 事件名        | 说明             | 回调参数                                      |
| ------------- | ---------------- | --------------------------------------------- |
| result-change | 选中结果改变回调 | 选中结果[],例:{id:xx,level:2,text:"",data:{}} |

- methods

| 方法名             | 说明               | 参数                            |
| ------------------ | ------------------ | ------------------------------- |
| setCheckedNodes    | 设定选中项         | 对应 props.key[],对应的 keyName |
| setNewCheckedNodes | 设定选中项(先清空) | 对应 props.key[],对应的 keyName |
| getCheckedNodes    | 获取选中项         | isZip:Boolean(是否平级数据)     |
| refreshAll         | 清空               | -                               |
| clearCheckedNodes  | 设定某节点不选中   | props.key[]                     |
| getFlattenData     | 获取对应层级数据   | level:层级                      |
