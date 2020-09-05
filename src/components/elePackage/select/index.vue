<template>
  <el-select v-model="val"
             :class="selectClass || ''"
             filterable
             :filter-method="_filterMethod"
             :clearable="clearable"
             @visible-change="_visibleChange"
             @change="_changeSelect"
             :placeholder="placeholder">
    <el-option v-for="item in datalistCp"
               :key="item[props.key]"
               :label="labelFn(item)"
               :value="item[props.value]">
    </el-option>
    <div v-if="showAdverListLen <allAdverListLen"
         class="more-list"
         @click.stop="_loadMoreAccount">
      <slot v-if="$slots.default"></slot>
      <span v-else>当前显示共{{showAdverListLen}}条,剩余{{allAdverListLen - showAdverListLen}},点击加载更多</span>
    </div>
  </el-select>
</template>
<script>
export default {
  name: "pageSelect",
  props: {
    value: {},
    placeholder: {
      type: String
    },
    // 类名
    selectClass: {
      type: String
    },
    clearable: {
      type: Boolean,
      default: false
    },
    // 原始数据
    datalist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          key: "id",
          label: "label",
          value: "value"
        };
      }
    },
    labelFn: {
      type: Function,
      default(item) {
        console.log(this);
        return item[this.props.label];
      }
    },
    pageSize: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      val: "",
      datalistCp: [],
      datalistFilter: []
    };
  },
  computed: {
    // 当前展示的账户数
    showAdverListLen() {
      return this.datalistCp.length;
    },
    // 当前平台所有账户数
    allAdverListLen() {
      return this.datalistFilter.length;
    }
  },
  methods: {
    // 筛选方法
    _filterMethod(v) {
      this.datalistFilter = this.datalist.filter(val => {
        return this.labelFn(val).indexOf(v) > -1;
      });
      this.datalistCp = this.datalistFilter.slice(0, this.pageSize);
    },
    // 加载更多账户
    _loadMoreAccount() {
      this.datalistCp = this.datalistFilter.slice(0, this.showAdverListLen + this.pageSize);
    },
    // 获取焦点
    _visibleChange(f) {
      if (f) {
        this._filterMethod("");
      }
    },
    _changeSelect(val) {
      this.$emit("change", val);
    }
  },
  watch: {
    datalist: {
      handler(nv) {
        this._filterMethod("");
      },
      deep: true,
      immediate: true
    },
    value(nv) {
      console.log(nv);
      this.val = nv;
    },
    val(nv) {
      console.log(nv);
      this.$emit("update:value", nv);
    }
  },
  updated() {
    console.log(1);
  }
};
</script>
<style scoped lang="less">
.more-list {
  font-size: 14px;
  text-align: center;
  color: #c0c4cc;
  cursor: pointer;
}
</style>
