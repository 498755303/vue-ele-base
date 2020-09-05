<template>
  <div class="word-input">
    <div class="clearfix word-input-wrap">
      <input type="text"
             :size="settings.size || 'normal'"
             :id="inputId"
             class="word-input-content"
             :placeholder="settings.placeHolder"
             v-model.trim="inputVal"
             :style="settings.style"
             @input="inputHandle"
             @keyup="keyupHandle"
             @keydown="keydownHandle"
             @select="selectHandle"
             @click="clickInputHandle"
             @blur="blurHandle"
             autocomplete="off">
      <p v-show="showWordLimit"
         :class="{'word-input-length':true,'err':overLength}">{{ inputLen }} / {{ settings.maxLen }} </p>
    </div>
    <p class="word-input-tips"
       v-show="showTip">{{ tipWord }}</p>
    <div class="word-input-list-wrap">
      <ul class="word-input-bags">
        <li style="cursor: pointer" v-for="(item,index) in wordListData"
            :key="'bags_'+index"
            @click.stop="addWords(item,index)">
          {{ item[property.label] }}
        </li>
      </ul>
      <span v-if="showMore"
            class="word-input-more"
            @click.stop="loadMore">更多</span>
    </div>
    <more-words :ref="inputId+'word'"
                @insert="addWords"></more-words>
  </div>
</template>
<script>
import moreWords from './chooseDialog.vue';
import { CopyPropertyUtil } from '@/util/tools/CopyPropertyUtil.ts';

const noop = _ => _;
export default {
  data() {
    return {
      inputVal: '', // 输入值
      oriInputLength: 0, // 旧字符串长度,非转换后长度
      inputLen: 0, // 输入值的长度
      tipWord: '', // 提示文字
      curPosition: null, // 当前光标所在位置
      showTip: false, // 是否显示提示
      // -wordBags  word:词包名 placeholder:词包内的词最多可站内容长度
      wordBags: null,
      // -timer
      timer: null,
      bagRegAll: new RegExp(/\{(.*?)\}/, 'g'),
      bagReg: new RegExp(/\{(.*?)\}/),
      cache: [], // 匹配缓存值[{start:0,end:2,value:"{地域}"]
      inputEl: ''
    };
  },
  props: {
    // 配置
    property: {
      type: Object,
      default() {
        return {
          key: 'id',
          label: 'label',
          length: 'length'
        };
      }
    },
    inputId: {
      type: String,
      default: 'ipt'
    },
    settings: {
      type: Object,
      default: function () {
        return {
          placeHolder: '输入标题或是采用创意搜索选择优质内容',
          wordMaxLen: 2, // 词包最多数量
          minLen: 5,
          maxLen: 30
        };
      }
    },
    showWordLimit: {
      type: Boolean,
      default: true
    },
    wordList: {
      type: Array,
      default: function () {
        return [
          {
            desc: null,
            id: 266,
            label: '地域',
            platformId: 7,
            sId: 40,
            sName: '动态词包类型',
            value: 'REGION',
            length: 4
          },
          {
            desc: null,
            id: 267,
            label: '年龄',
            platformId: 7,
            sId: 40,
            sName: '动态词包类型',
            value: 'AGE',
            length: 3
          },
          {
            desc: null,
            id: 268,
            label: '星期',
            platformId: 7,
            sId: 40,
            sName: '动态词包类型',
            value: 'WEEK',
            length: 3
          },
          {
            desc: null,
            id: 269,
            label: '日期',
            platformId: 7,
            sId: 40,
            sName: '动态词包类型',
            value: 'DATE',
            length: 6
          }
        ];
      }
    },
    // 默认显示数
    defaultLen: {
      type: Number,
      default: 4
    },
    index: {
      type: Number,
      default: 0
    },
    // 是否显示更多
    showMore: {
      type: Boolean,
      default: true
    },
    // 更多配置
    moreSetting: {
      type: Object,
      default() {
        return {
          // 是否静态数据
          isStatic: true,
          // 获取方法
          getFn: noop,
          // table表头数据
          tableTitle: []
        };
      }
    },
    // 是否启用特殊字节 两字符算1字节
    doubleCodeable: {
      type: Boolean,
      default: false
    },
    // 特殊字符范围
    doubleCode: {
      default() {
        return new RegExp('[^\x00-\xff]', 'g');
      }
    }
  },
  computed: {
    wordListData: function () {
      let tmp = CopyPropertyUtil.objDeepCopy(this.wordList);
      return tmp.splice(0, this.defaultLen);
    },
    // 是否超长
    overLength: function () {
      return this.inputLen - this.settings.manLen > 0;
    }
  },
  methods: {
    // 词包点击事件
    addWords(item, index) {
      if (this.cache.length >= this.settings.wordMaxLen) {
        this.tipWord = `词包最大数量为${this.settings.wordMaxLen}`;
        this.showTip = true;
        return;
      } else {
        let inputLength = this.inputVal.length;
        this.curPosition = this.curPosition || [inputLength, inputLength];
        let resInsert = this.privateInsertWords(
          this.curPosition[0],
          this.curPosition[1],
          item[this.property.label]
        );
        let cacheTmp = {
          start: this.curPosition[0],
          end: this.curPosition[0] + (item[this.property.label].length - 0 + 1),
          value: '{' + item[this.property.label] + '}',
          len: item[this.property.length],
          id: item[this.property.key]
        };
        this.inputVal = resInsert.value;
        // this.inputLen =
        //   this.inputLen -
        //   (this.curPosition[1] - this.curPosition[0]) +
        //   item[this.property.length];
        if (this.cache) {
          if (this.cache.length == 0) {
            this.cache.push(cacheTmp);
          } else {
            this.privateModifyPosition(this.curPosition[0], resInsert.subLen);
            this.cache.push(cacheTmp);
            this.cache.sort(this.privateSort('start'));
          }
        } else {
          this.cache = [];
          this.cache.push(cacheTmp);
        }
        this.oriInputLength = this.inputVal.length;
        this.curPosition = [this.inputVal.length, this.inputVal.length];
        this.privateValidate();
      }
      this._calcLength();
      this.$emit('add', {
        error: this.showTip,
        errorInfo: this.tipWord,
        value: this.inputVal,
        wordlist: this.cache,
        length: this.inputLen,
        index: this.index
      });
    },
    // input事件
    inputHandle(e) {
      console.log(`%c input event `, 'color:#F56C6C;');
      this.curPosition = this.privateGetPosition();
      if (e.inputType == 'deleteContentBackward') {
        if (!this.privateEmpty()) {
          this.deleteHandle();
        }
      } else {
        let nowLen = this.inputVal.length;
        let subLen = nowLen - this.oriInputLength;
        this.oriInputLength = nowLen;
        this.privateModifyPosition(this.curPosition[0] - subLen, subLen);
      }
      this._calcLength();
      this.privateValidate();
    },
    // keydown事件
    keydownHandle(e) {
      // this.privateInWord();
      let resVal;
      this.curPosition = this.privateGetPosition();
      if (e.keyCode == 37) {
        if (this.cache && this.cache.length) {
          for (var i = 0; i < this.cache.length; i++) {
            if (this.cache[i].end == this.curPosition[0] - 1) {
              resVal = this.cache[i];
              break;
            }
          }
        }
        if (resVal) {
          this.inputEl.setSelectionRange(resVal.start + 1, resVal.start + 1);
        }
      } else if (e.keyCode == 39) {
        if (this.cache && this.cache.length) {
          for (var j = 0; j < this.cache.length; j++) {
            if (this.cache[j].start == this.curPosition[0]) {
              resVal = this.cache[j];
              break;
            }
          }
        }
        if (resVal) {
          this.inputEl.setSelectionRange(resVal.end, resVal.end);
        }
      }
    },
    // keyUp事件
    keyupHandle(e) {
      console.log(`%c keyup event `, 'color:#F56C6C;');
      if ([37, 39].includes(e.keyCode)) {
        this.privateInWord();
      }
      if (e.keyCode == 8) {
        this.curPosition = this.privateGetPosition();
        if (this.curPosition[0] == 0 && this.curPosition[1] == 0) {
          this.cache = [];
        }
      }
      this._calcLength();
    },
    // click事件
    clickInputHandle(e) {
      console.log(`%c click event `, 'color:#F56C6C;');
      this.privateInWord();
    },
    // 选中处理
    selectHandle(e) {
      console.log(`%c select event `, 'color:#67C23A;');
      // 选中的开始在一个缓存里或结束在一个里 光标到最后
      this.privateSetPosition2Final();
    },
    // 删除处理
    deleteHandle() {
      console.log(`%c del event `, 'color:#F56C6C;');
      let resVal, resIndex;
      this.curPosition = this.privateGetPosition();
      let subLen = this.oriInputLength - this.inputVal.length;
      if (subLen > 1) {
        // 多选删除
        this.privateModifyPosition(this.curPosition[0], -subLen);
      } else {
        if (this.cache && this.cache.length) {
          for (var i = 0; i < this.cache.length; i++) {
            if (this.cache[i].end == this.curPosition[0]) {
              resVal = this.cache[i];
              resIndex = i;
              break;
            }
          }
        }
        if (resVal) {
          let tmp =
              this.inputVal.slice(0, resVal.start) +
              this.inputVal.slice(resVal.end, this.inputVal.length);
          this.inputVal = tmp;
          this.privateModifyPosition(resVal.start, -resVal.value.length);
          this.cache.splice(resIndex, 1);
        } else {
          this.privateModifyPosition(this.curPosition[0], -1);
        }
      }

      this.oriInputLength = this.inputVal.length;
      this.privateValidate();
    },
    // blur处理
    blurHandle() {
      this.curPosition = this.privateGetPosition();
      this.privateValidate();
      this.$emit('input-blur', {
        error: this.showTip,
        errorInfo: this.tipWord,
        value: this.inputVal,
        wordlist: this.cache,
        length: this.inputLen,
        index: this.index
      });
    },
    validForm() {
      return new Promise((resolve, reject) => {
        this.privateValidate();
        this.$emit('validate', this.showTip, this.index);
        if (this.showTip) {
          reject(new Error('验证失败'));
        } else {
          resolve();
        }
      });
    },
    clearValidate() {
      this.showTip = false;
      this.tipWord = '';
    },
    // 加载更多
    loadMore() {
      let refEl = this.$refs[this.inputId + 'word'];
      if (refEl) {
        refEl.openDialog(this.moreSetting);
      }
    },
    // 获取当前光标所在位置
    privateGetPosition() {
      return [this.inputEl.selectionStart, this.inputEl.selectionEnd];
    },
    // 排序方法
    privateSort(propertyName) {
      return function (obj1, obj2) {
        let value1 = obj1[propertyName];
        let value2 = obj2[propertyName];
        if (value2 > value1) {
          return -1;
        } else if (value2 < value1) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    // 指定位置插入
    privateInsertWords(start, end, insertStr) {
      let oriLength = this.inputVal.length;
      let tmp = [
        this.inputVal.slice(0, start),
        this.inputVal.slice(end, oriLength)
      ];
      tmp = tmp.join(`{${insertStr}}`);
      let newLength = tmp.length;
      return {
        subLen: newLength - oriLength,
        value: tmp
      };
    },
    // 选中的包含{},且选择开始不是第一位，去最后
    privateSetPosition2Final() {
      this.curPosition = this.privateGetPosition();
      let sVal = this.inputVal.slice(this.curPosition[0], this.curPosition[1]);
      if (this.curPosition[0] == 0) {
        for (var i = 0; i < this.cache.length; i++) {
          if (this.cache[i].start <= this.curPosition[1] && this.cache[i].end >= this.curPosition[1]) {
            let vLen = this.inputVal.length;
            this.inputEl.setSelectionRange(vLen, vLen);
          }
        }
        return;
      }
      // if (this.curPosition[0] == 0) {
      //   // 选择到最前面
      //   for (var i = 0; i < this.cache.length; i++) {
      //     if (this.cache[i].start >= this.curPosition[0] && this.cache[i].end <= this.curPosition[1]) {
      //       this.cache.splice(i, 1);
      //     }
      //   }
      //   return;
      // }
      if (sVal.includes('{') || sVal.includes('}')) {
        let vLen = this.inputVal.length;
        this.inputEl.setSelectionRange(vLen, vLen);
      }
    },
    // 光标在词包中
    privateInWord() {
      if (this.cache) {
        this.curPosition = this.privateGetPosition();
        this.cache.forEach(v => {
          if (this.curPosition[1] <= v.end && this.curPosition[1] > v.start) {
            this.inputEl.setSelectionRange(v.end + 1, v.end + 1);
          }
        });
      }
    },
    // 匹配数据返回值和索引(this.inputVal,bagReg)
    privateMatch(oriStr, reg) {
      let matchRes = [];
      let tmpStr = oriStr;
      let sliceLen = 0;
      let matchVal = tmpStr.match(reg);

      while (matchVal) {
        matchRes.push({
          start: matchVal.index + sliceLen,
          end: matchVal.index + matchVal[0].length + sliceLen - 1,
          value: matchVal[0]
        });

        tmpStr = tmpStr.slice(
          matchVal.index + matchVal[0].length,
          tmpStr.length
        );
        sliceLen = sliceLen + matchVal[0].length + matchVal.index;
        matchVal = tmpStr.match(reg);
      }
      return matchRes;
    },
    // 根据匹配数据生成数据
    privateGenerateLenData(matchlist, cache, oriStr) {
      let wordList = [];
      let otherList = [];
      let flag = true;
      if (matchlist && matchlist.length) {
        matchlist.forEach((value, index) => {
          let tmp = cache.filter(v => {
            return v.start == value.start;
          });
          if (tmp && tmp.length) {
            wordList.push(tmp[0]);
          } else {
            otherList.push(value);
          }
        });
      }
      let subNum = 0;
      if (wordList && wordList.length) {
        wordList.forEach(v => {
          subNum = subNum + (v.len - v.value.length);
        });
      }
      if (this.inputVal) {
        if (!(otherList && otherList.length)) {
          let regL = this.inputVal.match(/{/g);
          let regR = this.inputVal.match(/}/g);
          if (regL && regR) {
            if (regL.length == regR.length) {
              flag = true;
            } else {
              flag = false;
            }
          } else if (regL && !regR) {
            flag = false;
          } else if (!regL && regR) {
            flag = false;
          } else {
            flag = true;
          }
        }
      }
      let error, tipInfo;
      if (!flag || (otherList && otherList.length)) {
        error = true;
        tipInfo = '输入不能存在特殊字符';
      } else {
        if (
          this.inputLen < this.settings.minLen ||
            this.inputLen > this.settings.maxLen
        ) {
          error = true;
          tipInfo = `输入字符长度应在${this.settings.minLen}-${
            this.settings.maxLen
          }范围内`;
        } else {
          error = false;
        }
      }
      return {
        wordList: wordList,
        error: error,
        tipInfo: tipInfo,
        inputLen: parseInt(oriStr.length) + subNum,
        inputRealLen: oriStr.length
      };
    },
    // 修改指定位置之后的位置
    privateModifyPosition(index, length) {
      this.cache.map((val, idx) => {
        if (val.start >= index) {
          val.start = val.start + length;
          val.end = val.end + length;
        }
      });
    },
    // 计算字符长度
    _calcLength() {
      let len = 0;
      let wordLen = 0;
      let copyStr = this.inputVal;
      if (this.cache && this.cache.length) {
        this.cache.forEach(item => {
          copyStr = copyStr.replace(item.value, "");
          wordLen += item.len;
        });
      }
      len = this.doubleCodeable ? this._doubleCalcLength(copyStr, this.doubleCode) : copyStr.length;
      this.inputLen = len + wordLen;
    },
    // 是否为空
    privateEmpty() {
      let len = this.inputVal.length;
      if (!len) {
        this.tipWord = '输入内容不能为空';
        this.showTip = true;
      } else {
        this.tipWord = '';
        this.showTip = false;
      }
      return !len;
    },
    _doubleCalcLength(inputVal, regxp) {
      const doubleStr = (inputVal || '').match(regxp);
      let doubleStrLen = doubleStr ? doubleStr.length : 0;
      const othLen = (inputVal || '').length - doubleStrLen;
      return doubleStrLen + Math.ceil(othLen / 2);
    },
    // 校验数据
    privateValidate() {
      let len = this.inputVal.length;
      if (len) {
        this._calcLength();
        if (
          this.inputLen < this.settings.minLen ||
            this.inputLen > this.settings.maxLen
        ) {
          this.tipWord = `输入字符长度应在${this.settings.minLen}-${this.settings.maxLen}之间`;
          this.showTip = true;
        } else {
          let matchRes = this.privateMatch(this.inputVal, this.bagReg);
          let lenRes = this.privateGenerateLenData(
            matchRes,
            this.cache,
            this.inputVal
          );
          if (lenRes.error) {
            this.tipWord = lenRes.tipInfo;
            this.showTip = true;
          } else {
            this.showTip = false;
            this.tipWord = '';
          }
        }
      } else {
        this.tipWord = '输入字符不能为空';
        this.showTip = true;
      }
    },
    // 初始化匹配数据位置
    privateMatchPosition(item) {
      let label = '{' + item[this.property.label] + '}';
      let reg = new RegExp(label);
      let matchVal = this.privateMatch(this.inputVal, reg);
      if (matchVal && matchVal.length) {
        matchVal.map(v => {
          v.len = item[this.property.length];
          v.id = item[this.property.key];
        });
      }
      return matchVal;
    },
    // 设置数据
    setInitData(data) {
      this.cache = [];
      if (data) {
        this.inputVal = data.title || '';
        this.oriInputLength = this.inputVal.length;
        this.tipWord = data.error ? '输入有误,请查证' : ''; // 提示文字
        this.curPosition = null; // 当前光标所在位置
        this.showTip = data.error; // 是否显示提示
        if (data.titleWordIds) {
          let wordList = data.titleWordIds.split(',');
          wordList.forEach(value => {
            let tmp = this.wordList.filter(val => {
              return value == val[this.property.key];
            });
            if (tmp && tmp[0]) {
              let matchRes = this.privateMatchPosition(tmp[0]);
              if (matchRes && matchRes.length) {
                this.cache = this.cache.concat(matchRes);
              }
            }
          });
          this._calcLength();
        } else {
          this.cache = [];
          this.inputLen = this._calcLength();
        }
      } else {
        this.inputVal = '';
        this.oriInputLength = 0; // 旧字符串长度,非转换后长度
        this.inputLen = 0; // 输入值的长度
        this.tipWord = ''; // 提示文字
        this.curPosition = null; // 当前光标所在位置
        this.showTip = false; // 是否显示提示
        this.cache = []; // 匹配缓存值[{start:0,end:2,value:"{地域}"]
      }
    }
  },
  components: { moreWords },
  mounted() {
    this.inputEl = document.getElementById(this.inputId);
  }
};
</script>
<style lang="less" scoped>
@baseClass: word-input;
@inputW: 300px;
@inputH: 40px;
@inputBorderRadius: 5px;
@inputPadding: 0 5px;
@borderColor: #dee4f5;
@fSzie: 14px;
@fColor: #555;
@marginRight: 10px;
@tipSize: 12px;
@lenColor: #888;
@tipErrColor: #f05656;
@tipH: 30px;
@blueColor: #2f88ff;
@activeColor: #409eff;
* {
  margin: 0;
  padding: 0;
}

.@{baseClass} {
  .@{baseClass}-wrap {
    .@{baseClass}-content {
      float: left;
      width: @inputW;
      height: @inputH;
      line-height: @inputH;
      border-radius: @inputBorderRadius;
      padding: @inputPadding;
      border: 1px solid @borderColor;
      letter-spacing: 2px;
      font-size: @fSzie;
      color: @fColor;
    }

    .@{baseClass}-length {
      float: left;
      height: @inputH;
      line-height: @inputH;
      margin-left: @marginRight;
      font-weight: 100;
      font-size: @tipSize;
      color: @lenColor;

      &.err {
        color: @tipErrColor;
      }
    }
  }

  .@{baseClass}-tips {
    height: @tipH;
    margin-left: 10px;
    color: @tipErrColor;
    font-size: @tipSize;
    letter-spacing: 2px;
  }

  .@{baseClass}-list-wrap {
    display: flex;
    justify-content: space-between;
    padding: 0 40px 0 0;
    box-sizing: border-box;

    .@{baseClass}-bags {
      li {
        float: left;
        margin-right: @marginRight;
        font-size: @fSzie;
        letter-spacing: 2px;
        color: @blueColor;

        &:hover {
          color: @activeColor;
        }
      }
    }

    .@{baseClass}-more {
      color: @blueColor;
      cursor: pointer;

      &:hover {
        color: @activeColor;
      }
    }
  }
}
</style>
