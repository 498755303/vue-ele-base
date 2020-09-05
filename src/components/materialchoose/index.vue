<template>
  <div>
    <el-dialog title="创意认领"
               center
               top="5vh"
               width="80%"
               :close-on-click-modal="false"
               :visible.sync="dialogVisible">
      <div class="container clearfix">
        <div class="title">创意素材</div>
        <div class="dialog-wrap clearfix">
          <div v-for="(item,index) in adMaterial"
               :key="index"
               class="adMaterialList"
               :class="currentIndex===index ? 'adMaterialList img-border' : 'adMaterialList'"
               @click="chooseSeoMaterial(item,index)">
            <el-tooltip placement="right-start">
              <img :src="item"
                   alt>
              <div slot="content"
                   class="slot-wrap_material">
                <img :src="item"
                     class="big-img">
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="container clearfix">
        <div class="title">关联素材</div>
        <div class="dialog-wrap clearfix">
          <div v-for="(item,index) in saveList"
               :key="index"
               class="adMaterialList">
            <el-tooltip placement="right-start">
              <img :src="item.materialUrl"
                   alt
                   :preview="index">
              <div slot="content"
                   class="slot-wrap_material">
                <img :src="item.materialUrl"
                     class="big-img">
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div style="display:flex;">
        <div style="width:10%;height:40px;text-align:center;padding:0px 10px">查询条件</div>
        <el-form size="mini"
                 inline>
          <el-form-item>
            <el-date-picker v-model="ruleform.date"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy年MM月dd日"
                            value-format="yyyyMMdd"
                            :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入素材名称"
                      v-model="ruleform.designName"
                      @keyup.native="onsubmit"></el-input>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary"
                       @click="onsubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="container clearfix">
        <div class="title">素材库素材</div>
        <scroll-img :wrapW="widthP"
                    :wrapH="heightP"
                    :seoMaterial="seoMaterial"
                    :currentIndex="currentIndex"
                    @getMaterialUrl="seoMaterialUrl"
                    @getMaterialId="seoMaterialId"
                    style="float:left;width:80%"
                    v-loading="loading"
                    :flag="flag"></scroll-img>
      </div>

      <bc-pagination :pageinherit="inheritPage"
                     @paginationresult="setpage"
                     style="text-align:center;"></bc-pagination>
      <el-form style="text-align:center;padding:15px 0px">
        <el-button type="primary"
                   round
                   @click="saveMaterial">关联保存</el-button>
        <el-button plain
                   round
                   @click="back">返回</el-button>
      </el-form>
    </el-dialog>
    <el-dialog title="提示"
               :visible.sync="dialogVisibleHint"
               width="30%">
      <span style="padding:4px 10px">请再次确认是否关联</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisibleHint = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import scrollImg from './choose.vue';
import bcPagination from '@/components/table/pagination.vue';
import { saveMaterialRelation } from '@/api';
import { FunctionUtil } from '@/util/expand/FunctionUtil.ts';
export default {
  data() {
    return {
      currentIndex: '',
      ruleform: {
        date: [],
        designName: ''
      },
      saveData: [],
      // 没有被认领的索引
      indexes: [],
      dialogVisible: false,
      dialogVisibleHint: false,
      widthP: '100px',
      inheritPage: {
        currentPage: 1,
        total: 0
      },
      saveAxiosParam: {
        id: '',
        dataAdMaterialLogId: '',
        dataAdInfoId: '',
        materialId: '',
        dataCount: '',
        dataAverage: '',
        dataLinkUrl: '',
        materialUrl: '',
        allFinish: ''
      },
      currentLIndex: '',
      currentSIndex: '',
      arr: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              end.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  props: {
    flag: {
      type: Boolean
    },
    adMaterial: {
      default: () => [],
      type: Array
    },
    allData: {
      type: Object
    },
    seoMaterial: {
      type: Array
    },
    total: {
      type: Number
    },
    loading: {
      type: Boolean
    },
    associatedMaterial: {
      type: Array
    }
  },
  computed: {
    heightP: function () {
      return '100%';
    },
    saveList() {
      return this.privateSaveList();
    }
  },
  methods: {
    privateSaveList() {
      this.arr = this.adMaterial;
      this.arr = this.arr.map(item => {
        return JSON.parse(JSON.stringify(this.saveAxiosParam));
      });
      this.adMaterial.map((info, index) => {
        this.associatedMaterial.map(item => {
          if (info == item.dataLinkUrl) {
            this.arr[index].materialUrl = item.materialUrl;
            this.arr[index].materialId = item.materialId;
          }
        });
      });
      return this.arr;
    },
    chooseSeoMaterial(item, index) {
      if (this.associatedMaterial.length > 0) {
        this.associatedMaterial.map(content => {
          if (this.associatedMaterial[index]) {
            this.$message.error('该素材已被其他设计师认领，请选择其他素材');
            this.currentIndex = '';
          } else {
            this.currentIndex = index;
            this.arr[index].dataLinkUrl = item;
          }
        });
      } else {
        this.currentIndex = index;
        this.arr[index].dataLinkUrl = item;
      }
    },
    // 分页设置
    setpage(val) {
      this.$emit('masterialCurrentPage', val.currentPage);

      if (val.pageSize) {
        this.$emit('masterialPagesize', val.pageSize);
      }
    },
    seoMaterialUrl(val) {
      this.arr[this.currentIndex].materialUrl = val;
    },
    seoMaterialId(val) {
      this.arr[this.currentIndex].materialId = val;
    },
    // 关联并保存
    saveMaterial() {
      this.arr.map(item => {
        item.dataAdInfoId = this.allData.id;
        item.dataCount = this.arr.length;
        if (item.materialUrl) {
          this.arr.map(item2 => {
            item2.allFinish = 1;
          });
        } else {
          this.arr.map(item3 => {
            item3.allFinish = '';
          });
        }
      });
      if (this.associatedMaterial.length > 0) {
        this.saveData = this.arr.filter((x, index) => {
          return Boolean(x.dataLinkUrl) === true;
        });
      } else {
        this.saveData = this.arr.filter((x, i) => {
          return x.materialUrl;
        });
      }
      this.dialogVisibleHint = true;
    },
    confirmSave() {
      this.dialogVisibleHint = false;
      saveMaterialRelation({ list: this.saveData }).then(res => {
        if (res.data.successful) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.$emit('updataList', true);
          this.dialogVisible = false;
          this.currentIndex = '';
          this.$emit('changeFlag', false);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //  返回
    back() {
      this.arr = [];
      this.currentIndex = '';
      this.dialogVisible = false;
      this.$emit('changeFlag', false);
    },

    // onsubmit
    onsubmit: FunctionUtil.Debounce(function () {
      this.currentLIndex = '';
      this.currentSIndex = '';
      this.ruleform.selectType = 2;
      this.inheritPage.currentPage = 1;
      this.$emit('submitMaterial', this.ruleform);
    }, 200),
    //  重置
    reset() {
      this.ruleform.date = [];
      this.ruleform.designName = '';
      this.ruleform.selectType = 1;
      this.$emit('submitMaterial', this.ruleform);
    }
  },
  watch: {
    seoMaterial(cur, old) {
      if (cur.length == 0) {
        this.$message.error('未匹配到素材，请手动查询');
      }
    }
  },
  updated() {
    this.inheritPage.total = this.total;
  },
  components: {
    scrollImg,
    bcPagination
  }
};
</script>
<style lang="less" scoped>
.container {
  .title {
    float: left;
    height: 100px;
    line-height: 100px;
    padding: 10px;
    width: 10%;
    text-align: center;
  }
}
.dialog-wrap {
  float: left;
  width: 80%;
  .centerBox {
    float: left;
  }
  .adMaterialList {
    float: left;
    margin-right: 20px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    float: left;
    img {
      display: inline-block;
      vertical-align: middle;
      max-width: 100%;
      max-height: 100%;
    }
    &.img-border {
      border: 2px solid #409eff;
    }
  }

  .imageFull {
    width: 80%;
    z-index: 9999;
  }
  .img-wrap-sub {
    background: #f9f9f9;
    .img-wrapsub {
      width: 100px;
      height: 100px;
      vertical-align: middle;
      display: table-cell;
      text-align: center;
      box-sizing: border-box;
      .left-img {
        // display: inline-block;
        vertical-align: middle;
        // max-height: 100%;
        // max-width: 100%;
      }
    }
  }
}
</style>
