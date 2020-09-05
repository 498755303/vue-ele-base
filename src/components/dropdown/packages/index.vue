<template>
  <div class="hl-dropdown"
       v-clickoutside="onClickoutside"
       @mouseenter="handleMouseenter"
       @mouseleave="handleMouseleave">
    <div class="hl-dropdown__filter">
      <div v-if="type == 'button'"
           @click.stop="headerClick"
           @mouseenter="handleMouseenter">
        <button :class="{'hl-button':true}">
          <slot name="titleIcon"></slot>
          <span>{{titleTrans}}
            <i v-if="showArrow"
               :class="{'iconfont icon-arrow':true,'active':active}"></i>
          </span>
        </button>
      </div>
      <div v-else
           class="hl-dropdown__filter-text"
           @click.stop="headerClick"
           @mouseenter="handleMouseenter">
        <slot name="titleIcon"></slot>
        <div class="hl-dropdown__title">
          {{titleTrans}}
          <i v-if="showArrow"
             :class="{'iconfont icon-arrow':true,'active':active}"></i>
        </div>
      </div>
    </div>
    <transition :name="`slide-fade-${placement}`">
      <div v-show="active"
           :class="{'hl-dropdown__downItems':true,'active-bottom':placement=='bottom','active-top':placement=='top'} ">
        <ul>
          <li v-for="(item,index) in data"
              :class="{'hl-dropdown__downItem':true,'is-disabled':item.disabled,'is-select':curVal && curVal == item[props.key]}"
              :key="item[props.key]"
              v-html="item[props.label]"
              @click.stop="itemClickHandle(item,index)">
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'hlDropdown',
  props: {
    // 当前选择的key对应值
    value: {
      type: [Number, String]
    },
    // 标题类型
    type: {
      type: String,
      validator(value) {
        return ['input', 'text', 'button'].includes(value);
      },
      default: 'text'
    },
    // 标题文字
    title: {
      type: String
    },
    // 是否展示选中项
    showSelected: {
      type: Boolean,
      default: false
    },
    // 是否显示箭头
    showArrow: {
      type: Boolean,
      default: true
    },
    // 触发方式
    trigger: {
      type: String,
      default: 'hover',
      validator(value) {
        return ['hover', 'click'].includes(value);
      }
    },
    // 展开延迟
    showTimeout: {
      type: Number,
      default: 0
    },
    // 关闭延迟
    hideTimeout: {
      type: Number,
      default: 0
    },
    // 菜单数据源
    data: {
      type: Array,
      required: true
    },
    // 配置项
    props: {
      type: Object,
      default: function() {
        return {
          key: 'id',
          label: 'label',
          disabled: 'disabled'
        };
      }
    },
    // 菜单出现位置
    placement: {
      type: String,
      validator(value) {
        return ['top', 'bottom'].includes(value);
      },
      default: 'bottom'
    },
    // 点击项之后隐藏菜单
    hideOnClick: {
      type: Boolean,
      default: true
    },
    // 是否移出隐藏
    hideOnLeave: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      prefixCls: 'hl-dropdown',
      curVal: this.value || '',
      active: false,
      // 展开定时器
      showTimer: null,
      // 关闭定时器
      hideTimer: null
    };
  },
  computed: {
    // 最终展示的标题
    titleTrans() {
      if (this.showSelected) {
        let tmp = this.privateFilterLabel(this.curVal);
        return tmp ? tmp[this.props.label] : '';
      } else {
        return this.title;
      }
    }
  },
  methods: {
    // 标题点击事件
    headerClick() {
      if (this.trigger !== 'click') return false;
      this.privateExpendDrop();
    },
    handleMouseenter() {
      if (this.trigger !== 'hover') return false;
      this.privateExpendDrop();
    },
    handleMouseleave() {
      if (this.hideOnLeave) {
        this.privateCollapseDrop();
      }
    },
    // 每项点击事件
    itemClickHandle(item) {
      if (this.curVal != item[this.props.key]) {
        this.curVal = item[this.props.key];
        this.$emit('change', item);
      }
      this.$emit('command', item);
      if (this.hideOnClick) {
        this.privateCollapseDrop();
      }
    },
    // 点击外部事件
    onClickoutside() {
      this.privateCollapseDrop();
    },
    // 展开菜单
    privateExpendDrop() {
      if (this.showTimeout > 0) {
        if (this.showTimer) clearTimeout(this.showTimer);
        this.showTimer = setTimeout(() => {
          this.active = true;
        }, this.showTimeout);
      } else {
        this.active = true;
      }
    },
    // 收起菜单
    privateCollapseDrop() {
      if (this.hideTimeout > 0) {
        if (this.hideTimer) clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(() => {
          this.active = false;
        }, this.hideTimeout);
      } else {
        this.active = false;
      }
    },
    // 根据key获取选中项label
    privateFilterLabel(keyV) {
      return this.data.find(v => {
        return v[this.props.key] == keyV;
      });
    }
  },
  watch: {
    active(nv, ov) {
      if (nv != ov) {
        this.$emit('visibleChange', nv);
      }
    },
    curVal(nv, ov) {
      this.$emit('update:value', nv);
    },
    value(nv, ov) {
      this.curVal = nv;
    }
  }
};
</script>
<style scoped>
@import "../font/iconfont.css";
</style>
<style lang="less">
ul,
ol,
li,
dt,
dd {
  list-style: none;
}
* {
  margin: 0;
  padding: 0;
}
</style>
<style lang="less">
.hl-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  &:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  &.primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
}
</style>
<style scoped lang="less">
@baseClass: hl-dropdown;
@activeColor: #409eff;
.@{baseClass} {
  width: 100%;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  .@{baseClass}__filter {
    .@{baseClass}__filter-text {
      cursor: pointer;
      height: 20px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 16px;
      &:hover {
        color: @activeColor;
      }
      .@{baseClass}__title {
        font-size: 12px;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .iconfont {
        font-size: 14px;
        transition: transform 300ms linear;
        &.active {
          transform: rotate(180deg);
        }
      }
    }
  }
  .@{baseClass}__downItems {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 996;
    min-width: 100%;
    background-color: #fff;
    padding-top: 4px;
    -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    overflow: hidden;
    &.active-bottom {
      top: 102%;
    }
    &.active-top {
      bottom: 150%;
    }
    .@{baseClass}__downItem {
      cursor: pointer;
      white-space: nowrap;
      color: #333;
      line-height: 22px;
      padding: 6px 12px;
      font-size: 14px;
      &:hover {
        background-color: #edf1f5;
      }
      &.is-select {
        color: @activeColor;
      }
      &.is-disabled {
        cursor: default;
        color: #bbb;
        pointer-events: none;
      }
    }
  }
}
</style>
<style lang="less">
.slide-fade-bottom-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-bottom-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-bottom-enter {
  transform-origin: 0 0;
  transform: scaleY(0.8);
  opacity: 0;
}
.slide-fade-bottom-leave-to {
  transform-origin: -100% -100%;
  transform: scaleY(0.8);
  opacity: 0;
}
.slide-fade-top-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-top-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-top-enter {
  transform-origin: 100% 100%;
  transform: scaleY(0.8);
  opacity: 0;
}
.slide-fade-top-leave-to {
  transform-origin: 0 0;
  transform: scaleY(1);
  opacity: 0;
}
</style>
