import _ from 'lodash';
import { on, off, checkVisible } from '../dom';

export default {
  data() {
    return {
      observer: null,
      nodeClass: ''
    };
  },
  methods: {
    // 计算宽度
    _getTableW() {
      this._getTableBody();
      let targetNode = this.tableBodyWrapper;
      if (targetNode) {
        return {
          offsetW: targetNode.offsetWidth,
          scrollW: targetNode.scrollWidth
        };
      }
    },
    // 监听dom变化,设定滚动条样式
    observeHandle() {
      let self = this;
      this._getTableBody();
      let targetNode = this.tableBodyWrapper;
      let config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      };
      // 当节点发生变化时的需要执行的函数
      let callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          if (mutation.type == 'attributes') {
            if (mutation.attributeName == 'width') {
              // 宽度变动修改固定表头的宽度
              var myEvent = new Event('resize');
              window.dispatchEvent(myEvent);
              const el = document.querySelector(self.tbset.mixinScrollDom);
              if (el && checkVisible(el)) {
                self.$refs.scrollRef.generateStyle(null, null, {
                  visibility: 'hidden'
                });
              } else {
                let res = self._getTableW();
                self.$refs.scrollRef.generateStyle(res.offsetW, res.scrollW, {
                  visibility: 'visible'
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
    // 滚动条滚动触发表格跟随
    scrollHandleTable(vertical, horizontal, nativeEvent) {
      if (this.nodeClass === 'scroll' && horizontal && horizontal.scrollLeft) {
        this.scrollFixTable(horizontal.scrollLeft);
        this.scrollTable(horizontal.scrollLeft);
      }
    },
    // 滚动滚动条
    scrollLinear(vm, e) {
      // console.log(this.nodeClass);
      if (this.nodeClass != 'scroll') {
        // this.$refs.scrollRef && this.$refs.scrollRef.goTo(left, 0);
        this.$refs.scrollRef.$refs.vueScrollRef.scrollTo(
          { x: vm.bodyWrapper.scrollLeft },
          0
        );
      }
    },

    // 鼠标进入事件设置滚动标致
    _mouseEnterNative(e, name) {
      if (e.buttons > 0) return;
      this.nodeClass = name;
    },
    listenerEvent: _.throttle(function () {
      const el = document.querySelector(this.tbset.mixinScrollDom);
      if (el && checkVisible(el)) {
        this.$refs.scrollRef.generateStyle(null, null, { visibility: 'none' });
      } else {
        let res = this._getTableW();
        this.$refs.scrollRef.generateStyle(res.offsetW, res.scrollW, {
          visibility: 'visible'
        });
      }
    }, 30)
  },
  mounted() {
    this.observeHandle();
    on(window, 'scroll', this.listenerEvent);
  },
  beforeDestroy() {
    this.observer.disconnect();
    off(window, 'scroll', this.listenerEvent);
  }
};
