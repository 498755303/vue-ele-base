<template>
  <div class="demo-dropdown">
    <hl-dropdown title="请选择广告类型"
                 :showSelected="false"
                 trigger.sync="hover"
                 :hideOnLeave="true"
                 :value.sync="dropVal"
                 placement="top"
                 type="text"
                 :showArrow="true"
                 :data="dropData">
      <i class="iconfont icon-paixu"
         slot="titleIcon"></i>

    </hl-dropdown>
  </div>
</template>
<script>
import hlDropdown from "../packages/index";
export default {
  props: {},
  data() {
    return {
      dropData: [
        {
          id: 1,
          label: "所有广告"
        },
        {
          id: 2,
          label: "近一周有消耗计划",
          disabled: true
        },
        {
          id: 3,
          label: "近一月有消耗计划"
        }
      ],
      dropVal: 1
    };
  },
  computed: {},
  methods: {},
  components: { hlDropdown },
  created() {}
};
</script>
<style scoped lang="less">
.demo-dropdown {
  width: 200px;
  margin-top: 200px;
}
</style>
