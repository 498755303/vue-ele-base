
<template>
  <div class="cascader-panel-sub">
    <div class="cascader-panel-item__header">{{title}}</div>
    <div class="cascader-panel-item__content">
      <template v-if="data && data.length">
        <div class="cascader-panel-item__list-item"
             v-for="(item,index) in data"
             :key="item.id"
             :class="getItemClass(item)"
             @click.stop="handleSelect(item,index,$event)">
          <div class="cascader-panel-item__list-item-main">
            <el-checkbox :disabled="item.disabled"
                         class="cascader-panel-item__checkbox"
                         v-model="item.checked"
                         :indeterminate="item.indeterminate"
                         @click.stop.native="_handleCheckClick(item)"
                         @change="checked => handleChange(checked,item)"></el-checkbox>
            <span class="cascader-panel-item__list-item-label">{{item.text}}</span>
          </div>
          <div class="cascader-panel-item__list-item-sub clearfix">
            <div class="cascader-panel-item__list-item-sub-item"
                 v-for="(subItem,subIndex) in item.childNodes"
                 :key="'sub_'+subIndex">
              <el-checkbox :disabled="subItem.disabled"
                           class="cascader-panel-item__checkbox"
                           v-model="subItem.checked"
                           :indeterminate="subItem.indeterminate"
                           @click.stop.native="_handleCheckClick(subItem)"
                           @change="checked => handleChange(checked,subItem)"></el-checkbox>
              <span class="cascader-panel-item__list-item-label">{{subItem.text}}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="cascader-panel-item__list-item-default">
          <p>暂无数据</p>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "CascaderItem",
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handleSelect({ id, childNodes, selected, checked, disabled }, index, e) {
      if (
        (e.target.matches(".el-checkbox__original") ||
          e.target.matches(".el-checkbox__inner")) &&
        (!childNodes || !childNodes.length)
      ) {
        return;
      }
      if (disabled) return;
      // 如果是leaf节点，则相当于直接进行一次check
      if (!childNodes || !childNodes.length) {
        this.$emit("check", !checked, id);
      }
    },
    handleChange(checked, { id }) {
      this.$emit("check", checked, id);
    },
    getItemClass(item) {
      return item.selected && (item.childNodes && item.childNodes.length)
        ? "is-select"
        : "";
    },
    _handleCheckClick({ id }) {
      this.$emit("check-click", id);
    }
  }
};
</script>
<style lang="less" scoped>
@prefix: cascader-panel-item;
.cascader-panel-sub {
  min-width: 410px;
}
.@{prefix} {
  background-color: #fff;
  border: 1px solid #dddee1;
  min-width: 100px;
}
.@{prefix}__header {
  letter-spacing: 0;
  border-bottom: 1px solid #dee4f5;
  background-color: #fafbfe;
  font-size: 13px;
  padding: 0 12px;
  line-height: 36px;
}
.@{prefix}__content {
  overflow: auto;
  height: calc(100% - 48px);
  font-size: 13px;
  border-left: 1px solid #dee4f5;
}
.@{prefix}__list-item {
  position: relative;
  display: flex;
  padding: 0 10px;
  line-height: 36px;
  cursor: pointer;

  border-bottom: 1px dashed #c9c9c9;
  &.is-select,
  &:hover {
    background: #f5fbff;
    z-index: 9;
  }
}
.@{prefix}__list-item-main {
  display: flex;
  min-width: 100px;
  font-weight: 700;
  margin-right: 50px;
}
.@{prefix}__list-item-label {
  margin-left: 5px;
}
.@{prefix}__list-item-default {
  p {
    line-height: 30px;
    color: #ccc;
    padding: 10px;
    box-sizing: border-box;
  }
}
.@{prefix}__checkbox {
  // position: absolute;
  // margin-right: 10px;
}

.@{prefix}__text {
  font-size: 13px;
  letter-spacing: 0;
  // line-height: 12px;
  display: inline-block;
  max-width: 85%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.@{prefix}__textChecked {
  color: #0590ff !important;
}
.@{prefix}__toright {
  // float: right;
  position: absolute;
  right: 5px;
}
.@{prefix}__list-item-sub {
  .@{prefix}__list-item-sub-item {
    float: left;
    margin-left: 15px;
  }
}
</style>
