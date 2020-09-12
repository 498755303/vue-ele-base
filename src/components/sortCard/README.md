#### 简单排序(只包含降序)
```vue
<template>
  <sort-card :data="sortData" ref="sortCardRef" @sort="sortHandle" :simpleSort="true"></sort-card>
</template>

<script>
import MutipleFilter from "./index.vue";

export default {
  data() {
    return {
      sortData: [
        {
                label: "首次发现",
                id: 1,
                value: "firstFindDate"
              },
              {
                label: "最近出现",
                id: 2,
                value: "lastFindDate"
              },
              {
                label: "发现天数",
                id: 3,
                value: "findDays"
              }              
            ]
    };
  },
  methods: {
    // 排序处理
        sortHandle() {
          switch (this.type) {
          case 1:
            this.getIcCreativeList(true);
            break;
          case 2:
            this.getIcLikeCreativeList(true);
            break;
          default:
            break;
          }
        },
  },
  components: {
    MutipleFilter
  }
};
</script>
```

