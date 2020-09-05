<template>
  <div class="cascader-panel-item">
    <div class="cascader-panel-item__list-item-header allcheck"
         :data-num="data.id">
      <el-checkbox class="cascader-panel-item__checkbox"
                   v-model="isAllCheck"
                   :disabled="isAllDisabled"
                   @change="handleAllCheckChange"></el-checkbox>
      <span class="cascader-panel-item__text"
            @click="handleAllSelected(!data.checked)"
            :class="{'cascader-panel-item__textChecked':isAllCheck }">{{data.text}}</span>
    </div>
    <div class="cascader-panel-item__content clearfix">
      <div class="cascader-panel-item__list-item"
           v-for="(item,index) in data.childNodes"
           v-show="!item.hide"
           :key="item.id"
           :class="getItemClass(item)"
           @click="handleSelect(item,index,$event)">
        <el-checkbox :disabled="item.disabled"
                     class="cascader-panel-item__checkbox"
                     v-model="item.checked"
                     v-show="showCheckBox"
                     @change="checked => handleChange(checked,item)"></el-checkbox>
        <span class="cascader-panel-item__text">{{item.text}}</span>
        <div class="sub-cascader-item"
             v-if="item.childNodes && item.childNodes.length">
          <cascader-item v-for="(subItem,subIndex) in item.childNodes"
                         class="cascader-panel-item__sub"
                         :key="subIndex"
                         :data="subItem.childNodes"
                         :level="item.level+1"
                         showCheckBox="true"
                         hasAllCheck="true"
                         @check="this.handleCheck"
                         @check-all="(checked,pid)=>this.handleAllCheck(checked, pid, index)">
          </cascader-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CascaderItem',
  props: {
    data: {
      type: Object
    },
    prop: {
      type: Object
    },
    level: {
      type: Number
    },
    showCheckBox: {
      type: Boolean,
      default: true
    },
    hasAllCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    };
  },
  computed: {
    isAllCheck: {
      get() {
        const result = this.data.childNodes.every(item => item.checked || item.hide);
        this._setAllChecked(result);
        return result;
      },
      set() {
        return false;
      }
    },
    isAllDisabled() {
      return this.data.childNodes.some(item => item.disabled);
    }
  },
  methods: {
    handleSelect({ id, childNodes }, index, e) {
      if (
        (e.target.matches('.el-checkbox__original') ||
          e.target.matches('.el-checkbox__inner')) &&
        (!childNodes || !childNodes.length)
      ) {
        return;
      }
      if (this.data.childNodes.find(item => item.id === id).disabled) {
        return;
      }
      // 如果是leaf节点，则相当于直接进行一次check
      if (!childNodes || !childNodes.length) {
        this.data.childNodes[index].checked = !this.data.childNodes[index].checked;
        this.$emit('check', this.data.childNodes[index].checked, id);
      }
    },
    // 设置全选属性
    _setAllChecked(b) {
      this.data.checked = b;
    },
    handleChange(checked, { id }) {
      this.$emit('check', checked, id);
    },
    getItemClass(item) {
      return item.selected && (item.childNodes && item.childNodes.length)
        ? 'is-select'
        : '';
    },
    handleAllCheckChange(checked) {
      this._setAllChecked(checked);
      this.data.childNodes.map(item => {
        if (!(item[this.prop.must] || item[this.prop.hidden])) {
          item.checked = checked;
        }
      });
      this.$emit('check-all', checked, this.data.id);
    },
    // 全选选择
    handleAllSelected(checked) {
      if (!this.isAllDisabled) {
        this.handleAllCheckChange(checked);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@prefix: cascader-panel-item;
.@{prefix} {
  padding: 0 10px;
  box-sizing: border-box;
}

.@{prefix}__list-item-header {
  display: flex;
  align-items: center;
  line-height: 40px;
  border-bottom: 1px solid #f9f9f9;
  .@{prefix}__text {
    font-weight: 700;
  }
}
.@{prefix}__content {
  overflow: auto;
}
.@{prefix}__list-item {
  position: relative;
  line-height: 36px;
  float: left;
  width: 50%;
  cursor: pointer;
  display: flex;
  // justify-content: space-between;
  &.is-select,
  &:hover {
    background: #f5fbff;
    z-index: 9;
  }
}

.@{prefix}__checkbox {
  // position: absolute;
  // margin-right: 10px;
}

.@{prefix}__text {
  font-size: 14px;
  color: #1c2438;
  letter-spacing: 0;
  // line-height: 12px;
  display: inline-block;
  max-width: 85%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 4px;
}

.@{prefix}__textChecked {
  color: #0590ff !important;
}
.@{prefix}__toright {
  // float: right;
  position: absolute;
  right: 5px;
}
</style>
