/*
 * @Description:
 * @LastEditors: HL
 * @LastEditTime: 2020-03-18 14:45:25
 */
import { on, off, getScroll, getOffsetV2 } from "./dom";
const prefixCls = "adesk-fixed-table_header";
export default {
  props: {
    offsetTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      affix: false,
      styles: {},
      slot: false
    };
  },
  computed: {
    offsetType() {
      return "top";
    },
    classes() {
      return [
        {
          [`${prefixCls}`]: this.affix,
          "ol-header": this.tbset.onlyShowFixHeader
        }
      ];
    }
  },
  methods: {
    handleResize() {
      const affix = this.affix;
      const scrollTop = getScroll(window, true);
      const elOffset = getOffsetV2(this.$el);
      if (
        elOffset.top - this.offsetTop < scrollTop &&
        this.offsetType == "top" &&
        affix
      ) {
        this.styles = {
          top: `${this.offsetTop}px`,
          left: `${elOffset.left}px`,
          width: `${this.$el.offsetWidth}px`
        };
      }
    },
    handleScroll() {
      const affix = this.affix;
      const scrollTop = getScroll(window, true);
      const elOffset = getOffsetV2(this.$el);
      // Fixed Top
      if (
        elOffset.top - this.offsetTop < scrollTop &&
        this.offsetType == "top" &&
        !affix
      ) {
        this._getFixTableBody();
        const left = this._getTableBody();

        this.affix = true;
        this.slot = true;
        this.$nextTick(() => {
          this.fixTableBodyWrapper.scrollLeft = left;
        });
        this.styles = {
          top: `${this.offsetTop}px`,
          left: `${elOffset.left}px`,
          width: `${this.$el.offsetWidth}px`
        };
        this.$emit("fixed-change", true);
      } else if (
        elOffset.top - this.offsetTop > scrollTop &&
        this.offsetType == "top" &&
        affix
      ) {
        const left = this._getFixTableBody();
        this._getTableBody();
        this.tableBodyWrapper.scrollLeft = left;
        this.slot = false;
        this.affix = false;
        this.styles = null;
        this.$emit("fixed-change", false);
      }
    }
  },
  mounted() {
    on(window, "scroll", this.handleScroll);
    on(window, "resize", this.handleScroll);
    on(window, "resize", this.handleResize);
    this.$nextTick(() => {
      this.handleScroll();
    });
  },
  beforeDestroy() {
    off(window, "scroll", this.handleScroll);
    off(window, "resize", this.handleScroll);
    on(window, "resize", this.handleResize);
  }
};
