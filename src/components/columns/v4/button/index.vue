<template>
  <div class="cloumns-button-wrap">
    <el-dropdown :size="size" class="columns-button"
                 v-if="list.length"
                 ref="columnDropRef"
                 placement="bottom-end"
                 :hide-on-click="true"
                 trigger="click">
      <el-button type="primary" :size="size" style="margin-top:-2px">
        自定义列<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown"
                        class="column-dropdown_menu"
                        style="width:300px">
        <div class="custom-template-list">
          <el-dropdown-item v-for="(item,index) in list"
                            :key="index"
                            :label="item[defaultProps.label]"
                            :value="item[defaultProps.key]">
            <div class="li-item">
              <el-popover
                  placement="left-start"
                  width="400"
                  :close-delay="0"
                  :title="item[defaultProps.label] "
                  trigger="hover"
                  :content="item[defaultProps.desc]">
                <div slot="reference" class="left" @click.stop="changeHandle(item[defaultProps.key])">
                  <div class="column-icon-wrap">
                    <i class="el-icon-check" v-if="item.checked"></i>
                  </div>
                  <span class="select-text">{{ item[defaultProps.label] }}</span>
                </div>
              </el-popover>
              <i class="el-icon-delete" @click.stop="delHandle(item)"></i>
            </div>
          </el-dropdown-item>
        </div>
        <el-dropdown-item :value="-1" label="选择指标" style="border-top:1px solid #ccc">
          <div class="li-item" @click.stop="changeHandle(-1)">
            <div class="left">
              <div class="column-icon-wrap"></div>
              <span>自定义</span>
            </div>
            <i class="el-icon-delete" style="display:none"></i>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button v-else
               type="primary"
               style="margin-top:-2px"
               :size="size"
               @click.stop="changeHandle(-1)">自定义列
    </el-button>
  </div>

</template>

<script>
export default {
  name: "index.vue",
  props: {
    // 数据项
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          label: 'name',
          key: 'id',
          desc: "columnsLabel"
        };
      }
    },
    size: {
      default: "small",
      type: String
    }
  },
  data() {
    return {
      value: ""
    };
  },
  methods: {
    changeHandle(v) {
      this.value = v;
      this.$refs.columnDropRef && (this.$refs.columnDropRef.visible = false);
      this.$emit("change", v);
    },
    // 删除处理
    delHandle(item) {
      this.$emit("delete", item);
    }
  },
  watch: {
    list: {
      handler(nv) {
        if (nv.length > 0) {
          this.value = nv[0][this.defaultProps.key];
        } else {
          this.value = -1;
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped lang="less">
  @deep: ~">>>";
  @iconW: 30px;
  @{deep} .column-dropdown_menu {
    margin-top: -5px !important;
  }

  @{deep} .column-icon-wrap {
    width: @iconW;
  }

  @{deep} .custom-template-list {
    max-height: 300px;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      -webkit-appearance: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track-piece {
      background-color: #f3f4f5;
      -webkit-border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
    }
  }

  .li-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;

      .select-text {
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .el-icon-check {
        color: #409EFF;
      }
    }

  }

  .cloumns-button-wrap {
    margin-right: 5px;
    margin-left: 5px;
  }
</style>
