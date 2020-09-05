
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import versionMixin from "@/mixin/versionMixin.js";
import { Watermark } from "@/util/deptools/Watermark.ts";

export default {
  name: 'App',
  mixins: [versionMixin],
  data() {
    return {};
  },
  methods: {
    handleErr(e) {
      e.preventDefault();
      this.$throw && this.$throw(e.reason);
      return true;
    },
    createWater(route) {
      const app = document.getElementById("app");
      const globalWater = document.querySelector(".global-watermark");
      globalWater && app.removeChild(globalWater);
      if (route.name !== "login") {
        new Watermark(app, {
          textArr: ["欢迎使用基线版本"],
          deg: -30,
          font: "14px '微软雅黑'",
          left: 50,
          top: 50
        });
      }
    }
  },
  created() {
    // 异步错误处理
    if (process.env.NODE_ENV !== "development") {
      window.addEventListener("unhandledrejection", this.handleErr);
    }
  },
  beforeDestroy() {
    if (process.env.NODE_ENV !== "development") {
      window.removeEventListener("unhandledrejection", this.handleErr);
    }
  },
  watch: {
    "$route": {
      handler(nv, ov) {
        if (ov) {
          if (nv.name !== ov.name) {
            this.createWater(nv);
          }
        } else {
          this.createWater(nv);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
