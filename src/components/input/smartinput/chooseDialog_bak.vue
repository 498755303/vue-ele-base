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
                    :tbData="tableDataTrans"
                    :tbset="tableSet"
                    @handleoperating="operatingHandle">
            <template slot-scope="slotProps"
                      slot="wordsTrans">
              <div class="wordsTrans-content">
                <p>{{slotProps.row.wordsTrans}}</p>
              </div>
            </template>
          </bc-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
import bcTable from '@/components/table/main.vue';
export default {
  data() {
    return {
      visible: false,
      activeName: 'common',
      params: {
        wordList: this.GlobalParams.adParams.wordList
      },
      tableTitle: [
        {
          name: '词包',
          prop: 'name',
          issort: false,
          renderType: 'default'
        },
        {
          name: '默认词',
          prop: 'default_word',
          issort: false,
          renderType: 'default'
        },
        {
          name: '替换词',
          prop: 'wordsTrans',
          issort: false,
          renderType: 'template',
          slotName: 'wordsTrans'
        },
        {
          name: '用户覆盖率',
          prop: 'user_rate',
          issort: false,
          renderType: 'default'
        },
        {
          name: '操作',
          prop: 'eidt',
          issort: false,
          renderType: 'custormedit',
          edit: [
            {
              name: '插入',
              type: 1
            }
          ]
        }
      ],
      tableSet: {
        stripe: true,
        loading: false,
        isborder: false,
        size: 'mini',
        maxHeight: '600'
      }
    };
  },
  computed: {
    tableDataTrans: function () {
      let tmp = this.params.wordList;
      tmp.map(v => {
        v.wordsTrans = v.words.join();
      });
      return tmp;
    }
  },
  methods: {
    // 关闭处理
    closeHandle() { this.visible = false; },
    // 操作
    operatingHandle(o) {
      if (o.type === 1) {
        this.$emit('insert', o.row, 1);
        this.closeHandle();
      }
    },
    // 打开
    openDialog() {
      this.visible = true;
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
