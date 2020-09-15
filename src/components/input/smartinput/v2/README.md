#### 
```vue
<template>
  <div class="vue-ele-ts-base__word-input">
    <word-input v-model="value"
                :showLimit="true"
                :maxLen="20"
                :setting="setting"
                :doubleCodeAble="true"
                :defaultShowLen="4"
                :wordList="wordList"
                :wordSetting="wordSetting"
                @loadMore="loadMore"></word-input>
    <word-input v-model="value2"
                :showLimit="true"
                :maxLen="20"
                :setting="setting"
                :doubleCodeAble="true"
                :defaultShowLen="4"
                :wordList="wordList"
                :wordSetting="wordSetting"
                @loadMore="loadMore"></word-input>
    <more-dialog ref="moreDialogRef" @insert="insert"></more-dialog>
  </div>

</template>

<script>
import WordInput from "@/components/input/smartinput/v2/index";
import MoreDialog from "@/views/others/example/wordInput/chooseDialog.vue";
import {wordPackage} from "@/config/dataBase/example";
import {Enums} from "@/util/tools/enum.ts";

const WordListEnums = new Enums(wordPackage);
export default {
  name: "wordInputExample",
  data() {
    return {
      value: "测试词包{地点},{错误词包}",
      value2: "",
      setting: {
        placeHolder: "请输入",
        size: "normal",
        style: "",
        label: "动态词包"
      },
      wordList: WordListEnums.getValues(),
      wordSetting: {
        key: 'creativeWordId',
        label: 'label',
        length: 'maxWordLen'
      },
      wordCbCache: null,
      moreTitle: [
        {
          name: '词包',
          prop: 'label',
          issort: false,
          renderType: 'default'
        },
        {
          name: '默认词',
          prop: 'defaultWord',
          issort: false,
          renderType: 'default'
        },
        {
          name: '替换词',
          prop: 'words',
          issort: false,
          renderType: 'template',
          slotName: 'words'
        },
        {
          name: '操作',
          prop: 'eidt',
          issort: false,
          renderType: 'custormedit',
          edit: [
            {
              name: '插入',
              type: 1
            }
          ]
        }]
    }
  },
  methods: {
    loadMore(cb) {
      this.wordCbCache = cb;
      this.$refs.moreDialogRef.openDialog({
        tableData: this.wordList,
        tableTitle: this.moreTitle
      });
    },
    // 添加词包
    insert(item, type) {
      this.wordCbCache && this.wordCbCache(item)
    }
  },
  components: {
    WordInput,
    MoreDialog
  }
}
</script>

<style scoped>

</style>
```

