<template>
  <div class="range-select"
       v-clickoutside:ignoreclickoutside="onClickOutside">
    <div :class="`range-select__select-area ${size} ignoreclickoutside`"
         @click.stop="selectClick">
      <div :class="`range-select__select-placeholder ${size}`"
           v-if="!value">{{placeholder}}</div>
      <div :class="`range-select__select-value ${size}`"
           v-else>{{value}}</div>
      <div :class="`range-select__select-icon el-icon-arrow-down ${size} ${showDrop?'active':''}`"></div>
    </div>
    <div class="range-select__pannel-area ignoreclickoutside"
         v-show="showDrop">
      <div :class="`pannel-left ${ selectIndex>=0 ?'showVal':''}`">
        <div :class="`type-item ${ selectIndex == index ? 'active': ''}`"
             v-for="(item,index) in data"
             :key="'type_'+item[prop.key]"
             @click.stop="itemClick(item,index)">
          <span>{{item.label}}</span>
          <span class="el-icon-arrow-right"></span>
        </div>
      </div>
      <div class="pannel-value"
           v-if="selectIndex>=0">
        <div class="input-area clearfix">
          <div class="input-wrap">
            <el-form :model="ruleform"
                     @submit.native.prevent
                     :rules="rules"
                     ref="ruleForm"
                     class="demo-ruleform">
              <el-form-item prop="panelVal">
                <el-input v-model="ruleform.panelVal"
                          clearable
                          :size="size"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span class="input-label"
                v-if="settings.label">{{settings.label}}</span>
        </div>
        <div class="apply-btn">
          <el-button type="primary"
                     class="apply-btn-primary"
                     @click.stop="okHandle">应用</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RangeSelect',
  props: {
    // 传入值
    val: {
      type: [Object]
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 尺寸
    size: {
      type: String,
      default: 'normal',
      validator: function(value) {
        return ['large', 'normal', 'small', 'mini'].includes(value);
      }
    },
    // 左侧筛选类别数据
    data: {
      type: Array,
      default: () => {
        return [
          {
            key: '2',
            label: '小于'
          },
          {
            key: '1',
            label: '大于'
          }
        ];
      }
    },
    // 设置
    prop: {
      type: Object,
      default: () => {
        return {
          key: 'key',
          label: 'label'
        };
      }
    },
    settings: {
      type: Object,
      default: () => {
        return {
          label: ''
        };
      }
    },
    validateVal: {
      type: Function,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      showDrop: false,
      value: '', // 显示框的值
      ruleform: {
        panelVal: '' // 输入框输入的值
      },
      rules: {
        panelVal: [{ validator: this.validateVal, trigger: 'blur' }]
      },
      selectItem: null,
      selectIndex: -1
    };
  },
  methods: {
    // 根据参数生成显示的值
    _generateValue() {
      this.selectItem = this.val ? this.val.item || null : null;
      if (this.val && (this.val.index || this.val.index === 0)) {
        this.selectIndex = this.val.index;
      } else {
        this.selectIndex = -1;
      }
      this.ruleform.panelVal = this.val ? this.val.value || '' : '';
      if (this.selectIndex >= 0 && this.ruleform.panelVal) {
        this.value = `${this.data[this.selectIndex].label} ${this.ruleform.panelVal} ${this.settings.label}`;
      } else {
        this.value = '';
      }
    },
    // 外部点击事件
    onClickOutside(event) {
      this.showDrop = false;
    },
    // 下拉框点击事件
    selectClick() {
      this.showDrop = !this.showDrop;
    },
    // 下拉选项点击事件
    itemClick(item, index) {
      this.selectItem = item;
      this.selectIndex = index;
    },
    // 确认
    okHandle() {
      let labelValue;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.selectIndex >= 0 && this.ruleform.panelVal) {
            labelValue = `${this.data[this.selectIndex].label} ${this.ruleform.panelVal} ${this.settings.label}`;
          } else {
            labelValue = '';
          }
          this.value = labelValue || '';
          this.showDrop = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 清空
    clearVal() {
      Object.assign(this.$data, this.$options.data());
    }
  },
  created() {
    this.value = '';
  },
  watch: {
    val: {
      handler(nv, ov) {
        if (nv != ov) {
          this._generateValue();
        }
      },
      deep: true
    },
    value(nv, ov) {
      this.$emit('update:val', {
        item: this.selectItem,
        index: this.selectIndex,
        value: this.ruleform.panelVal
      });
    },
    showDrop(nv, ov) {
      if (!nv && !this.value) {
        this.selectItem = null;
        this.selectIndex = -1;
        this.ruleform.panelVal = '';
      } else if (nv && this.value) {
        if (this.val && this.val.value) {
          this.ruleform.panelVal = this.val.value;
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
@baseClass: range-select;
@deep: ~">>>";
* {
  margin: 0;
}
@largeH: 40px;
@normalH: 36px;
@smallH: 32px;
@miniH: 29px;
@iconW: 15px;
.@{baseClass} {
  width: 100%;
  min-width: 200px;
  text-align: left;
  position: relative;
  .@{baseClass}__select-area {
    height: @normalH;
    width: 100%;
    border: 1px solid #dadfe3;
    border-radius: 4px;
    padding: 0 12px;
    cursor: pointer;
    font-size: 14px;
    line-height: 23px;
    position: relative;
    box-sizing: border-box;
    .@{baseClass}__select-placeholder {
      color: #c1c1c1;
      &.large {
        line-height: @largeH;
      }
      &.normal {
        line-height: @normalH;
      }
      &.small {
        line-height: @smallH;
      }
      &.mini {
        line-height: @miniH;
      }
    }
    .@{baseClass}__select-value {
      color: #333;
      width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: @normalH;
      &.large {
        line-height: @largeH;
      }
      &.normal {
        line-height: @normalH;
      }
      &.small {
        line-height: @smallH;
      }
      &.mini {
        line-height: @miniH;
      }
    }
    .@{baseClass}__select-icon {
      transition: transform 0.2s linear;
      position: absolute;
      width: @iconW;
      height: @iconW;
      color: #c0c4cc;
      &.large {
        top: calc((@largeH - @iconW) / 2);
      }
      &.normal {
        top: calc((@normalH - @iconW) / 2);
      }
      &.small {
        top: calc((@smallH - @iconW) / 2);
      }
      &.mini {
        top: calc((@miniH - @iconW) / 2);
      }
      right: 5px;
      &.active {
        transform: rotate(180deg);
      }
    }
    &.large {
      height: @largeH;
    }
    &.normal {
      height: @normalH;
    }
    &.small {
      height: @smallH;
    }
    &.mini {
      height: @miniH;
    }
    &:hover {
      border-color: #2f88ff;
      z-index: 2;
    }
    &:actived {
      border-color: #2f88ff;
      -webkit-box-shadow: 0 0 0 2px rgba(47, 136, 255, 0.2);
      box-shadow: 0 0 0 2px rgba(47, 136, 255, 0.2);
      z-index: 2;
    }
    &:focus {
      border-color: #2f88ff;
      -webkit-box-shadow: 0 0 0 2px rgba(47, 136, 255, 0.2);
      box-shadow: 0 0 0 2px rgba(47, 136, 255, 0.2);
      z-index: 2;
    }
  }
  .@{baseClass}__pannel-area {
    min-width: 80px;
    width: 100%;
    min-width: 300px;
    height: 200px;
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    border-radius: 0px 0px 2px 2px;
    z-index: 10;
    position: absolute;
    top: calc(@normalH + 2px);
    left: 1px;
    display: -webkit-flex;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    &.large {
      top: calc(@largeH + 2px);
    }
    &.normal {
      top: calc(@normalH + 2px);
    }
    &.small {
      top: calc(@smallH + 2px);
    }
    &.mini {
      top: calc(@miniH + 2px);
    }

    .pannel-left {
      flex: 1;
      height: 100%;
      overflow: hidden;
      .type-item {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 14px;
        line-height: 38px;
        cursor: pointer;
        padding: 0 12px;
        color: #333;
        &.active {
          color: #2f88ff;
        }
      }
      &.showVal {
        border-right: #e4e9ed 1px solid;
      }
    }
    .pannel-value {
      flex: 2;
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      .input-area {
        .demo-ruleform {
          float: left;
          width: 140px;
        }
        .input-label {
          float: left;
        }
      }
      .apply-btn {
        position: absolute;
        bottom: 12px;
        text-align: right;
      }
    }
  }
}
</style>
