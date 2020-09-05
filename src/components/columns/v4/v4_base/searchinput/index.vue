<template>
  <div class="search-input"
       v-click-outside="onClickOutside">
    <div class="search-input__input-area">
      <input :class="`search-input__input search-input__${size} ${showButton ?'append-input':''}`"
             v-model="iptVal"
             :maxlength="max"
             :minlength="min"
             :placeholder="placeholder"
             @keyup.enter="searchEnter"
             @input="changeHandle" />
      <button :class="`search-input__button search-input__${size} ${showButton ? 'append-button':''}`"
              v-if="showButton"
              @click.stop="searchButton">搜索</button>

    </div>
    <div class="search-input__result-area"
         :style="resultTop"
         v-show="showResult">
      <div v-if="filterRes.length">
        <div class="search-input__result-item"
             v-for="(item,index) in filterRes"
             @click.stop="filterResClick(item,index)"
             v-html="item.html"
             :key="'item_'+index">

        </div>
      </div>
      <p v-else
         class="empty-default">{{emptyText}}</p>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import * as vClickOutside from 'v-click-outside-x';
Vue.use(vClickOutside);
export default {
  name: 'SearchInput',
  data() {
    return {
      iptVal: '',
      showResult: false,
      filterRes: []
    };
  },
  props: {
    // 占位符
    placeholder: {
      type: String,
      default: '请输入搜索名'
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 999999
    },
    size: {
      type: String,
      default: 'normal',
      validator: function (value) {
        return ['normal', 'small', 'mini'].includes(value);
      }
    },
    // 是否展示按钮
    showButton: {
      type: Boolean,
      default: true
    },
    // 搜索元数据
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 无搜索结果显示字符串
    emptyText: {
      type: String,
      default: '没有搜索结果'
    },
    prop: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'label'
        };
      }
    }
  },
  computed: {
    resultTop() {
      let res = '';
      switch (this.size) {
      case 'small':
        res = 'top:36px';
        break;
      case 'mini':
        res = 'top:32px';
        break;
      default:
        res = 'top:40px';
        break;
      }
      return res;
    }
  },
  methods: {
    // 回车搜索
    searchEnter() {
      this.search();
      this.$emit('enter', this.iptVal);
    },
    // 按钮搜索
    searchButton() {
      this.search();
      this.$emit('button-click', this.iptVal);
    },
    search() {
      if (typeof this.iptVal === 'string' && this.iptVal.length) {
        this.showResult = true;
        let res = this.privateFilter(this.iptVal);
        this.filterRes = res || [];
      }
    },
    // 更改输入内容
    changeHandle(v) {
      this.showResult = false;
      this.$emit('change', this.iptVal);
    },
    // 搜寻
    privateFilter(val) {
      let regStr = new RegExp(val);
      let result = [];
      this.data.forEach(item => {
        if (regStr.test(item[this.prop.label])) {
          let tmp = item[this.prop.label].split(val);
          let tmpList = [];
          tmp.map(v => {
            if (v.length) {
              tmpList.push(`<div class="search-label">${v}</div>`);
            } else {
              tmpList.push('');
            }
          });
          let dict = this.objDeepCopy(item);
          dict.html = tmpList.join(
            `<div class="search-label search-high-line">${val}</div>`
          );
          result.push(dict);
        }
      });
      return result;
    },
    // 过滤结果点击事件
    filterResClick(item, index) {
      this.filterRes.splice(index, 1);
      this.$emit('result-click', { data: item, index: index });
    },
    // 外部点击事件
    onClickOutside(event) {
      event.stopPropagation();
      this.showResult = false;
    },
    // 对象数组深克隆
    objDeepCopy(source) {
      var sourceCopy = source instanceof Array ? [] : {};
      for (var item in source) {
        if (source[item] == null) {
          sourceCopy[item] = null;
        } else {
          sourceCopy[item] =
            typeof source[item] === 'object'
              ? this.objDeepCopy(source[item])
              : source[item];
        }
      }
      return sourceCopy;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
* {
  margin: 0;
}

@baseClass: search-input;

.@{baseClass} {
  position: relative;
  width: 100%;
  .@{baseClass}__input-area {
    display: inline-flex;
    position: relative;
    width: 100%;
    .@{baseClass}__input {
      flex: 1;
      position: relative;
      margin: 0;
      list-style: none;
      background-image: none;
      padding: 5px 12px;
      border-radius: 4px;
      color: #333;
      font-size: 14px;
      font-weight: 400;
      background-color: #fff;
      border: 1px solid #dadfe3;
      outline: none;
      line-height: 26px;
      vertical-align: middle;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      &.@{baseClass}__small {
        line-height: 22px;
      }
      &.@{baseClass}__mini {
        line-height: 18px;
      }
      &.append-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
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
    .@{baseClass}__button {
      position: relative;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      touch-action: manipulation;
      cursor: pointer;
      background-image: none;
      color: #333;
      background-color: #f8f9fa;
      border: 1px solid #dadfe3;
      user-select: none;
      min-width: 100px;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 26px;
      border-radius: 4px;
      &.@{baseClass}__small {
        line-height: 22px;
      }
      &.@{baseClass}__mini {
        line-height: 18px;
      }
      &.append-button {
        margin-left: -1px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      &:hover {
        outline: none;
        text-decoration: none;
        color: #2f88ff;
        background-color: #f8f9fa;
        border-color: #2f88ff;
        z-index: 2;
      }
      &:hover {
        background-image: none;
        outline: none;
        z-index: 3;
        color: #1c68d9;
        background-color: #f8f9fa;
        border-color: #1c68d9;
      }
      &:focus {
        outline: none;
        text-decoration: none;
        color: #2f88ff;
        background-color: #f0f9ff;
        border-color: #2f88ff;
        z-index: 2;
      }
    }
  }
  .@{baseClass}__result-area {
    width: 100%;
    max-height: 255px;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    z-index: 10;
    position: absolute;
    left: 1px;
    .@{baseClass}__result-item {
      cursor: pointer;
      padding: 12px;
      line-height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      &:hover {
        background-color: #f8f8f8;
      }
      @{deep} .search-label {
        float: left;
        &.search-high-line {
          color: #2f88ff;
        }
      }
    }
    .empty-default {
      padding: 12px;
      line-height: 22px;
      color: #666;
      font-size: 14px;
    }
  }
}
</style>
