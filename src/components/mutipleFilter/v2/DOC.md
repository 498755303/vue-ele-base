## README multiple-filter 组件v2(同时支持单选和多选)

- Attributes

| 参数               | 类型             | 是否必须   | 说明                                                       | 默认值   |
| ----------------- | ---------------- | -------- | ---------------------------------------------------------- | -------- |
| data              | Object[]         | 是       | 数据                                                        |          |
| prop              | Object           | 否       | 配置项                                                      |          |
| -key              | String           | 否       | 唯一索引对应 key                                             | id       |
| -label            | String           | 否       | 展示文字对应 key                                             | label    |
| -value            | String           | 否       | 对应返回的value的key                                         | value   |
| -icon             | String           | 否       | 展示的图标地址                                               | icon     |
| label             | String           | 是       | 标题                                                        |         |
| firstSetting      | Object           | 否       | 首个节点的配置项                                             |       |
| -show             | Boolean          | 是       | 是否展示首个节点                                             | true     |
| -item             | Object           | 否       | 首项数据,对应结构为prop字段                                   | {label:"不限",id:-1,value:-1}   |
| multiple          | Boolean          | 否       | 是否允许多选(单选+多选同时支持)                                | false    |
| open              | Boolean          | 否       | 超过一行是否默认展开                                          | false   |
| singleH           | Number           | 否       | 单行文本高度                                                 | 50       |
| value             | prop.key[]       | 是       | 绑定值,支持v-model                                           |        |

- Events

| 参数             | 说明         | 回调参数                       |
| ---------------- | ------------ | ------------------------------ |
| change    | 选择改变事件 | 选中的prop.key[] |

- Methods

| 参数            | 说明                          | 参数        |
| --------------- | ----------------------------- | ----------- |
| reset           | 重置                         |                 |
| getChecked      | 获取当前选中,返回item[]                  |       传入时获取对应选项,不传为已选:prop.key[]        |
