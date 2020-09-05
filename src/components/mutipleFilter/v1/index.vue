<template>
  <dl class="adesk-multiple-filter">
    <dt>{{ label }}</dt>
    <dd :class="{'hasMore': hasMore,'multiple-filter-content':true}" ref="item">
      <template v-if="firstSetting.show">
        <div class="filter-item" :class="{active: !value.length}" @click="_clickHandle(firstSetting.item)">
          {{ firstSetting.item.label || '不限' }}
        </div>
      </template>
      <div v-for="(item, i) of data"
           :key="i"
           class="filter-item"
           :class="{active: value.includes(item[prop.value])}"
           @click="_clickHandle(item)">
        <div v-if="item[prop.icon]" class="item-img">
          <img :src="item[prop.icon]" alt="logo">
        </div>
        <span>{{ item[prop.label] }}</span>
      </div>
    </dd>
    <dd class="mutiple-filter-operate">
      <template v-if="showMore">
        <div v-if="hasMore" class="filter-more adesk-button" @click="hasMore = false">
          展开
        </div>
        <div v-else class="filter-more adesk-button" @click="hasMore = true">
          收起
        </div>
      </template>
    </dd>
  </dl>
</template>

<script>
/**
 * 支持 单选或多选
 * @author HL
 * @version v1
 * @displayName 复选表单项v1
 */
export default {
  props: {
    /**
     * 标题
     */
    label: {
      type: String,
      required: true
    },
    /**
     * 第一项设置(不限)
     */
    firstSetting: {
      type: Object,
      default() {
        return {
          // 展示名
          item: {
            label: "不限",
            id: "-1",
            value: "-1"
          },
          // 是否展示
          show: true
        };
      }
    },
    /**
     * 配置项
     */
    prop: {
      type: Object,
      default() {
        return {
          label: "label",
          key: "id",
          value: "value",
          icon: "icon"
        };
      }
    },
    /**
     * 数据选项
     */
    data: {
      type: Array,
      required: true
    },
    /**
     * 选项超过一行时默认是否展开
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * 选项超过一行时默认是否展开
     */
    open: {
      type: Boolean,
      default: false
    },
    /**
     * 单行文本高度
     */
    singleH: {
      type: Number,
      default: 50
    },
    /**
     * 绑定值,支持v-model
     * @model
     */
    value: {
      type: Array,
      required: true
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      hasMore: false,
      showMore: false,
      mapCache: {}
    };
  },
  mounted() {
    this._calcHeight();
  },
  watch: {
    list: {
      handler() {
        this.hasMore = false;
        this.showMore = false;
        this.$nextTick(() => {
          this._calcHeight();
        });
        this._generateMapCache();
      }
    }
  },
  methods: {
    _calcHeight() {
      let height = this.$refs.item.offsetHeight;
      if (height > this.singleH) {
        if (!this.open) this.hasMore = true;
        this.showMore = true;
      } else {
        this.hasMore = false;
        this.showMore = false;
      }
    },
    /**
     * 重置
     * @public
     */
    reset() {
      this.value = [];
    },
    // 点击处理
    _clickHandle(item) {
      const val = this.prop.value;
      let valueCopy = this.value;
      if (item[val] === this.firstSetting.item.value) {
        valueCopy = [];
      } else {
        if (this.multiple) {
          let i = valueCopy.indexOf(item[val]);
          if (i > -1) {
            valueCopy.splice(i, 1);
          } else {
            valueCopy.push(item[val]);
          }
        } else {
          const i = valueCopy.indexOf(item[val]);
          if (i > -1) {
            valueCopy = [];
          } else {
            valueCopy = [item[val]];
          }
        }
      }
      this._eventChange(valueCopy);
    },
    // 生成Map缓存
    _generateMapCache() {
      this.mapCache = {};
      this.data.forEach(item => {
        this.mapCache[item[this.prop.value]] = item;
      });
    },
    // 根据已选生成List<Item>
    _generateSelectedList(list) {
      if (Object.keys(this.mapCache).length === 0) {
        this._generateMapCache();
      }
      let res = [];
      const operateList = list && list.length ? list : this.value;
      operateList.forEach(val => {
        this.mapCache[val] && res.push(this.mapCache[val]);
      });
      return res;
    },
    // 对外change事件
    _eventChange(list) {
      /**
       * 改变事件
       * @type {Number[]} list
       */
      this.$emit('change', list);
    },
    /**
     * 获取当前选中项
     * @param list
     * @public
     */
    getChecked(list) {
      return this._generateSelectedList(list);
    }
  }
};
</script>

<style lang='less' scoped>
@primaryC: #409EFF;
@activeC: #ecf5ff;
.adesk-multiple-filter {

  display: flex;
  align-items: flex-start;

  dt {
    margin-right: 10px;
    white-space: nowrap;
    text-align: right;
    min-width: 70px;
  }

  .multiple-filter-content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    padding-right: 48px;

    &.hasMore {
      height: 27px;
      overflow: hidden;
    }

    .filter-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 5px;
      margin: 0 6px 6px 0;
      cursor: pointer;
      border: 1px solid #fff;
      border-radius: 2px;

      .item-img {
        width: 20px;
        height: 20px;
        margin: 0 4px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &.active {
        color: @primaryC;
        background: @activeC;
        border-color: @primaryC;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
      }
    }

    .more {
      position: absolute;
      right: 0;
      top: 0;
      color: @primaryC;
      cursor: pointer;
    }
  }

  .mutiple-filter-operate {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}

.adesk-button {
  height: 23px;
  line-height: 23px;
  border: 1px solid #DDD;
  padding: 0 15px;
  position: relative;
  background: #fff;
  color: #333;
  margin: 0 5px;
  border-radius: 13px;
  cursor: pointer;

  &:hover {
    color: @primaryC;
    border-color: @primaryC;
  }

  &.active {
    background-color: @primaryC;
    color: #fff;
  }
}
</style>
