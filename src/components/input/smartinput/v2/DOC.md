## README multiple-filter 组件v2(同时支持单选和多选)

- Attributes

| 参数               | 类型             | 是否必须   | 说明                                                       | 默认值   |
| ----------------- | ---------------- | -------- | ---------------------------------------------------------- | -------- |
| value             | String           | 是       | 绑定值                                                      |    ""      |
| wordList          | Object[]         | 是       | 词包数据(key于wordSetting对应)                               |          |
| wordSetting       | Object           | 否       | 词包数据配置项                                               |          |
| -key              | String           | 否       | 唯一索引对应 key                                             | id       |
| -label            | String           | 否       | 展示文字对应 key                                             | label    |
| -length           | String           | 否       | 词包所占长度对应key                                           | length   |
| wordType          | Number           | 否       | 词包标致类型 1{}2[]3()                                       | 1     |
| wordMap           | Object           | 否       | 词包数据缓存,用于多次使用组件的性能优化                          |         |
| defaultShowLen    | Number           | 否       | 默认展示词包数                                               |    2   |
| maxWordCount      | Number           | 否       | 最大词包个数                                                 | 2     |
| showMore          | Boolean          | 否       | 是否展示更多按钮                                             |  true   |
| setting           | Boolean          | 否       | 输入框设置项                                                 |     |
| -label            | String           | 否       | 文本框标识                                                    | 创意标题   |
| -placeHolder      | String           | 否       | 占位字符串                                                  | 请输入       |
| -size             | String           | 否       | 大小                                                       |    normal    |
| -style            | String           | 否       | 样式字符串                                                  |        |
| showLimit         | Boolean          | 否       | 是否显示限制长度                                              |    true    |
| maxLen            | Number           | 否       | 最大输入长度                                                 |    999    |
| minLen            | Number           | 否       | 最小输入长度                                                 |    1    |
| doubleCodeAble    | Boolean          | 否       | 是否启用特殊字符字节计算                                       |    false    |
| doubleCode        | Regxp            | 否       | 特殊字符判断正则表达式                                        |    [^\x00-\xff]    |

- Events

| 参数             | 说明         | 回调参数                       |
| ---------------- | ------------ | ------------------------------ |
| change        | 输入内容变更事件  | String:值 |
| add           | 按钮点击添加事件  | 词包项数据,对应wordSetting |
| blur          | 失去焦点事件      | Event:事件 |
| loadMore      | 点击加载更多事件  | Function:参数传入词包项数据,传入添加词包,空则不添加 |
| error         | 校验有错误信息事件 | String:错误信息字符串,Boolean:是否已经在较严重提示 |

- Methods

| 参数            | 说明                          | 参数        |
| --------------- | ----------------------------- | ----------- |
| valid           | 校验方法                       |                 |
| clearValidate   | 清空校验方法                    |            |
| getCurWords     | 获取当前已选词包信息 {start,end,label,value}[]  |            |
