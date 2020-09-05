<template>
  <div class="org-tree-wrap">
    <div class="org-tree"
         :class="{horizontal, collapsable}">
      <vue-org :data.sync="data"
               :props="props"
               :selectedId="selectedId"
               :horizontal="horizontal"
               :label-width="labelWidth"
               :collapsable="collapsable"
               :selectedClassName="selectedClassName"
               :render-content="renderContent"
               :default-expand-all="defaultExpandAll"
               :label-class-name="labelClassName"
               @expand-change="_expandChange"
               @node-click="_nodeClick"
               @contextmenu-click="_contextmenuClick" />
    </div>
  </div>
</template>

<script>
import render from "./node";
import { setExpand, remove, dfsTree, append } from "./util";
export default {
  name: "VueOrgWrap",
  components: {
    VueOrg: {
      render,
      functional: true
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    props: {
      type: Object,
      default: () => ({
        unique: "id",
        label: "label",
        expand: "expand",
        children: "children"
      })
    },
    expandOnClickNode: {
      type: Boolean,
      default: false
    },
    selectOnClickNode: {
      type: Boolean,
      default: true
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    collapsable: {
      type: Boolean,
      default: false
    },
    renderContent: Function,
    labelWidth: [String, Number],
    labelClassName: [Function, String],
    selectedClassName: [Function, String]
  },
  data() {
    return {
      selectedId: ""
    };
  },
  methods: {
    // 展开和关闭方法
    _expandChange(e, data) {
      e.stopPropagation();
      data.expand = !data.expand;
      this.$emit("expand-change", e, data);
    },
    // label点击事件
    _nodeClick(e, data) {
      e.stopPropagation();
      this.expandOnClickNode && this._expandChange(e, data);
      this.selectOnClickNode && this.setSelectedNode(data[this.props.unique]);
      this.$emit("node-click", e, data);
    },
    _contextmenuClick(e, data) {
      e.stopPropagation();
      e.preventDefault();
      this.$emit("node-contextmenu", e, data);
    },
    // 设定选中项
    setSelectedNode(unique, flag = true) {
      this.selectedId = flag || "";
    },
    // 获取当前选中节点
    getSelectedNode() {
      return dfsTree(
        [this.data],
        this.props.children,
        this.selectedId,
        this.props.unique
      );
    },
    // 获取当前选中Key
    getSelectedKey() {
      return this.selectedId;
    },
    // 根据unique 获取节点
    getNode(unique) {
      return dfsTree(
        [this.data],
        this.props.children,
        unique,
        this.props.unique
      );
    },
    // 删除某个节点
    removeNode(unique) {
      remove(this.data, this.props, unique);
    },
    // 节点追加子节点
    appendNode(data, unique) {
      append(this.data, this.props, unique, data, 1);
    },
    // 节点前加入节点
    insertBefore(data, unique) {
      append(this.data, this.props, unique, data, 2);
    },
    // 节点后加入节点
    insertAfter(data, unique) {
      append(this.data, this.props, unique, data, 3);
    }
  },
  created() {
    if (this.defaultExpandAll) {
      this.data = setExpand(this.data, this.props);
    }
  }
};
</script>

<style scoped lang="less">
@import "./org.less";
</style>
