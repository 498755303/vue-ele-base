<template>
  <div class="vue-ele-base_home">
    <h3 v-if="copyData && copyData.title">{{ copyData.title }}</h3>
    <template v-if="copyData && copyData.list && copyData.list.length">
      <p v-for="(item,index) in copyData.list" :key="'index_'+index">{{ item.label }}</p>
    </template>
  </div>
</template>
<script>
import {Enums} from "@/util/tools/enum.ts";
import {Validate} from "@/util/tools/validate.ts";
import {CopyPropertyUtil} from "@/util/tools/CopyPropertyUtil.ts";
import {materialType} from "@/config/dataBase/app.js";

const MaterialTypeEnum = new Enums(materialType);
const demoText = {
  title: "欢迎使用vue-ele-ts-base",
  list: [
    {
      label: "欢迎使用"
    },
    {
      label: "欢迎使用"
    },
    {
      label: "欢迎使用"
    }
  ]
}
export default {
  data() {
    return {
      copyData: null
    };
  },
  methods: {
    demoHandle() {
      const copyData = CopyPropertyUtil.objDeepCopy(demoText);
      this.copyData = Validate.isNotEmpty(copyData) ? copyData : null
      this.copyData.materialTypeName = MaterialTypeEnum["MATERIAL_TYPE_PIC"].label
    }
  },
  created() {
    this.demoHandle()
  }
};
</script>
<style lang="less" scoped>
.vue-ele-base_home {
  min-height: 100vh;
  padding: 30px 50px;
  text-align: center;
  box-sizing: border-box;
  background: #fff;

  h3 {
    line-height: 100px;
  }

  p {
    line-height: 50px;
  }
}
</style>
