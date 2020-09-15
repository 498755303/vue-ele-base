<template>
  <div class="columns-dialog">
    <el-dialog title="自定义列"
               :visible.sync="dialogVisible"
               top="2vh"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :append-to-body="appendToBody"
               :show-close="false"
               width="80%">
      <div class="columns-content">
        <div class="columns-tab-header">
          <div :class="{
                      'columns-tab-header_inner':true,
                      'active':item.name == curTab
                    }"
               v-for="item in columns"
               @click.stop="_changeTab(item)"
               :key="item.name">{{item.name}}
          </div>
        </div>
        <template v-for="(item,index) in columns">
          <columns :data="item.list"
                   :key="item.name"
                   v-show="item.name == curTab"
                   :ref="'cusColumns_'+item.name"
                   :props="defaultProps"
                   :checkedLevel="checkedLevel"
                   :parentCheckedable="parentCheckedable"
                   :zipLevel="zipLevel"
                   :settings="settings[index]"
                   :dragable="dragable"
                   :canSearch="canSearch"
                   :showSelect="false"
                   @result-change="(v)=>resultChange(v,item.name)"></columns>
        </template>
      </div>
      <div class="columns-selected">
        <select-panel :data="noMustNodes"
                      :must="mustNodes"
                      :dragable="true"
                      @clear-all="handleClearAll"
                      @remove="handleRemoveItem"
                      @update="update"></select-panel>
      </div>
      <span slot="footer"
            class="dialog-footer">
          <div class="columns-custom-name" v-if="saveAble">
            <el-form :inline="true"
                     size="mini"
                     :model="ruleform"
                     :rules="rules"
                     @submit.native.prevent
                     ref="ruleFormRef">
              <el-form-item prop="checked">
                <el-checkbox v-model="ruleform.checked">保存为常用自定义列</el-checkbox>
              </el-form-item>
              <el-form-item prop="templateName" v-show="ruleform.checked">
                <el-input v-model.trim="ruleform.templateName"
                          style="width:200px"
                          placeholder="请输入名称"
                          maxlength="20"
                          show-word-limit
                          clearable></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="default-place" v-else></div>
          <div class="columns-button-wrap">
             <el-button @click.stop="_cancel"
                        size="mini">取 消</el-button>
              <el-button type="primary"
                         size="mini"
                         @click.stop="_sure">确 定</el-button>
          </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import columns from './v4_base/cascaderPanel/panel';
import SelectPanel from "./v4_base/selectPanel/index";

export default {
  name: "columns-v4",
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
          hidden: "hide",
          must: 'required',
          columnsType: "columnsName"
        };
      }
    },
    // 自定义列内容的二维数组
    columns: {
      type: Array,
      default: () => {
        return [
          {
            name: "系统指标",
            list: []
          },
          {
            name: "自定义指标",
            list: []
          }
        ];
      }
    },
    zipLevel: {
      type: Number,
      default: 3
    },
    checkedLevel: {
      type: Number,
      default: 3
    },
    settings: {
      type: Array,
      default: () => {
        return [
          {
            columnsName: "系统指标"
          },
          {
            columnsName: "自定义指标"
          }
        ];
      }
    },
    // 是否可以搜索
    canSearch: {
      type: Boolean,
      default: true
    },
    // 保存配置
    saveAble: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateTemplateName = (rule, value, callback) => {
      if (!value) {
        if (this.ruleform.checked) {
          return callback(new Error('名称必须填写'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      curTab: "系统指标",
      checkedIds: [],
      checkedNodes: [],
      checkedOri: [],
      ruleform: {
        checked: false,
        templateName: ""
      },
      rules: {
        templateName: [
          { validator: validateTemplateName, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    // 必选的
    mustNodes() {
      const tmp = {};
      const res = [];
      this.checkedNodes.forEach(o => {
        if (o.data[this.defaultProps.must] && !tmp.hasOwnProperty(o.data[this.defaultProps.key])) {
          tmp[o.data[this.defaultProps.key]] = 1;
          res.push(o);
        }
      });
      return res;
    },
    // 非必选的
    noMustNodes() {
      const tmp = {};
      const res = [];
      this.checkedNodes.forEach(o => {
        if (!o.data[this.defaultProps.must] && !tmp.hasOwnProperty(o.data[this.defaultProps.key])) {
          tmp[o.data[this.defaultProps.key]] = 1;
          res.push(o);
        }
      });
      return res;
    },
    // 拆分后的已选数组
    splitColumns() {
      if (this.checkedNodes && this.checkedNodes.length) {
        return _.groupBy(this.checkedNodes, "columnsType");
      } else {
        return {};
      }
    }
  },
  methods: {
    // 结果改变
    resultChange(v, name) {
      const oriLen = this.splitColumns[name] ? this.splitColumns[name].length : 0;
      let differ;
      // 增加
      if (v.length > oriLen) {
        differ = _.differenceBy(v, this.checkedNodes, "id");
        this.checkedNodes = this.checkedNodes.concat(differ);
      } else {
        // 删除
        differ = _.differenceBy(this.checkedNodes, v, "id");
        const tmp = _.cloneDeep(this.checkedNodes);
        differ.forEach(val => {
          _.remove(tmp, (o) => {
            return o.id == val.id && o.columnsType == name;
          });
        });
        this.checkedNodes = tmp;
      }
    },
    openDialog(checkedNodes) {
      this.checkedOri = _.cloneDeep(checkedNodes);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.saveAble && this._clearForm();
        this.setCheckedByNodes(_.cloneDeep(checkedNodes));
      });
    },
    // 取消
    _cancel() {
      this.dialogVisible = false;
      this.setCheckedByNodes(this.checkedOri);
    },
    // 确定
    _sure() {
      if (this.saveAble && this.ruleform.checked) {
        this.$refs['ruleFormRef'].validate((valid) => {
          if (valid) {
            this._sureHandle(this.ruleform);
          } else {
            return false;
          }
        });
      } else {
        this._sureHandle();
      }
    },
    _sureHandle(param) {
      this.dialogVisible = false;
      this.$emit('sure', _.uniqBy(this.checkedNodes.map(v => v.data), this.defaultProps.key), param);
    },
    // 切换tab
    _changeTab(item) {
      this.curTab = item.name;
    },
    // 选中清空
    handleClearAll(checkedNodes) {
      checkedNodes.forEach(item => {
        this.handleRemoveItem(item);
      });
    },
    // 选中清除
    handleRemoveItem(item, flag = false) {
      this.$refs['cusColumns_' + item.columnsType] && this.$refs['cusColumns_' + item.columnsType][0].handleCheck(flag, item.id);
    },
    update(o) {
      Object.keys(this.splitColumns).forEach(item => {
        let splitMust = _.filter(this.mustNodes, (val) => {
          return val.columnsType == item;
        });
        this.$refs['cusColumns_' + item] && (this.$refs['cusColumns_' + item][0].checkedData = _.concat(splitMust, this.splitColumns[item]));
      });
      this.checkedNodes = _.concat(this.mustNodes, o);
    },
    getCurChecked() {
      return this.checkedNodes;
    },
    setCheckedByNodes(checkedNodes) {
      this.checkedNodes = [];
      if (checkedNodes && checkedNodes.length) {
        this.columns.forEach(item => {
          if (this.$refs['cusColumns_' + item.name]) {
            this.$refs['cusColumns_' + item.name][0].setNewCheckedNodes(
              _.filter(checkedNodes, (o) => {
                return o.columnsType === item.name;
              }).map(v => v[this.defaultProps.key])
            );
          }
        });
      }
    },
    // 清空表单项
    _clearForm() {
      this.$refs['ruleFormRef'].resetFields();
      this.$refs['ruleFormRef'].clearValidate();
    },
    // 关闭
    closeDialog() {
      this.dialogVisible = false;
    }
  },
  components: {
    columns,
    SelectPanel
  },
  watch: {
    columns: {
      deep: true,
      handler(nv) {
        if (nv) {
          this.curTab = nv[0].name;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
  @deep: ~">>>";
  @{deep} .el-dialog__body {
    padding: 0 10px;
    display: flex;
    justify-content: space-around;

    .columns-content {
      width: 70%;

      .columns-tab-header {
        display: flex;

        .columns-tab-header_inner {
          line-height: 40px;
          margin-left: 15px;
          cursor: pointer;

          &.active {
            border-bottom: 3px solid #1ba3f4;
          }
        }
      }
    }

    .columns-selected {
      width: 29%;
      height: 448px;
      padding-top: 43px;
    }
  }

  @{deep} .el-dialog__footer {
    padding: 20px;

    .dialog-footer {
      display: flex;
      justify-content: space-between;
    }
  }

  @{deep} .cas-select-panel {
    height: 100%;
  }
</style>
