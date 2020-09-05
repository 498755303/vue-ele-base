<template>
  <div class="wrap">
    <el-button type="primary"
               @click.stop="open">打开</el-button>
    <div class="drawer-wrap-test">
      <bc-drawer v-model="drawerVisible"
                 :modal="modal"
                 :center="center"
                 :title="title"
                 :width="drawer1Width"
                 :fullscreen="fullscreen"
                 :placement="placement"
                 :closable="closable"
                 :beforeClose="beforeClose"
                 :lockScroll="lockScroll"
                 :maskClosable="maskClosable"
                 :outClosable="outClosable"
                 :inner="inner"
                 @input="closeDrawer"
                 @close="close"
                 @onVisibleChange="onVisibleChange">
        <el-button type="primary"
                   @click.stop="open2">打开第二个</el-button>
      </bc-drawer>
      <template>
        <bc-drawer v-model="drawerVisible2"
                   :modal="modal"
                   :center="center"
                   :title="title"
                   :width="drawer2Width"
                   :fullscreen="fullscreen"
                   :placement="placement"
                   :closable="closable"
                   :maskClosable="maskClosable"
                    :outClosable="outClosable"
                   :beforeClose="beforeClose"
                   :lockScroll="lockScroll"
                   :inner="inner"
                   @input="closeDrawer2"
                   @close="close"
                   @onVisibleChange="onVisibleChange">
        </bc-drawer>
      </template>
    </div>

  </div>
</template>
<script>
import bcDrawer from "../index";
export default {
  data() {
    return {
      drawerVisible: false,
      drawerVisible2: false,
      drawer2Width: "200px",
      drawer1Width: "400px",
      modal: true,
      placement: "right",
      closable: true,
      title: "抽屉轮子",
      fullscreen: false,
      center: true,
      lockScroll: false,
      maskClosable: false,
      outClosable: true,
      inner:true
    }
  },
  methods: {
    open() {
      this.drawerVisible = true;
    },
    // 关闭抽屉
    closeDrawer(val) {
      this.drawerVisible = val;
    },
    closeDrawer2(val) {
      this.drawerVisible2 = val;
    },
    beforeClose(done) {
      done()
    },
    // 关闭回调
    close() {
      console.log("close")
    },
    // 切换状态
    onVisibleChange(flag) {
      console.log("onVisibleChange", flag)
    },
    open2() {
      this.drawerVisible2 = true;
    }
  },
  components: {
    bcDrawer
  }
}
</script>
<style lang="less" scoped>
.wrap {
  p {
    line-height: 50px;
  }
}
.drawer-wrap-test {
  width: 100%;
  height: 400px;
  background-color: pink;
  position:relative;
}
</style>
