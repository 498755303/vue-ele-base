<template>
  <div class="bc-collapse">
    <div :class="active?'active btn_coll clearfix':'btn_coll clearfix'"
         @click.stop="onColl">
      <i :class="nowfolder.materialAuth==1?'word disable':'word'">移动到</i>
      <i slot="reference"
         :class="nowfolder.materialAuth==1?'icon-shuangjiantou1 iconfont arrow disable':'icon-shuangjiantou1 iconfont arrow'"></i>
      <el-popover placement="bottom"
                  v-show="visiblepop || active"
                  width="160"
                  trigger="click"
                  :disabled="false"
                  v-model="visiblepop">
        <p class="popover_word">即将关闭文件/文件夹转移</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini"
                     type="text"
                     @click="visiblepop = false">取消</el-button>
          <el-button type="primary"
                     size="mini"
                     @click="closeColl">确定</el-button>
        </div>
        <i class="arrow"
           slot="reference"></i>
        <!-- <i slot="reference"
                   class="icon-shuangjiantou iconfont arrow"
                   @click.stop="onColl"></i> -->
      </el-popover>

    </div>
    <div :class="active?'active coll_tree':'coll_tree'">
      <el-scrollbar wrap-class="list"
                    :native="false"
                    tag="div">
        <el-tree class="teamtree"
                 :data="treeDt"
                 :props="defaultProps"
                 ref="edittree"
                 node-key="folderId"
                 :default-expanded-keys="[0]"
                 empty-text="数据为空"
                 :expand-on-click-node="false"
                 :check-on-click-node="true"
                 :highlight-current="highlight"
                 @node-click="handleNodeClick">
          <span class="custom-tree-node"
                slot-scope="{ node }">
            <i class="iconfont icon-folder"
               style="color:#409EFF"></i>
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visiblepop: false,
      highlight: true
    };
  },
  props: {
    active: {
      default: false
    },
    nowfolder: {
      require: true
    },
    treeDt: {
      require: true
    },
    defaultProps: {
      require: true
    },
    handleNodeClick: {
      type: Function
    },
    oncollprop: {
      type: Function
    }
  },
  methods: {
    onColl() {
      if (this.nowfolder.materialAuth != 1) {
        if (this.active) {
          this.visiblepop = true;
        } else {
          //   加入是否被授权的判断
          this.oncollprop();
        }
      }
    },
    closeColl() {
      this.visiblepop = false;
      this.$emit('close');
      this.$refs.edittree.setCurrentKey(0);
    }
  }
};
</script>
<style lang="less" scoped>
.btn_coll {
  display: block;
  width: 100%;
  height: 38px;
  line-height: 36px;
  color: #303133;
  border: 1px solid #c0c4cc;
  border-radius: 4px 4px 0 0;
  padding: 0 4px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  -webkit-transition: transform 0.3s;
  transition: transform 0.3s;
  outline: 0;
  .word {
    float: left;
    display: block;
    height: 100%;
    line-height: 36px;
    color: #409eff;
    &.disable {
      color: #303133;
    }
  }
  .arrow {
    float: right;
    display: block;
    height: 36px;
    line-height: 36px;
    transition: transform 0.3s;
    color: #409eff;
    &.disable {
      color: #303133;
    }
  }
}
.active {
  .arrow {
    transform: rotate(180deg);
  }
}
.coll_tree {
  display: block;
  width: 100%;
  height: 0;
  overflow: hidden;
  transition: height 0.3s;
  max-height: 170px;
  will-change: height;
  box-sizing: border-box;
  outline: 0;
  &.active {
    height: 170px;
    border: 1px solid #c0c4cc;
  }
  .list {
    height: 170px;
  }
}
.popover_word {
  line-height: 32px;
}
</style>
