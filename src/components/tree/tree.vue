<template>
    <div class="bc-tree">
        <el-input placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>
        <el-tree :data="treeDt"
                 :props="defaultProps"
                 ref="tree2"
                 node-key="id"
                 default-expand-all
                 empty-text="数据为空"
                 :expand-on-click-node="false"
                 :check-on-click-node="true"
                 :highlight-current="true"
                 :filter-node-method="filterNode"
                 @node-click="handleNodeClick">
        </el-tree>
    </div>

</template>
<script>
export default {
  data () {
    return {
      filterText: '',
      treeDt: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: '1.1',
              label: '二级 1-1',
              children: [
                {
                  id: '1.1.1',
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          id: '2',
          label: '一级 2',
          children: [
            {
              id: '2.1',
              label: '二级 2-1',
              children: [
                {
                  id: '2.1.1',
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  //   过滤
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val);
    }
  },
  methods: {
    //   节点点击事件
    handleNodeClick (v) {
      console.log(v);
    },
    // 过滤方法
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
  //   原型里面的新建文件夹 通过dialog保存后 刷新treeDt数据
};
</script>
