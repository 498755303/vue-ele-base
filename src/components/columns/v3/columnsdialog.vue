<template>
  <div class="columns-dialog">
    <el-dialog title="自定义列"
               :visible.sync="dialogVisible"
               top="2vh"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :append-to-body="appendToBody"
               :show-close="false"
               @opened="opendHandle"
               width="70%">
      <div style="width:300px;margin-bottom:10px;">
        <search-ipt placeholder="请输入可搜索列名称"
                    size="mini"
                    :data="searchData"
                    :prop="defaultProp"
                    @result-click="resultClick"></search-ipt>
      </div>
      <columns :data="columns"
               ref="cusColumns"
               :props="defaultProps"
               :settings="settings"
               :mustColumns="mustColumns"
               :parentCheckedable="parentCheckedable"
               :checkedLevel="checkedLevel"
               :zipLevel="zipLevel"
               :dragable="dragable"
               :isSingle="isSingle"
               :showSelect="showSelect"
               @result-change="resultChange"></columns>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="_cancel">取 消</el-button>
        <el-button type="primary"
                   @click="_sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchIpt from '@/components/input/searchinput';
import columns from '@/components/columns/v3_base/cascaderPanel/index';
export default {
  name: "columns-v3",
  props: {
    appendToBody: {
      type: Boolean,
      defualt: false
    },
    dragable: {
      type: Boolean,
      default: false
    },
    parentCheckedable: {
      type: Boolean,
      default: false
    },
    defaultProp: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'label'
        };
      }
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'label',
          children: 'children',
          controlList: 'subItems',
          disabled: 'disabled',
          hidden: "hide"
        };
      }
    },
    // 必选项
    mustColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 自定义列内容
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    settings: {
      type: Object,
      default: () => {
        return {
          header: '可添加的列'
        };
      }
    },
    checkedLevel: {
      type: Number,
      default: 2
    },
    zipLevel: {
      type: Number,
      default: 2
    },
    isSingle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      searchData: [],
      showSelect: true,
      checkedIds: []
    };
  },
  methods: {
    // 结果改变
    resultChange(v) {
      return false;
    },
    generateSearchData() {
      if (this.$refs.cusColumns) {
        let res = this.$refs.cusColumns.getFlattenData(2);
        let dataResult = res.map(val => {
          return val.data;
        });
        this.searchData = dataResult;
      }
    },
    // 搜索结果点击事件
    resultClick(row) {
      this.$refs.cusColumns.setCheckedNodes([row.data[this.defaultProp.key]]);
    },
    openDialog(checkedIds) {
      this.dialogVisible = true;
      this.checkedIds = checkedIds;
    },
    opendHandle() {
      this.generateSearchData();
      this.$refs.cusColumns.setCheckedNodesByClear(this.checkedIds);
    },
    // 取消
    _cancel() {
      this.dialogVisible = false;
    },
    // 确定
    _sure() {
      let checked = this.$refs.cusColumns.getCheckedNodes();
      this.dialogVisible = false;
      let res = checked.map(v => v.data);
      res = this.mustColumns.concat(res);
      this.$emit('sure', res);
    }
  },
  components: {
    searchIpt,
    columns
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
@{deep} .el-dialog__body {
  padding: 10px 15px;
}
</style>
