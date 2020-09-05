<template>
  <div class="cas-select-panel">
    <div class="cas-select-panel__header">
      <div class="cas-select-panel__title">{{title}}</div>
      <div class="cas-select-panel__clear"
           v-if="!setting.onlyRead"
           @click="handleClearAll">清空</div>
    </div>
    <div class="cas-select-panel__content">
      <div class="cas-select-panel__item-filter">
        <el-input v-model.trim="filterVal"
                  size="mini"
                  :placeholder="setting.placeholder"
                  clearable></el-input>
      </div>
      <div class="cas-select-panel__item-wrap">
        <div class="cas-select-panel__item"
             v-for="item in showData"
             :key="item.id">
          <!-- <span class="cas-select-panel__item-text">{{item[setting.label]}}</span> -->
          <span class="cas-select-panel__item-text"
                :title="_calcText(item)">{{_calcText(item)}}</span>

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
  props: {
    data: {
      type: Array
    },
    title: {
      type: String,
      default: '已选'
    },
    setting: {
      default: function () {
        return {
          label: 'text',
          key: 'id',
          returnType: "id",
          disabledKey: "disabled",
          onlyRead: false,
          placeholder: "请输入内容"
        };
      }
    }
  },
  data() {
    return {
      filterVal: ""
    }
  },
  computed: {
    showData() {
      return this.data.filter(v => {
        return this._calcText(v).indexOf(this.filterVal) > -1;
      })
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
    // 计算显示文字
    _calcText(item) {
      const data = item.data || item;
      let tmp = this.setting.label;
      if (tmp.indexOf("text") > -1) {
        return item["text"];
      } else {
        let tmpList = tmp.split('+');
        let res = '';
        tmpList.forEach((v, i) => {
          if (data[v]) {
            if (i != 0) {
              res = res + '(';
            }
            data[v] && (res = res + data[v]);
            if (i != 0) {
              res = res + ')';
            }
          }
        });
        return res;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@prefix: cas-select-panel;
.@{prefix} {
  background-color: #fff;
  border: 1px solid #dee4f5;
  border-radius: 2px;
  height: 100%;
  margin-left: 10px;
}

.@{prefix}__header {
  display: flex;
  justify-content: space-between;
  letter-spacing: 0;
  border-bottom: 1px solid #dee4f5;
  background-color: #fafbfe;
  font-size: 12px;
  padding: 0 12px;
  line-height: 36px;
}

.@{prefix}__clear {
  color: blue;
  cursor: pointer;
}

.@{prefix}__content {
  padding: 10px;
  overflow: auto;
  height: calc(100% - 48px);
  box-sizing: border-box;
}

.@{prefix}__item {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  background: #f8f8f8;
  cursor: pointer;
  margin: 10px 0;
}
.@{prefix}__item-remove {
  cursor: pointer;
}
</style>
