<template>
  <div class="breadcrumb clearfix">
    <template v-if="data.length<=7">
      <span class="breadcrumb-item"
            v-for="(item,index) in data"
            :key="index">
        <span v-if="!item.disabled" :class="`breadcrumb__inner ${index != data.length -1 ? 'pre':''}`"
              @click.stop="click(item)">{{ item.folderName }}</span>
        <span v-else style="color: #e4e7ed;cursor:no-drop"
              :class="`breadcrumb__inner ${index != data.length -1 ? 'pre':''}`"
        >{{ item.folderName }}</span>
        <span v-if="index != data.length-1"
              class="breadcrumb__separator">/</span>
      </span>
    </template>
    <template v-else>
      <template v-for="(item,index) in data">
        <span class="breadcrumb-item"
              v-if="index>=1 && index<= data.length - 5"
              :key="'more'+index">
          <template v-if="index == data.length-5">
            <span v-if="!item.disabled" :class="`breadcrumb__inner ${index != data.length -1 ? 'pre':''}`"
                  @click.stop="click(item)">...</span>
            <span v-else style="color: #e4e7ed;cursor:no-drop"
                  :class="`breadcrumb__inner ${index != data.length -1 ? 'pre':''}`"
            >...</span>
            <span class="breadcrumb__separator">/</span>
          </template>
        </span>
        <span class="breadcrumb-item"
              v-else
              :key="'normal'+index">
          <span v-if="!item.disabled" :class="`breadcrumb__inner ${index != data.length -1 ? 'pre':''}`"
                @click.stop="click(item)">{{ item.folderName }}</span>
          <span v-else style="color: #e4e7ed;cursor:no-drop"
                :class="`breadcrumb__inner ${index != data.length -1 ? 'pre':''}`"
          >{{ item.folderName }}</span>
          <span v-if="index != data.length-1"
                class="breadcrumb__separator">/</span>
        </span>
      </template>

    </template>
  </div>
</template>
<script>
export default {
  name: "breadCrumb",
  data() {
    return {};
  },
  props: {
    data: {
      type: Array
    },
    click: {
      type: Function
    }
  }
};
</script>
<style scoped>
.breadcrumb {
  font-size: 14px;
  line-height: 1;
}

.breadcrumb-item {
  float: left;
  cursor: pointer;
}

.breadcrumb__inner {
  font-weight: 400;
  color: #303133;
  line-height: 40px;
}

.breadcrumb__separator {
  margin: 0 9px;
  font-weight: 700;
  color: #c0c4cc;
}

.breadcrumb__inner.pre {
  font-weight: 600;
}

.breadcrumb__inner.pre:hover {
  color: skyblue;
}
</style>
