<!--
 * @Description: 
 * @LastEditors: HL
 * @LastEditTime: 2020-03-16 19:07:02
 -->
<template>
  <div class="adesk-affix-demo">
    <p class="test"
       v-for="item in list"
       :key="'p1_'+item">为了测试</p>
    <div class="affix-wrap">
      <Affix :offset-top="50"
             class="test-affix">
        <span class="demo-affix">固定在顶部50px</span>
      </Affix>
    </div>
    <!-- <Affix :offset-bottom="50">
      <span class="demo-affix">固定在底部50px</span>
    </Affix> -->
    <p class="test"
       v-for="item in list"
       :key="'p2_'+item">为了测试</p>
  </div>
</template>
<script>
import Affix from "../index";
export default {
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    };
  },

  components: {
    Affix
  },

};
</script>
<style scoped lang="less">
@deep: ~">>>";
.test {
  line-height: 80px;
}
.demo-affix {
  background-color: blue;
}
.adesk-affix-demo {
  position: relative;
}
@{deep} .test-affix {
  position: absolute;
}
</style>
