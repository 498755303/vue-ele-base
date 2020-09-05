### 关于组件自定义列（customheader）的使用说明
## auth:lulu
1. 引入组件
```
<custom-header ref="customDialog":settings="settings"
                          :collapseInfo=collapseInfo @getTagInfo='getTagInfo'>
   
           </custom-header>
```
ref是必填项，要使用this.$refs[].openDialog的方式去打开弹窗
settings和collapseInfo是必传参数
```$xslt
settings:{
    key:'id'//每一个自定义列的唯一标识字段名
    lable:'name'//每一个自定列要显示的字段
}
```
```$xslt
collapseInfo: [
                    {
                        name: '属性指标', //组名称
                        IsAllCheck: true, //是够可以全选
                        checkAll: false,  //全选的初始化影视
                        isIndeterminate: true,//全选样式
                        checkedTarget: [],//传入必选项，如有默认选择项将其添加到这里,如:'时间1'
                        targetList: [ //自定义属性的数据,disabled是否禁用
                            {indexName: '时间',name: '时间1',disabled:false},
                            {indexName: '地点',name:'地点1'},
                            {indexName: '人物',name:'人物1'},
                            {indexName: '事件',name:'事件1'},
                        ],
                        relation:[ //关系字段
                            {
                                father:'时间1',
                                selectChildren:['地点1','事件1'],//选中'时间1时的必选项'
                                disableChildren:['地点1','人物1','事件1'] //未选中'时间1时的禁用项'
                            }
                        ]
                    },
                    {
                        name: '展示指标',
                        IsAllCheck: false,//没有全选选项
                        checkedTarget: [],
                        targetList: [
                            {indexName: '哈哈',name:'hahaahhh'},
                            {indexName: '呵呵',name:"hahahhah12"},
                            {indexName: '嘻嘻',nam:'ha'},
                            {indexName: '咯咯',name:'8889'},
                        ]
                    },
                ],
```
getTagInfo点击确定的方法，返回勾选的字段的数据数组