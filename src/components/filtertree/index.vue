<template>
  <el-dropdown placement="bottom-start"
               trigger="click"
               :hide-on-click="true"
               @visible-change="_visibleChange"
               ref="treeDrop">
    <div v-show="inputType==1"
         :style="inputStyle"
         @click="_clickHandle">
      <el-input v-model.trim="showVal"
                :size="size"
                :readonly="true"
                class="show-input"
                suffix-icon="el-icon-arrow-down">
      </el-input>
    </div>
    <div v-show="inputType==2"
         :style="inputStyle">
      <el-input v-model.trim="filterVal"
                :size="size"
                ref="filterVal"
                :readonly="false"
                class="filter-input"
                suffix-icon="el-icon-arrow-down">
      </el-input>
    </div>
    <el-dropdown-menu slot="dropdown"
                      class="tree-list-scroll">
      <el-dropdown-item>
        <el-scrollbar wrap-class="list"
                      :native="false"
                      tag="div">
          <el-tree class="authorizetree"
                   :data="treeData"
                   :props="treeProps"
                   :node-key="nodeKey"
                   :default-expand-all="defaultExpend"
                   ref="treeSelect"
                   empty-text="数据获取为空，请关闭重试"
                   :expand-on-click-node="false"
                   :check-on-click-node="true"
                   :highlight-current="true"
                   @node-click="nodeClick"
                   :filter-node-method="filterNode">
          </el-tree>
        </el-scrollbar>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  props: {
    // 输入框样式
    inputStyle: {
      type: String,
      default: "width:300px"
    },
    size: {
      type: String,
      validator(value) {
        return ["mini", "small", "normal"].includes(value);
      },
      default: "mini"
    },
    // 元数据
    treeData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 配置参数
    treeProps: {
      children: "childList",
      labe1l: "departmentName"
    },
    // 是否过滤节点
    canFilter: {
      type: Boolean,
      default: false
    },
    // 唯一索引
    nodeKey: {
      type: String,
      require: true
    },
    // 是否默认全部展开
    defaultExpend: {
      type: Boolean,
      default: true
    },
    // 当前节点
    value: {
      type: [String, Number],
      require: true
    }
  },
  data() {
    return {
      inputType: 1,
      showVal: "",
      filterVal: "",
      currentKey: this.value || ""
    };
  },
  methods: {
    // 节点点击
    nodeClick(v, node, se) {
      this.currentKey = v[this.nodeKey];
      this.showVal = v[this.treeProps.label];
      if (this.$refs.treeDrop && this.$refs.treeDrop.hide) {
        this.filterVal = "";
        this.$refs.treeDrop.hide();
      }
      this.$emit("change", v);
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true;
      return data[this.treeProps.label].indexOf(value) !== -1;
    },
    // 焦点触发
    _clickHandle() {
      this.inputType = 2;
      this.$nextTick(() => {
        this.$refs.filterVal.focus();
      });
    },
    // 展开隐藏处理
    _visibleChange(b) {
      if (!b) {
        this.inputType = 1;
        if (this.filterVal) {
          this.filterVal = "";
        }
      }
    },
    dfsTree(data, children, unique, uniqueKey) {
      let stark = [];
      stark = stark.concat(data);
      while (stark.length) {
        let temp = stark.shift();
        if (temp[children]) {
          stark = temp[children].concat(stark);
        }
        if (temp[uniqueKey] == unique) {
          return temp;
        }
      }
    },
    init(data, v) {
      let tmp = this.dfsTree(data, this.treeProps.children, v, this.nodeKey);
      this.showVal = tmp[this.treeProps.label];
    }
  },
  watch: {
    currentKey(nv, ov) {
      this.$emit("update:value", nv);
    },
    value: {
      handler(nv, ov) {
        this.currentKey = nv;
      },
      immediate: true
    },
    // 过滤
    filterVal(nv, ov) {
      if (this.$refs.treeSelect && this.canFilter) {
        this.$refs.treeSelect.filter(nv);
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
