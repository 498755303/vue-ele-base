<template>
  <div class="sort-card-group">
    <template v-for="item in data">
      <div class="adesk-sort-card__item"
           :class="_curClass(item.value)"
           :key="item.value"
           @click.stop="_clickCell(item.value)">
        {{ item.label }}
        <span class="caret-wrapper">
          <i class="sort-caret ascending" @click.stop="_clickSort(item.value,2)"></i>
          <i class="sort-caret descending" @click.stop="_clickSort(item.value,1)"></i>
        </span>
      </div>
    </template>
  </div>

</template>

<script>
export default {
  name: "index.vue",
  props: {
    defaultData: {
      type: Object,
      default() {
        return {
          orderField: "",
          orderType: 0
        };
      }
    },
    data: {
      type: Array,
      default() {
        return [
          {
            label: "首次发现",
            id: 1,
            value: "first"
          },
          {
            label: "二次发现",
            id: 2,
            value: "second"
          }
        ];
      }
    }
  },
  data() {
    return {
      // 排序字段
      orderField: this.defaultData.orderField,
      // 排序类型 1降序 2升序 0默认
      orderType: this.defaultData.orderType
    };
  },
  methods: {
    _curClass(key) {
      const res = {};
      if (this.orderField === key) {
        switch (this.orderType) {
        case 1:
          res["descending"] = true;
          break;
        case 2:
          res["ascending"] = true;
          break;
        default:
          break;
        }
      }
      return res;
    },
    // 外部点击
    _clickCell(key) {
      if (this.orderField !== key) {
        this.orderType = 0;
      }
      this.orderField = key;
      if (this.orderType <= 0) {
        this.orderType = 2;
      } else {
        this.orderType--;
      }
      this.outEvent();
    },
    // 升降序点击
    _clickSort(key, t) {
      this.orderField = key;
      this.orderType = t;
    },
    // 对外暴露事件
    outEvent() {
      /**
       * 排序事件
       * @type {object[]} {orderField:string,orderType:string}
       */
      this.$emit("sort", {
        orderField: this.orderField,
        orderType: this.orderType
      });
    }
  }
};
</script>

<style scoped lang="less">
@baseW: 100px;
@baseH: 40px;
@borderC: #f0f0f0;
@hoverC: #eef4f9;
.adesk-sort-card__item {
  display: inline-block;
  width: @baseW;
  height: @baseH;
  line-height: @baseH;
  cursor: pointer;
  border: 1px solid @borderC;
  font-size: 13px;
  background-color: #fff;
  text-align: center;

  &:hover {
    background-color: @hoverC;
  }

  &:nth-child(2n-1) {
    border-right: 0;
  }

  &:last-child {
    border-right: 1px solid @borderC;
  }

  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: initial;
    position: relative;

    .sort-caret {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      position: absolute;
      left: 7px;

      &.ascending {
        border-bottom-color: #c0c4cc;
        top: 5px;
      }

      &.descending {
        border-top-color: #c0c4cc;
        bottom: 7px;
      }
    }
  }

  &.descending .sort-caret {
    &.descending {
      border-top-color: #409eff;
    }
  }

  &.ascending .sort-caret {
    &.ascending {
      border-bottom-color: #409eff;
    }
  }
}

</style>
