<template>
  <li :class="`columns-panel__list ${index == activeIndex ? 'active':''}`"
      @click.stop="liClick">
    {{data.text}}
  </li>
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
    },
    activeIndex: {
      type: [Number, String]
    }
  },
  methods: {
    liClick() {
      this.$emit('liClick', this.data);
    }
  }
};
</script>
<style lang="less" scoped>
.columns-panel__list {
  line-height: 30px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: aliceblue;
    color: #409eff;
  }
  &.active {
    color: #409eff;
  }
}
</style>style
