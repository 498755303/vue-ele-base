### org-tree 组件

- Attributes

| 参数              | 类型             | 是否必须 | 说明                                                       | 默认值   |
| ----------------- | ---------------- | -------- | ---------------------------------------------------------- | -------- |
| data              | Object           | 是       | 数据                                                       |          |
| props             | Object           | 否       | 配置项                                                     |          |
| -unique           | String           | 否       | 唯一索引对应 key                                           | id       |
| -label            | String           | 否       | 展示文字对应 key                                           | label    |
| -expand           | String           | 否       | 是否展开对应 key                                           | expand   |
| -children         | String           | 否       | 子级对应 key                                               | children |
| expandOnClickNode | Boolean          | 否       | 是否点击节点展开下级                                       | false    |
| selectOnClickNode | Boolean          | 否       | 是否点击节点选中当前节点                                   | true     |
| defaultExpandAll  | Boolean          | 否       | 是否默认全部展开                                           | true     |
| horizontal        | Boolean          | 否       | 是否从左到右                                               | false    |
| collapsable       | Boolean          | 否       | 是否有展开收缩功能                                         | false    |
| labelWidth        | String, Number   | 否       | label 对应宽度                                             | -        |
| labelClassName    | Function, Number | 否       | label 对应类名,参数当前节点数据                            | -        |
| selectedClassName | Function, Number | 否       | selectedClassName 对应类名,参数当前节点数据                | -        |
| renderContent     | Function         | 否       | 自定义展示方法(render),参数:渲染函数和当前节点数据(h,data) | -        |

- Events

| 参数             | 说明         | 回调参数                       |
| ---------------- | ------------ | ------------------------------ |
| expand-change    | 展开收缩切换 | e, data 事件参数和当前节点数据 |
| node-click       | 节点点击事件 | e, data 事件参数和当前节点数据 |
| node-contextmenu | 节点右击事件 | e, data 事件参数和当前节点数据 |

- Methods

| 参数            | 说明                          | 参数        |
| --------------- | ----------------------------- | ----------- |
| setSelectedNode | 设定选中项(唯一索引,选中状态) | unique,flag |
| getSelectedNode | 获取当前选中节点              | -           |
| getNode         | 根据唯一索引获取节点          | unique      |
| removeNode      | 删除某个节点                  | unique      |
| appendNode          | 节点追加一个子节点            |             |
| insertBefore    | 节点的前面增加一个节点        | unique      |
| insertAfter     | 节点的后面增加一个节点        | unique      |
