<template>
  <div class="vue-ele-base__layout">
    <div class="vue-ele-base__layout-wrap">
      <!-- 回到顶部 -->
      <el-tooltip placement="top"
                  content="回到顶部">
        <back-to-top transitionName="fade"
                     :customStyle="myBackToTopStyle"
                     :visibilityHeight="300"
                     :backPosition="0"></back-to-top>
      </el-tooltip>
      <router-view/>
    </div>
  </div>
</template>
<script>
import backToTop from "@/components/backToTop";

export default {
  data() {
    return {
      myBackToTopStyle: {
        right: "50px",
        bottom: "50px",
        width: "40px",
        height: "40px",
        "border-radius": "4px",
        "line-height": "45px",
        background: "#e7eaf1"
      }
    };
  },
  methods: {},
  components: {
    backToTop
  }
};
</script>
