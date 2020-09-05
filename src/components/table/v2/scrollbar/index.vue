<!--
 * @Description: el-table-scroll-template
 * @LastEditors: HL
 * @LastEditTime: 2020-05-20 00:47:40
 -->
<template>
  <div class="scroll-wrap"
       @mouseenter="mouseEnter"
       :style="wrapStyle">
    <vue-scroll :ops="ops"
                ref="vueScrollRef"
                @handle-resize="resizeHandle"
                @handle-scroll="scrollHandle">
      <div class="scroll-inner"
           :style="innerStyle"></div>
    </vue-scroll>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wrapStyle: "",
      innerStyle: "",
      value: 0
    };
  },
  props: {
    ops: {
      type: Object,
      default: () => {
        return {
          vuescroll: {
            mode: 'native',
            sizeStrategy: 'percent',
            detectResize: true
          },
          scrollPanel: {
            initialScrollY: false,
            initialScrollX: false,
            scrollingX: true,
            scrollingY: false,
            speed: 300,
            easing: undefined,
            verticalNativeBarPos: 'right'
          },
          rail: {
            background: '#f3f4f5',
            // background: '#ccc',
            opacity: 1,
            size: '10px',
            specifyBorderRadius: false,
            gutterOfEnds: null,
            gutterOfSide: '1px',
            keepShow: true,
            boredr: '1px solid #dfdfdf'
          },
          bar: {
            showDelay: 16,
            onlyShowBarOnScroll: false,
            keepShow: true,
            background: '#c1c1c1',
            // background: '#F56C6C',
            opacity: 1,
            hoverStyle: false,
            specifyBorderRadius: false,
            minSize: false,
            size: '8px',
            disable: false
          },
          scrollButton: {
            enable: false,
            background: 'rgb(3, 185, 118)',
            opacity: 1,
            step: 180,
            mousedownStep: 30
          }
        };
      }
    }
  },
  methods: {
    resizeHandle(vertical, horizontal, nativeEvent) {
      this.$emit("handleResize", vertical, horizontal, nativeEvent);
    },
    scrollHandle(vertical, horizontal, nativeEvent) {
      this.$emit("scroll", vertical, horizontal, nativeEvent);
    },
    generateStyle(ow, sw, wStyle, iStyle) {
      let wrapStyle = {
        position: 'fixed',
        bottom: '0',
        "z-index": "2000"
      };
      let innerStyle = {};
      if (ow || sw) {
        if (sw <= ow) {
          wrapStyle["display"] = "none";
          wrapStyle["width"] = ow + 'px';
        } else {
          wrapStyle["display"] = "block";
          wrapStyle["width"] = ow + 'px';
          innerStyle = {
            width: sw + 'px'
          };
        }
      }
      Object.assign(wrapStyle, wStyle || {});
      Object.assign(innerStyle, iStyle || {});
      this.wrapStyle = wrapStyle;
      this.innerStyle = innerStyle;
    },
    goTo(xl, yl, speed) {
      this.$refs.vueScrollRef.scrollTo({ x: xl }, speed);
    },
    mouseEnter(e) {
      this.$emit("mouseEnter", e);
    }
  }
};
</script>
<style scoped lang="less">
.scroll-wrap {
  height: 12px;
  .scroll-inner {
    height: 1px;
  }
}
</style>
