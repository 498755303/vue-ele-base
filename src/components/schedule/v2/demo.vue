<!--
 * @Description: schedule
 * @LastEditors: HL
 * @LastEditTime: 2020-02-21 19:20:55
 -->
<template>
  <div class="demo">
    <demo comId="scheduleComponent1" :timeSetp="0.5"></demo>
    <demo comId="scheduleComponent2" :timeSetp="1"></demo>
    <demo comId="scheduleComponent3" :timeSetp="0.25"></demo>
  </div>
</template>
<script>
import Demo from "./index";
export default {
  data() {
    return {

    };
  },
  methods: {

  },
  components: {
    Demo
  }
};
</script>
<style scoped lang="less">
.demo {
  display: block;
  width: 800px;
  margin: 0 auto;
  padding-top: 20px;
  background-color: #fff;
  & > p {
    height: 500px;
  }
}
</style>
