<!--
 * @Description: 增加多选展示框
 * @LastEditors: HL
 * @LastEditTime: 2020-06-30 16:00:29
-->
<template>
  <div class="cas-select-panel">
    <div class="cas-select-panel__header">
      <div class="cas-select-panel__title">{{title}}</div>
      <div class="cas-select-panel__title-operate">
        <el-checkbox class="cas-select-panel__checkbox"
                     v-model="allChecked"
                     :true-label="1"
                     :false-label="0"
                     v-if="!setting.onlyRead && setting.showCheckBox"
                     @change="_handleChangeAll">{{setting.checkLabel}}
        </el-checkbox>
        <div class="cas-select-panel__clear"
             v-if="!setting.onlyRead"
             @click="handleClearAll">清空
        </div>
      </div>
    </div>
    <div class="cas-select-panel__content">
      <div class="cas-select-panel__item"
           v-for="item in data"
           :key="item.id">
        <span class="cas-select-panel__item-text"
              :title="_calcText(item)">{{_calcText(item)}}</span>
        <div class="cas-select-panel__item-operate">
          <el-checkbox class="cas-select-panel__checkbox"
                       v-if="!setting.onlyRead && setting.showCheckBox"
                       v-model="item[setting.checked]"
                       :true-label="1"
                       :false-label="0"
                       @change="v=>_handleChange(v,item)">
            {{item[setting.checked] == 1? setting.checkedLabel :setting.noCheckedLabel}}
          </el-checkbox>
          <span class="cas-select-panel__item-remove"
                v-if="!item[setting.disabledKey || 'disabled'] && !setting.onlyRead"
                @click="handleRemove(item)">x</span>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CasSelectPanel',
  data() {
    return {
      allChecked: false
    };
  },
  props: {
    data: {
      type: Array
    },
    title: {
      type: String,
      default: '已选'
    },
    setting: {
      default() {
        return {
          label: 'text',
          key: 'id',
          returnType: "id",
          disabledKey: "disabled",
          onlyRead: false,
          checked: 'bindData',
          showCheckBox: false,
          checkLabel: "关联数据",
          checkedLabel: "已关联",
          noCheckedLabel: "未关联"
        };
      }
    }
  },
  methods: {
    handleClearAll() {
      if (this.setting.onlyRead) return;
      let result;
      if (this.setting.returnType === "item") {
        result = this.data;
      } else {
        result = this.data.map(item => {
          if (!item[this.setting.disabledKey || "disabled"]) {
            return item[this.setting.key];
          }
        });
      }
      this.$emit('clear-all', result);
    },
    handleRemove(item) {
      if (this.setting.onlyRead) return;
      if (this.setting.returnType === "item") {
        this.$emit('remove', item);
      } else {
        this.$emit('remove', item[this.setting.key]);
      }
    },
    // 全选
    _handleChangeAll(v) {
      this.data.map(item => {
        item[this.setting.checked] = v;
      });
    },
    // 计算显示文字
    _calcText(item) {
      let tmp = this.setting.label;
      let tmpList = tmp.split('+');
      let res = '';
      tmpList.forEach((v, i) => {
        if (item[v]) {
          if (i != 0) {
            res = res + '(';
          }
          item[v] && (res = res + item[v]);
          if (i != 0) {
            res = res + ')';
          }
        }
      });
      return res;
    },
    // 单选
    _handleChange(v, item) {
      item[this.setting.checked] = v;
      this.$forceUpdate();
      let count = 0;
      this.data.forEach(val => {
        if (val[this.setting.checked]) {
          count++;
        }
      });
      if (count === this.data.length) {
        this.allChecked = 1;
      } else {
        this.allChecked = 0;
      }
    },
    init(v) {
      this.allChecked = v ? 1 : 0;
    }
  }
};
</script>
<style lang="less" scoped>
  @import "./select.less";
</style>
