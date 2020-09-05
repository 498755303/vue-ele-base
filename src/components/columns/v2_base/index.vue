<template>
  <div>
    <el-dialog title="自定义列"
               :visible.sync="dialogVisible"
               width="80%">
      <el-row class="box">
        <el-col :span="18">
          <el-tabs v-model="activeName"
                   @tab-click="handleClick">
            <el-tab-pane label="系统指标"
                         name="first">
              <el-collapse v-model="collapseNames"
                           @change="handleChange">
                <el-collapse-item v-for="(item,index) in collapseInfo"
                                  :title="item[settings.cateName]"
                                  :key="'collapse_'+index"
                                  :name="item[settings.cateKey]">
                  <el-checkbox v-if="item.isAllCheck"
                               v-model="item.checkAll"
                               @change="((val) =>handleCheckAllChange(val,index))">全选
                  </el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <div class="must-checked"
                       v-if="item.mustChecked && item.mustChecked.length">
                    <template v-for="(mustItem,idx) in item.mustChecked">
                      <i v-if="privateMustInList(mustItem,item.targetList)"
                         class="el-icon-unlock"
                         :key="item.name+'_must_'+idx">{{privateFindItem(mustItem,index)}}</i>
                    </template>
                  </div>
                  <el-checkbox-group v-model="item.checkedTarget"
                                     @change="((val) =>handlecheckedTargetChange(val,index) )">
                    <template v-for="target in item.targetList">
                      <el-checkbox v-if="privateShowCheckItem(target,item)"
                                   :label="target[settings.key]"
                                   :key="item.name+'_'+target[settings.key]"
                                   :disabled="target.disabled">
                        {{target[settings.label]}}
                      </el-checkbox>
                    </template>
                  </el-checkbox-group>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <!--                        <el-tab-pane label="自定义指标" name="second">自定义指标</el-tab-pane>-->
          </el-tabs>
        </el-col>
        <el-col :span="6"
                class="selected">
          <div class="title">已选指标</div>
          <div class="selected-item">
            <div v-for="(item, index) in selectedInfo"
                 :key="'selectedInfo_'+index">
              <p style="margin-left: 10px">{{item.name}}</p>
              <el-tag v-for="tag in item.tagInfo"
                      :key="tag">
                {{tag}}
              </el-tag>
            </div>

          </div>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CustomHeader',
  props: {
    settings: {
      type: Object,
      default: function () {
        return {
          cateKey: 'cateId',
          cateName: 'cateName',
          key: 'indexName', // 每一个自定义列的唯一标识字段名
          label: 'name' // 每一个自定列要显示的字段
        };
      }
    },
    collapseInfo: {
      type: Array,
      default: function () {
        return [];
      }
    },
    // 默认展开项
    defaultExpend: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      collapseNames: [],
      mustSelectedInfo: [], // 必选项数据
      selectedInfo: [],
      selectResult: []
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.collapseInfo.forEach(item => {
        if (item && item.relation) {
          this.handleRelation(item, item.checkedTarget);
        }
      });
      this.privateGenerateMustList();
    },
    handleCheckAllChange(val, index) {
      let selectData = this.collapseInfo[index];
      let res = [];
      if (val) {
        selectData.targetList.forEach(item => {
          if (!item.disabled) {
            res.push(item[this.settings.key]);
          }
        });
      }
      selectData.checkedTarget = res;
      this.addSelectedTag(
        selectData[this.settings.cateId],
        selectData[this.settings.cateName],
        selectData.checkedTarget,
        selectData.targetList
      );
    },
    handlecheckedTargetChange(value, index) {
      let selectData = this.collapseInfo[index];
      if (selectData.relation) {
        this.handleRelation(selectData, value);
      }
      if (selectData.isAllCheck) {
        let checkedCount = value.length;
        selectData.checkAll = checkedCount === selectData.targetList.length;
        selectData.isIndeterminate =
          checkedCount > 0 && checkedCount < selectData.targetList.length;
      }

      let selectdeList = [];
      selectData.targetList.forEach(item => {
        value.forEach(key => {
          if (item[this.settings.key] == key) {
            selectdeList.push(item);
          }
        });
      });
      this.addSelectedTag(
        selectData[this.settings.cateId],
        selectData[this.settings.cateName],
        value,
        selectdeList
      );
    },
    handleRelation(selectData, value) {
      selectData.relation.forEach(item => {
        let father = item.father;
        let selectChildren = item.selectChildren;
        let disableChildren = item.disableChildren;
        if (value.includes(father)) {
          selectChildren.forEach(key => {
            if (!selectData.checkedTarget.includes(key)) {
              selectData.checkedTarget.push(key);
            }
          });
          this.handleDisable(selectData, disableChildren, false);
        } else {
          selectChildren.forEach(key => {
            selectData.checkedTarget.splice(
              selectData.checkedTarget.findIndex(
                item => item[this.settings.key] === key
              ),
              1
            );
          });
          this.handleDisable(selectData, disableChildren, true);
        }
      });
    },
    handleDisable(selectData, disableChildren, status) {
      selectData.targetList.forEach(item => {
        disableChildren.forEach(key => {
          if (item[this.settings.key] == key) {
            item.disabled = status;
          }
        });
      });
    },
    // 添加已经选择的标签
    addSelectedTag(cateId, cateName, selection, listInfo) {
      let curCollapse = this.collapseInfo.filter(value => {
        return value[this.settings.cateId] == cateId;
      })[0];
      if (
        curCollapse &&
        curCollapse.mustChecked &&
        curCollapse.mustChecked.length
      ) {
        for (var i = 0; i < selection.length; i++) {
          if (curCollapse.mustChecked.includes(selection[i])) {
            selection.splice(i, 1);
            i--;
          }
        }
        for (var j = 0; j < listInfo.length; j++) {
          if (
            curCollapse.mustChecked.includes(listInfo[j][this.settings.key])
          ) {
            listInfo.splice(j, 1);
            j--;
          }
        }
      }
      let selectedItem = {
        id: cateId,
        name: cateName,
        tagInfo: selection
      };
      let selectedInfo = {
        name: cateName,
        tagInfo: listInfo
      };
      let lenght = this.selectedInfo.length;
      if (lenght > 0) {
        let status = false;
        for (let i = 0; i < lenght; i++) {
          if (this.selectedInfo[i][this.settings.cateId] == cateId) {
            this.selectedInfo.splice(i, 1, selectedItem);
            this.selectResult.splice(i, 1, selectedInfo);
            status = true;
          }
        }
        if (!status) {
          this.selectedInfo.push(selectedItem);
          this.selectResult.push(selectedInfo);
        }
      } else {
        this.selectedInfo.push(selectedItem);
        this.selectResult.push(selectedInfo);
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleChange() {
      return false;
    },
    submit() {
      this.dialogVisible = false;
      this.$emit('getTagInfo', this.selectResult);
    },
    // list中找到对应Label
    privateFindItem(k, i) {
      let curCollapse = this.collapseInfo[i];
      let res = curCollapse.targetList.filter(v => {
        return v[this.settings.key] == k;
      });
      return res && res[0] ? res[0][this.settings.label] : '';
    },
    // 判断是否展示（targetList中的必选项不在显示）
    privateShowCheckItem(item, parentItem) {
      if (
        item[this.settings.key] &&
        item[this.settings.label] &&
        !parentItem.mustChecked.includes(item[this.settings.key])
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 判断必选项是否在targetList中
    privateMustInList(mustItem, targetList) {
      let res = targetList.findIndex(v => {
        return v[this.settings.key] == mustItem;
      });
      return res >= 0;
    },
    // 生成必选项数据
    privateGenerateMustList() {
      let tmp;
      this.collapseInfo.forEach(val => {
        if (val.mustChecked && val.mustChecked.length) {
          tmp = val.targetList.map(v => v[this.settings.key]);
          val.mustChecked.forEach(must => {
            if (tmp.includes(must)) {
              this.mustSelectedInfo.push(must);
              this.selectResult.push(
                val.targetList.filter(item => item[this.settings.key] == must)
              );
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.box {
  overflow: hidden;
}

.selected {
  background-color: rgba(247, 248, 250);
  padding-bottom: 100000px;
  margin-bottom: -100000px;
}

.selected-item {
  overflow-y: auto;
  height: calc(100% - 40px);
}

.title {
  border-bottom: #e4e7ed 2px solid;
  height: 38px;
  padding-left: 5px;
  line-height: 38px;
  text-align: left;
  font-size: small;
}

/*标签样式*/
.el-tag {
  margin-left: 10px;
}
</style>
