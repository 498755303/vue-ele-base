<template>
  <div :class="`columns-panel__list adesk-sub-item_${data.level}` "
       :data-num="data.id"
       v-if="data.childNodes && data.childNodes.length"
       @click.stop="liClick(data)">
    <span class="label"> {{data.text}}</span>
    <li-dom v-for="(item,index) in data.childNodes"
            :key="item.id"
            :data="item"
            :index="index"
            @liClick="liClick(item)">
    </li-dom>
  </div>
</template>
<script>
export default {
  name: 'LiDom',
  data() {
    return {
    };
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    index: {
      type: [Number, String]
    }
  },
  methods: {
    liClick(item) {
      this.$emit('liClick', item);
    }
  }
};
</script>
<style lang="less" scoped>
.columns-panel__list {
  line-height: 30px;
  font-size: 14px;
  padding-left: 10px;
  box-sizing: border-box;
  &.adesk-sub-item_1 {
    padding-left: 0;
    border-bottom: 1px solid #f9f9f9;
    & > .label {
      font-weight: 700;
      font-size: 15px;
      line-height: 44px;
    }
    &:last-child {
      border-bottom: 0;
    }
  }
  .label {
    line-height: 38px;
    cursor: pointer;
  }

  // cursor: pointer;
  // &:hover {
  //   background-color: aliceblue;
  //   color: #409eff;
  // }
  // &.active {
  //   color: #409eff;
  // }
}
</style>style
