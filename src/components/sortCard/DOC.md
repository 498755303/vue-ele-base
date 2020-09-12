## README sort-card 组件

- Attributes

| 参数               | 类型             | 是否必须   | 说明                                                       | 默认值   |
| ----------------- | ---------------- | -------- | ---------------------------------------------------------- | -------- |
| defaultData       | Object           | 否       | 默认排序                                                     |          |
| -orderField       | String           | 否       | 排序字段                                                     |          |
| -orderType        | String           | 否       | 排序类型 0默认                                                     | 0     |
| data              | Object[]         | 是       | 展示文字对应 key                                             |     |
| -value            | String           | 是       | 对应返回的value的值                                         |    |
| -id               | String或Number    | 是       | 唯一索引                                                     |      |
| -label             | String           | 是       | 展示的名称                                               |      |
| simpleSort        | Boolean          | 否       | 是否简单排序,简单排序值有降序                                  |    false     |                                        |        |

- Events

| 参数             | 说明         | 回调参数                       |
| ---------------- | ------------ | ------------------------------ |
| sort    | 排序改变事件 | 对应defaultData对象 |

- Methods

| 参数            | 说明                          | 参数        |
| --------------- | ----------------------------- | ----------- |
| getCurOrder      | 获取当前选中,返回对应defaultData对象                |            |
