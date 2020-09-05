<!--
 * @Description: 
 * @LastEditors: HL
 * @LastEditTime: 2020-04-29 18:51:59
 -->
### 表格组件(基于 ele-table)

- Attributes

| 参数           | 类型                 | 是否必须 | 说明                                                                                                                                                                                                  | 默认值   |
| -------------- | -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| tableData      | Array                | 否       | 表格数据                                                                                                                                                                                              | []       |
| tbset          | Object               | 否       | 基本参数                                                                                                                                                                                              | -        |
| -height        | string/number        | 否       | 高度                                                                                                                                                                                                  | -        |
| -maxHeight     | string/number        | 否       | Table 的最大高度                                                                                                                                                                                      | -        |
| -stripe        | boolean              | 否       | 是否为斑马纹 table                                                                                                                                                                                    | false    |
| -noBorder      | boolean              | 否       | 是否不带纵向边框                                                                                                                                                                                      | false    |
| -size          | string               | 否       | Table 的尺寸(medium / small / mini)                                                                                                                                                                   | -        |
| -fit           | boolean              | 否       | 是否列的宽度是否自撑开                                                                                                                                                                                | true     |
| -showHeader    | boolean              | 否       | 是否显示表头                                                                                                                                                                                          | true     |
| -highlight     | boolean              | 否       | 是否要高亮当前行                                                                                                                                                                                      | false    |
| -rowKey        | Function(row)/String | 否       | 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。 | id       |
| -emptyText     | string               | 否       | 空数据时显示的文本内容(需支持 slot)                                                                                                                                                                   | 暂无数据 |
| -expandAll     | Boolean              | 否       | 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效                                                                                                                                       | false    |
| -defaultSort   | Object               | 否       | 默认的排序列的 prop 和顺序。它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序                                                                                                                | -        |
| -tooltipEffect | string               | 否       | dark light  |     -   |
| -showSummary | Boolean               | 否       | 是否在表尾显示合计行  |     false   |
| -sumText | String               | 否       | 	合计行第一列的文本	  |     合计   |
| -selectOnIndeterminate | Boolean               | 否       | 	在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行	  |     true   |
| -indent | Number               | 否       | 	展示树形数据时，树节点的缩进	  |     16   |
| -lazy | Boolean               | 否       | 	是否懒加载子节点数据	  |     -   |
| -treeProps | Object               | 否       | 	渲染嵌套数据的配置选项	  |     { hasChildren: 'hasChildren', children: 'children' }   |
| -style | String               | 否       | 	表格样式	  |     -   |
| -ref | String               | 否       | 	表格ref	  |     -   |
| -dealHover | Boolean               | 否       | 	是否处理hover事件	  |     -   |
| -index | Boolean               | 否       | 	是否显示序号列	  |     false   |
| -indexLable | String               | 否       | 	序号列的表头文字	  |     序号   |
| -selection | Boolean               | 否       | 	选择列是否显示	  |     false   |
| -selectionWidth | Number               | 否       | 	选择列宽度	  |     40   |
| -expand | Boolean               | 否       | 	展开行	  |     false   |
| -expandWidth | Number               | 否       | 	展开行宽度	  |     -   |
| -fixHeader | Boolean               | 否       | 	是否固定表头	  |     false   |
| -fixRef | String               | 是       | 	固定表头的ref	  |     adeskFixTableRef   |
| -mixinScrollDom | String               | 是       | 	显示滚动条的控制元素,使用querySeletor	  |     -   |
| -onlyShowFixHeader | Boolean               | 是       | 	是否仅显示表头	  |     默认为false   |

| expendRowKeys | array | 否 | 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。 | [] |
| getSummaries | Function({ columns, data }) | 否 | 自定义的合计计算方法。 | - |
| arraySpanMethod | Function({ row, column, rowIndex, columnIndex }) | 否 | 合并行或列的计算方法。 | - |
| lazyLoadHandle | Function(row, treeNode, resolve) | 否 | 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息。 | - |
| selectableHandle | Function(row, index) | 否 | 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选。 | - |
| fixTbData | Array | 否 | 固定表头的数据 | [] |
| offsetTop | Number | 否 | 固定时距离顶部距离值 | 0 |

- Slot

| 参数   | 说明         |
| ------ | ------------ |
| header | 自定义标题栏 |
| expand | 展开行 |

- Events

| 参数            | 说明               | 回调参数             |
| --------------- | ------------------ | -------------------- |
| selectHandle           | 当用户手动勾选数据行的 Checkbox 时触发的事件         | selection, row                    |
| selectAllHandle | 当用户手动勾选全选 Checkbox 时触发的事件	 | selection |
| selectChange | 当选择项发生变化时会触发该事件		 | selection |
| cellMouseEnter | 当单元格 hover 进入时会触发该事件	 | row, column, cell, event |
| cellMouseLeave | 当单元格 hover 退出时会触发该事件	 | row, column, cell, event |
| cellClick | 当某个单元格被点击时会触发该事件	 | row, column, cell, event |
| cell-dblclick | 当某个单元格被双击击时会触发该事件	 | row, column, cell, event |
| rowClick | 当某一行被点击时会触发该事件	 | row, column, cell, event |
| row-contextmenu | 当某一行被鼠标右键点击时会触发该事件	 | row, column, event |
| rowDblClick | 当某一行被双击时会触发该事件	 | row, column, event |
| headerClick | 当某一列的表头被点击时会触发该事件	 | column, event |
| headerContextmenu | 当某一列的表头被鼠标右键点击时触发该事件	 | column, event |
| sortHandle | 当表格的排序条件发生变化的时候会触发该事件		 | { column, prop, order } |
| filterChange | 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。	 | filters |
| currentChange | 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性		 | currentRow, oldCurrentRow |
| headerDragend | 当拖动表头改变了列的宽度的时候会触发该事件		 | newWidth, oldWidth, column, event |
| expendChange | 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded）		 | row, (expandedRows | expanded) |
| scroll | 当表格体滚动时触发		 | vm(虚拟dom), e, |
| mouseEnter | 当鼠标进入表格触发		 |  e, |
| handleoperating | 自定义按钮的触发事件		 | row,type  |
| operatingCtrl | 自定义按钮的触发事件,带ctrl时触发		 |  row,type |
| switchHandle | 开关切换事件		 |  e,data |
