<template>
  <el-dialog :visible="visible"
             class="wordbag-dialog"
             title="请选择词包"
             width="80%"
             height="70vh"
             top="2vh"
             :append-to-body="true"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             @close="closeHandle"
             center>
    <div class="wordbag-dialog-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="公共词包"
                     name="common">
          <bc-table :tbTitle="tableTitle"
                    :tbData="tableData"
                    :tbset="tableSet"
                    @handleoperating="operatingHandle">
            <template slot-scope="slotProps"
                      slot="words">
              <div class="wordsTrans-content">
                <p>{{ slotProps.row.words ? slotProps.row.words.join(",") : "" }}</p>
              </div>
            </template>
          </bc-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
import bcTable from '@/components/table/v2/index';

export default {
  data() {
    return {
      visible: false,
      activeName: 'common',
      params: {
        wordList: this.GlobalParams.adParams.wordList
      },
      tableTitle: [],
      tableData: [],
      tableSet: {
        stripe: true,
        loading: false,
        size: 'mini',
        maxHeight: '600'
      }
    };
  },
  methods: {
    // 关闭处理
    closeHandle() {
      this.visible = false;
    },
    // 操作
    operatingHandle(o) {
      if (o.type === 1) {
        this.$emit('insert', o.row, 1);
        this.closeHandle();
      }
    },
    // 打开
    async openDialog(setting) {
      this.visible = true;
      if (!setting) {
        console.warn("词包更多setting避免为空");
        return false;
      }
      this.tableTitle = setting.tableTitle;
      if (!setting.isStatic && setting.getFn) {
        await this.getWords(setting.getFn);
      }
    },
    // 获取数据
    async getWords(fn) {
      this.tableSet.loading = true;
      const res = await fn();
      this.tableSet.loading = false;
      if (res) {
        this.tableData = res;
      }
    }
  },
  components: {
    bcTable
  }
};
</script>

<style lang="less" scoped>
.wordsTrans-content {
  height: 100px;
  overflow: auto;
}
</style>
