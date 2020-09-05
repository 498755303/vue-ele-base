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
                                  :key="index"
                                  :title="item.name"
                                  :name="String(index)">
                  <el-checkbox v-show="item.IsAllCheck"
                               :indeterminate="item.isIndeterminate"
                               v-model="item.checkAll"
                               @change="((val) =>handleCheckAllChange(val,index))">全选
                  </el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group v-model="item.checkedTarget"
                                     @change="((val) =>handlecheckedTargetChange(val,index) )">
                    <el-row>
                      <el-col :span="5"
                              v-for="(target) in item.targetList"
                              :key="target[settings.key]">
                        <el-checkbox v-if="target[settings.lable]"
                                     :label="target[settings.lable]"
                                     :disabled="target.disabled">
                          {{target[settings.lable]}}
                        </el-checkbox>
                      </el-col>
                    </el-row>
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
            <div v-for="item in selectedInfo"
                 :key="item.id">
              <p style="margin-left: 10px;margin-top: 10px">{{item.name}}</p>
              <el-row>
                <el-col :span="12"
                        v-for="tag in item.tagInfo"
                        :key="tag">
                  <el-tag style="margin-top: 10px">
                    {{tag}}
                  </el-tag>
                </el-col>
              </el-row>

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
      default: function() {
        return {
          key: 'id',
          lable: 'indexName'
        };
      }
    },
    collapseInfo: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      collapseNames: ['0'],
      selectedInfo: [],
      selectResult: []
    };
  },
  methods: {
    // 打开弹框
    openDialog() {
      this.dialogVisible = true;
      this.collapseInfo.forEach(item => {
        if (item.relation) {
          this.handleRelation(item, item.checkedTarget);
        }
        if (item.checkedTarget.length !== 0) {
          this.addSelectedTag(item.name, item.checkedTarget, item.targetList);
        }
      });
    },
    // 全选方法
    handleCheckAllChange(val, index) {
      let selectData = this.collapseInfo[index];
      selectData.checkedTarget = val
        ? selectData.targetList.map(item => item[this.settings.lable])
        : [];
      this.addSelectedTag(
        selectData.name,
        selectData.checkedTarget,
        selectData.targetList
      );
    },
    // 选中方法
    handlecheckedTargetChange(value, index) {
      let selectData = this.collapseInfo[index];
      this.handleRelation(selectData, value);
      if (selectData.isAllCheck) {
        let checkedCount = value.length;
        selectData.checkAll = checkedCount === selectData.targetList.length;
        selectData.isIndeterminate =
            checkedCount > 0 && checkedCount < selectData.targetList.length;
      }
      let selectdeList = [];
      selectData.targetList.forEach(item => {
        value.forEach(key => {
          if (item[this.settings.lable] == key) {
            selectdeList.push(item);
          }
        });
      });
      this.addSelectedTag(selectData.name, value, selectdeList);
    },
    // 关系数据处理
    handleRelation(selectData, value) {
      if (selectData.relation) {
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
                  item => item[this.settings.lable] === key
                ),
                1
              );
            });
            this.handleDisable(selectData, disableChildren, true);
          }
        });
      }
    },
    // 删除选中
    handleDisable(selectData, disableChildren, status) {
      selectData.targetList.forEach(item => {
        disableChildren.forEach(key => {
          if (item[this.settings.lable] == key) {
            item.disabled = status;
          }
        });
      });
    },
    // 添加已经选择的标签
    addSelectedTag(name, list, listInfo) {
      let newItem = {
        name: name,
        tagInfo: list
      };
      let newResultItem = {
        name: name,
        tagInfo: listInfo
      };
      let lenght = this.selectedInfo.length;
      if (lenght > 0) {
        let status = false;
        for (let i = 0; i < lenght; i++) {
          if (this.selectedInfo[i].name == name) {
            this.selectedInfo.splice(i, 1, newItem);
            this.selectResult.splice(i, 1, newResultItem);
            status = true;
          }
        }
        if (!status) {
          this.selectedInfo.push(newItem);
          this.selectResult.push(newResultItem);
        }
      } else {
        this.selectedInfo.push(newItem);
        this.selectResult.push(newResultItem);
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleChange() {
      return false;
    },
    getSelectTag() {
      let selectTag = JSON.parse(JSON.stringify(this.selectResult));
      selectTag = selectTag.map(item => {
        let newItem = {
          name: item.label,
          prop: item.name,
          issort: 'custom',
          renderType: 'default'
        };
        return newItem;
      });

      return selectTag;
    },
    submit() {
      this.dialogVisible = false;
      this.$emit('getTagInfo', this.selectResult);
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
  max-height: 1050px;
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
