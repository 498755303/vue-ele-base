<template>
  <div :class="placement=='left' ? 'choose-material' :'choose-material-endway'">
    <vue-scroll :ops="placement=='left' ? ops :ops2">
      <div v-for="(item,index) in seoMaterial"
           :key="index"
           class="img-wrapsub"
           :style="'width:'+wrapW +';line-height: '+wrapW">
        <el-tooltip placement="top-start">
          <div slot="content"
               class="slot-wrap_material">
            <img :src="item.material_url"
                 class="big-img">
            <span style="font-size:14px">{{item.material_name}}</span>
          </div>
          <div :class="index===currentLocalIdx?'check-img img-border':'check-img'">
            <!-- <el-checkbox v-model="item.checked"
                         @change="changeCheck">
            </el-checkbox>-->
            <img :src="item.material_url"
                 @click="chooseLocalCurrent(index,item)"
                 class="left-img">
          </div>
        </el-tooltip>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 滚动条参数
      ops: {
        default: {
          vuescroll: {
            mode: 'native',
            sizeStrategy: 'percent',
            detectResize: true
          },
          scrollPanel: {
            scrollingX: false
          },
          rail: {},
          bar: {
            background: '#909399',
            opacity: 0.3
          }
        }
      },
      ops2: {
        vRail: {
          pos: 'right'
        },
        hRail: {
          pos: 'bottom'
        },
        vBar: {
          keepShow: false
        },
        hBar: {
          keepShow: false
        }
      },
      currentIdx: 0,
      currentLocalIdx: ''
    };
  },
  props: {
    flag: {
      type: Boolean
    },
    //   包裹层宽
    wrapW: {
      type: String,
      default: '200px'
    },
    //   包裹层高
    wrapH: {
      default: '200px'
    },
    seoMaterial: {
      default: () => [],
      type: Array
    },
    // 判断是左边还是右边
    placement: {
      type: String
    },
    currentIndex: {
      type: null
    }
  },
  methods: {
    // 选择当前素材库素材
    chooseLocalCurrent(index, item) {
      if (this.currentIndex === '') {
        this.$message.error('清先选择对应的创意素材');
        return;
      }
      this.currentLocalIdx = index;
      this.$emit('getMaterialUrl', item.material_url);
      this.$emit('getMaterialId', item.id);
    }
  },
  watch: {
    flag(newVal, oldVal) {
      if (newVal) {
        this.currentLocalIdx = '';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.choose-material-endway {
  height: 130px;
}
.img-wrapsub {
  float: left;
  vertical-align: middle;
  // display: table-cell;
  text-align: center;
  overflow: hidden;
  margin-left: 0;
  margin-top: -1px;
  padding: 3px;
  border: 2px solid rgba(0, 0, 0, 0);
  .check-img {
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    cursor: pointer;
    &.img-border {
      border: 2px solid #409eff;
    }
    .el-checkbox {
      position: absolute;
      top: 4px;
      left: 4px;
      z-index: 10;
    }
    .left-img {
      // display: inline-block;
      vertical-align: middle;
      max-height: 100%;
      max-width: 100%;
    }
  }
}
</style>
