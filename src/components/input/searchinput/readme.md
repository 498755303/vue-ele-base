### 搜索输入框 SearchInput 组件

- 依赖
  v-click-outside-x 需先安装在使用
- Attributes

| 参数        | 类型     | 是否必须 | 说明                    | 默认值       |
| ----------- | -------- | -------- | ----------------------- | ------------ |
| data        | object[] | 是       | 搜索的元数据            | []           |
| -any        | any      | 是       | 搜索的元数据唯一索引    |              |
| -label      | String   | 是       | 搜索的元数据别名        |              |
| prop        | Object   | 否       | 配置项                  | -            |
| -label      | String   | 否       | 显示别名                | label        |
| placeholder | String   | 否       | 占位符                  | 请输入搜索名 |
| min         | Number   | 否       | 最小输入字符            | 0            |
| max         | Number   | 否       | 最大输入字符            | 99999        |
| size        | String   | 否       | 尺寸(normal,small,mini) | noraml       |
| showButton  | Boolean  | 是       | 是否显示搜索按钮        | true         |
| emptyText   | String   | 否       | 无搜索结果的文字        | 没有搜索结果 |

- Events

| 事件名       | 说明             | 回调参数                      |
| ------------ | ---------------- | ----------------------------- |
| enter        | 输入框回车事件   | 输入内容                      |
| button-click | 按钮点击事件     | 输入内容                      |
| change       | 输入更改事件     | 输入内容                      |
| result-click | 过滤结果点击事件 | 点击节点内容(Node 类型)和索引 |
