<template>
  <div class="tab-list-wrap">
    <div v-for="item in tablist"
         :key="'tab_'+item.id"
         :class="curActive===item.id?'active '+activeClass:''"
         @click="checkTab(item)">{{item.label}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 数据源
    tablist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 当前选择项
    value: {
      type: [Number, String]
    },
    activeClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      curActive: this.value
    };
  },
  methods: {
    checkTab(item) {
      this.curActive = item.id;
      this.$emit("check", item);
    }
  },
  watch: {
    value(val) {
      this.curActive = val;
    },
    curActive(val) {
      this.$emit("update:value", val);
    }
  }
};
</script>
<style lang="less" scoped>
@btnFontSize: 14px;
@btnBgc: #199ed8;
@btnW: 150px;
@btnH: 30px;
.tab-list-wrap {
  div {
    display: inline-block;
    width: @btnW;
    height: @btnH;
    line-height: @btnH;
    text-align: center;
    font-size: @btnFontSize;
    cursor: pointer;
    box-shadow: 0 5px 8px 0 rgba(81, 84, 99, 0.21);

    &.active {
      background-color: @btnBgc;
      color: #fff;
    }
  }
}
</style>
