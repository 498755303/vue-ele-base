<template>
  <div class="vue-ele-base_home">
    <h3 v-if="copyData && copyData.title">{{ copyData.title }}</h3>
    <template v-if="copyData && copyData.list && copyData.list.length">
      <p v-for="(item,index) in copyData.list" :key="'index_'+index">{{ item.label }}</p>
    </template>
    <p>以下是组件demo</p>
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="排序组件" name="sortCardTab">
        <sort-card-example></sort-card-example>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SortCardExample from "@/views/others/example/sortCard";
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
      copyData: null,
      activeName: "sortCardTab"
    };
  },
  methods: {
    demoHandle() {
      const copyData = CopyPropertyUtil.objDeepCopy(demoText);
      this.copyData = Validate.isNotEmpty(copyData) ? copyData : null
      this.copyData.materialTypeName = MaterialTypeEnum["MATERIAL_TYPE_PIC"].label
    }
  },
  components: {
    SortCardExample
  },
  created() {
    this.demoHandle()
  }
};
</script>
<style lang="less" scoped>
@deep: ~'>>>';
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

@{deep} .el-tab-pane {
  & > div {
    padding: 15px;
    box-sizing: border-box;
    text-align: left;

    h4 {
      line-height: 40px;
    }
  }
}
</style>
