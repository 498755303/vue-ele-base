import _ from "lodash";
import { on, off, checkVisible, getClientHeight, getOffset } from "@/util/app/dom.js";

export default {
  data() {
    return {
      observer: null,
      nodeClass: ""
    };
  },
  methods: {
    // 计算宽度
    _getTableW() {
      let targetNode = document.querySelector(".scrolling_adesk");
      if (targetNode) {
        return {
          offsetW: targetNode.offsetWidth,
          scrollW: targetNode.scrollWidth
        };
      }
    },
    observeHandle() {
      let self = this;
      let targetNode = document.querySelector(".scrolling_adesk");
      let config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      };
      // 当节点发生变化时的需要执行的函数
      let callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
          if (mutation.type == "attributes") {
            if (mutation.attributeName == "width") {
              const el = document.querySelector(self.mixinScrollDom);
              if (el && checkVisible(el)) {
                self.$refs.scrollRef.generateStyle(null, null, {
                  visibility: "hidden"
                });
              } else {
                let res = self._getTableW();
                self.$refs.scrollRef.generateStyle(res.offsetW, res.scrollW, {
                  visibility: "visible"
                });
              }
            }
          }
        }
      };
      // 创建一个observer示例与回调函数相关联
      this.observer = new MutationObserver(callback);
      // 使用配置文件对目标节点进行观测
      this.observer.observe(targetNode, config);
    },
    scrollHandleTable(vertical, horizontal, nativeEvent) {
      if (this.nodeClass != "table") {
        // 组件传递事件导致时间耗损
        // let el = this.$refs.tbRef && this.$refs.tbRef.$refs[this.tableSet.ref];
        // el && el.pagingScrollTop(0, horizontal.scrollLeft);
        const tableBodyWrapper = document.querySelector(".scrolling_adesk");
        tableBodyWrapper.scrollLeft = horizontal.scrollLeft;
      }
    },
    scrollLinear(vm, e) {
      if (this.nodeClass != "scroll") {
        // this.$refs.scrollRef && this.$refs.scrollRef.goTo(left, 0);
        this.$refs.scrollRef.$refs.vueScrollRef.scrollTo(
          { x: vm.bodyWrapper.scrollLeft },
          0
        );
      }
    },
    mouseEnter(e, name) {
      if (e.buttons > 0) return;
      this.nodeClass = name;
    },
    listenerEvent: _.throttle(function() {
      const el = document.querySelector(this.mixinScrollDom);
      if (el && checkVisible(el)) {
        this.$refs.scrollRef.generateStyle(null, null, { visibility: "none" });
      } else {
        let res = this._getTableW();
        this.$refs.scrollRef.generateStyle(res.offsetW, res.scrollW, {
          visibility: "visible"
        });
      }
      this.setTableH();
    }, 30),
    setTableH() {
      let tableTop = getOffset(document.querySelector(this.mixinScrollTable));
      let scrollH =
        document.documentElement.scrollTop || document.body.scrollTop;
      let tableH = parseInt(getClientHeight() - 30);
      if (scrollH <= tableTop) {
        tableH = 99999;
      }
      this.$set(this.tableSet, "maxHeight", tableH);
    }
  },
  mounted() {
    this.observeHandle();
    on(window, "scroll", this.listenerEvent);
  },
  beforeDestroy() {
    this.observer.disconnect();
    off(window, "scroll", this.listenerEvent);
    off(window, "resize", this.setTableH);
  },
  created() {
    on(window, "resize", this.setTableH);
  }
};
