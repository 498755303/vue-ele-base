<!--
 * @Description: 增加一个small
 * @LastEditors: HL
 * @LastEditTime: 2020-03-04 00:08:34
 -->
<template>
  <el-pagination background
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :small="pageinherit.small || false"
                 :current-page.sync="curpage"
                 :page-sizes="pageSizes"
                 :page-size="pageSize"
                 :layout="pageinherit.layout || 'total,slot, prev, pager, next, jumper,sizes'"
                 :total="pageinherit.total">
  </el-pagination>
</template>
<script>
export default {
  data() {
    return {
      curpage: 1,
      pageSize: 20
    };
  },
  props: {
    pageinherit: {
      type: Object,
      required: true
    },
    pageSizes: {
      type: Array,
      default: function () {
        return [10, 20, 40, 100];
      }
    },
    // 点击后是否返回页面顶部
    toTop: {
      type: Boolean,
      default: true
    },
    // 回到顶部的dom
    toTopEle: {}
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
      this.curpage = 1;
      // 传给父组件每页多少条，回到第一页
      this.$emit('paginationresult', {
        pageSize: this.pageSize,
        currentPage: this.curpage
      });
    },
    handleCurrentChange(val) {
      // 选择当前页之后，将这个值返回给父组件，触发父组件的axios请求
      this.$emit('paginationresult', {
        currentPage: val
      });
      if (this.toTop) {
        if (this.toTopEle) {
          this.toTopEle.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
        }
      }
    }
  },
  watch: {
    pageinherit: {
      handler: function (nv, ov) {
        this.curpage = nv.currentPage;
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.pageSize = this.pageinherit.pageSize || 20;
  }
};
</script>
<style>
  .el-pagination__total {
    color: #f95c5c;
  }
</style>
