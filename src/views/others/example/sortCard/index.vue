<template>
  <div class="sort-card-example">
    <h4>简单排序</h4>
    <sort-card :data="sortData" ref="sortCardRef" @sort="sortHandle" :simpleSort="true"></sort-card>
    <h4>正常排序</h4>
    <sort-card :data="sortData" ref="sortCardNormalRef" @sort="sortHandleNormal" :simpleSort="false"></sort-card>
  </div>
</template>

<script>
import SortCard from "@/components/sortCard/index";

export default {
  name: "sortCardExample",
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
    }
  },
  methods: {
    sortHandle(o) {
      console.log(o);
    },
    sortHandleNormal(o) {
      console.log(o)
    }
  },
  components: {
    SortCard
  }
}
</script>
