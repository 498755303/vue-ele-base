### dropdown 组件

- Attributes

| 参数         | 类型          | 是否必须 | 说明                           | 默认值   |
| ------------ | ------------- | -------- | ------------------------------ | -------- |
| type         | String        | 否       | 菜单按钮类型(text/button)      | text     |
| placement    | String        | 否       | 菜单弹出位置 top/bottom        | bottom   |
| trigger      | String        | 否       | 触发下拉的行为 hover, click    | hover    |
| hideOnClick  | Boolean       | 否       | 是否在点击菜单项后隐藏菜单     | true     |
| hideOnLeave  | Boolean       | 否       | 是否移出后隐藏菜单             | true     |
| showTimeout  | Number        | 否       | 展开下拉菜单的延时             | 0        |
| hideTimeout  | Number        | 否       | 收起下拉菜单的延时             | 0        |
| showArrow    | Boolean       | 否       | 是否显示下拉箭头               | true     |
| value        | Number,String | 是       | 当前选中项(需要加.sync 修饰符) | -        |
| title        | String        | 是       | 按钮标题                       | -        |
| showSelected | Boolean       | 否       | 是否展示选中项                 | false    |
| data         | Object[]      | 是       | 菜单数据                       | -        |
| -key         | Number,String | 是       | 每项的唯一索引                 | -        |
| -label       | Number,String | 是       | 每项展示值                     | -        |
| -disabled    | Boolean       | 否       | 每项是否禁用                   | false    |
| props        | Object        | 否       | 菜单数据配置项                 | -        |
| -key         | String        | 否       | 唯一索引 key                   | id       |
| -label       | String        | 否       | 展示值的 key                   | label    |
| -disabled    | String        | 否       | 是否禁用的 key                 | disabled |

- slot
  | 参数 | 说明 | 回调参数 |
  | -------------- | ------------------ | -------------------- |
  | titleIcon | 标题图标项(仅文字时可用) | - |

- Events

| 参数          | 说明               | 回调参数             |
| ------------- | ------------------ | -------------------- |
| command       | 点击菜单项事件     | 传入的菜单数据       |
| visibleChange | 显示和关闭切换回调 | true 显示 false 关闭 |
