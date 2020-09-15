<template>
  <div class="word-package-input">
    <div class="word-package-input__content">
      <input type="text"
             :id="uuid"
             v-model.trim="inputVal"
             class="word-package-input__content-input"
             :placeholder="setting.placeHolder"
             :size="setting.size || 'normal'"
             :style="setting.style"
             autocomplete="off"
             @input="_inputHandle"
             @select="_selectHandle"
             @keyup="_keyupHandle"
             @click="_clickHandle"
             @keydown="_keyDownHandle"
             @blur="_blurHandle">
      <span v-show="showLimit"
            class="word-package-input__content-limit"
            :class="{'err':inputLength - maxLen > 0}">{{ inputLength }} / {{ maxLen }} </span>
    </div>
    <p class="word-package-input__tip" v-show="errorStr">{{ errorStr }}</p>
    <div class="word-package-input__word-content">
      <ul class="word-package-input__word-content-word">
        <li v-for="(item,index) in wordList.slice(0,defaultShowLen)"
            :key="'word_'+index"
            @click.stop="_addWord(item)">
          +{{ item[wordSetting.label] }}
        </li>
      </ul>
      <span v-if="showMore"
            class="word-package-input__word-content-more"
            @click.stop="_loadMore">更多</span>
    </div>
  </div>
</template>

<script>
/**
 * 词包输入框
 * @author HL
 * @version v2
 * @displayName 词包输入框
 */
import utilMixin from "./utilMixin.js"
import toolMixin from "./toolMixin.js";

const backDelCode = 8;
const leftKeyCode = 37;
const rightKeyCode = 39;
export default {
  name: "smartInput.vue",
  props: {
    /**
     * 绑定值,支持v-model
     * @model
     */
    value: {
      type: String,
      default: ""
    },
    /**
     * 词包数据
     */
    wordList: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 词包数据配置项{key,label,length}
     */
    wordSetting: {
      type: Object,
      default() {
        return {
          key: 'id',
          label: 'label',
          length: 'length'
        };
      }
    },
    /**
     * 词包标致 1:{} 2:[] 3()
     */
    wordType: {
      type: Number,
      default: 1
    },
    /**
     * 词包数据map缓存,用于多个组件匹配提升性能
     */
    wordMap: {
      type: Object
    },
    /**
     * 默认词包展示数
     */
    defaultShowLen: {
      type: Number,
      default: 4
    },
    /**
     * 最大词包个数
     */
    maxWordCount: {
      type: Number,
      default: 2
    },
    /**
     * 是否展示更多
     */
    showMore: {
      type: Boolean,
      default: true
    },
    /**
     * 设置项
     */
    setting: {
      type: Object,
      default() {
        return {
          label: "创意标题",
          placeHolder: "请输入",
          size: "normal",
          style: ""
        }
      }
    },
    /**
     * 是否展示限制长度
     */
    showLimit: {
      type: Boolean,
      default: true
    },
    /**
     * 最大长度
     */
    maxLen: {
      type: Number,
      default: 999
    },
    /**
     * 最小长度
     */
    minLen: {
      type: Number,
      default: 1
    },
    /**
     * 是否启用特殊字节 两字符算1字节
     */
    doubleCodeAble: {
      type: Boolean,
      default: false
    },
    /**
     * 特殊字符判定正则
     */
    doubleCode: {
      default() {
        return new RegExp('[^\x00-\xff]', 'g');
      }
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  mixins: [utilMixin, toolMixin],
  data() {
    return {
      // 唯一ID,使用vue组件内部id
      uuid: `uuid_${this._uid}`,
      // 匹配缓存词包[{start:0,end:2,value:"{地域}"]
      cache: [],
      // 输入值
      inputVal: this.value,
      // 校验错误信息
      errorStr: "",
      inputEle: ''
    }
  },
  methods: {
    // 插入词包
    _addWord(item) {
      const curWords = this._findWordIndex();
      const label = this._generateWordLabel(item[this.wordSetting.label]);
      if (curWords && curWords.length === 2) {
        this._errorEmit(`最多选择${this.maxWordCount}个词包`, false);
        return
      }
      // 非选择插入
      const curPosition = this._getCurPosition();
      if (curPosition) {
        if (curPosition[0] === curPosition[1]) {
          const inWord = this._isInWord(curWords, curPosition);
          if (inWord.flag) {
            this.inputVal = this._splice(this.inputVal, inWord.data[0].end + 1, label);
          } else {
            this.inputVal = this._splice(this.inputVal, curPosition[0], label);
          }
          this._setCurPosition(this.inputEle, this.inputVal.length, this.inputVal.length)
        } else {
          this.inputVal = this._spliceStr(this.inputVal, curPosition[0], curPosition[1], label)
        }
      }
      this.valid();
      /**
       * 添加词包事件
       * @type {item} 词包项
       */
      this.$emit('add', item);
    },
    // 更多
    _loadMore() {
      /**
       * 加载更多词包事件
       * @type {item} 词包项
       */
      this.$emit('loadMore', (item) => {
        item && this._addWord(item)
      });
    },
    // 输入值变化事件
    _inputHandle() {
      console.log(`%c input event `, 'color:#F56C6C;');
      this.valid();
    },
    // 选中处理,起始为0不处理,其余包含词包或在词包中,光标滞后
    _selectHandle(e) {
      console.log("select event")
      const curWords = this._findWordIndex();
      const curPosition = this._getCurPosition();

      if (curPosition && curPosition.length) {
        if (curPosition[0] !== 0) {
          // 是否在词包内
          const inWord = this._isInWord(curWords, curPosition)
          if (inWord && inWord.flag) {
            this._setCurPosition(this.inputEle, this.inputVal.length, this.inputVal.length);
          }
          // 是否包含词包
          const isContainWordChar = this._isContainWord(this.inputVal, curPosition[0], curPosition[1]);
          if (isContainWordChar) {
            this._setCurPosition(this.inputEle, this.inputVal.length, this.inputVal.length);
          }
        }
      }
    },
    // 按键事件
    _keyDownHandle(e) {
      const curWords = this._findWordIndex();
      const curPosition = this._getCurPosition();
      const keyCode = e.keyCode;
      switch (keyCode) {
        case backDelCode:
          const isAfterWord = this._isAfterWord(curWords, curPosition);
          if (isAfterWord && isAfterWord.flag) {
            e.preventDefault();
            this.inputVal = this._spliceStr(this.inputVal, isAfterWord.data[0].start, isAfterWord.data[0].end + 1, "");
          }
          break;
        default:
          break;
      }
    },
    // 点击事件
    _clickHandle(e) {
      const curWords = this._findWordIndex();
      const curPosition = this._getCurPosition();
      const inWord = this._isInWord(curWords, curPosition);
      if (inWord && inWord.flag) {
        this._setCurPosition(this.inputEle, inWord.data[0].end + 1, inWord.data[0].end + 1);
      }
    },
    // 按键事件
    _keyupHandle(e) {
      console.log("------------按键是:" + e.keyCode + "--------------")
      const curWords = this._findWordIndex();
      const curPosition = this._getCurPosition();
      const keyCode = e.keyCode;
      const inWord = this._isInWord(curWords, curPosition)
      switch (keyCode) {
        case leftKeyCode:
          if (inWord && inWord.flag) {
            this._setCurPosition(this.inputEle, inWord.data[0].start, inWord.data[0].start);
          }
          break;
        case rightKeyCode:
          if (inWord && inWord.flag) {
            this._setCurPosition(this.inputEle, inWord.data[0].end + 1, inWord.data[0].end + 1);
          }
          break;
        default:
          break;
      }
    },
    _blurHandle(e) {
      /**
       * blur事件
       * @type {e} 事件
       */
      this.$emit('blur', e);
    },
    /**
     * 校验
     * @returns {boolean} 是否校验成功
     */
    valid() {
      console.log('------------------校验---------------------')
      // 校验长度
      const validLenInfo = this._validLength();
      if (validLenInfo && !validLenInfo.pass) {
        this.errorStr = validLenInfo.message;
        this._errorEmit(this.errorStr, true);
        return false;
      }
      const validSpecialInfo = this._validSpecialWord();
      if (validSpecialInfo && !validSpecialInfo.pass) {
        this.errorStr = validSpecialInfo.message;
        this._errorEmit(this.errorStr, true);
        return false;
      }
      const validCorrectInfo = this._validCorrectWord();
      if (validCorrectInfo && !validCorrectInfo.pass) {
        this.errorStr = validCorrectInfo.message;
        this._errorEmit(this.errorStr, true);
        return false;
      }
      this.errorStr = "";
      return true;
    },
    /**
     * 清空校验结果
     */
    clearValidate() {
      this.errorStr = "";
    },
    // 提交错误信息
    _errorEmit(msg, tipType) {
      /**
       * 校验错误事件
       * @type {msg}:string 错误信息
       */
      this.$emit("error", msg, tipType)
    }
  },
  computed: {
    // 计算后输入值长度
    inputLength() {
      return this._calcLength();
    }
  },
  mounted() {
    this.inputEle = document.getElementById(this.uuid);
    if (this.inputVal) {
      this.valid();
    }
  },
  watch: {
    inputVal(nv) {
      this.$emit("change", nv)
    }
  }
}
</script>

<style scoped lang="less">
@baseClass: word-package-input;
@inputW: 500px;
@inputH: 40px;
@inputBorderRadius: 5px;
@inputPadding: 0 5px;
@fSize: 14px;
@tipSize: 12px;
@marginRight: 10px;

@fC: #555;
@tipC: #CCCCCC;
@primaryC: #3399FF;
@activeC: #409eff;
@errC: #FC382D;
@borderC: #dee4f5;
.@{baseClass}__content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  .@{baseClass}__content-input {
    width: @inputW;
    height: @inputH;
    line-height: @inputH;
    border-radius: @inputBorderRadius;
    padding: @inputPadding;
    border: 1px solid @borderC;

    font-size: @fSize;
    color: @fC;
  }

  .@{baseClass}__content-limit {
    height: @inputH;
    line-height: @inputH;
    margin-left: @marginRight;
    font-weight: 100;
    font-size: @tipSize;
    color: @tipC;

    &.err {
      color: @errC;
    }
  }
}

.@{baseClass}__tip {
  color: @errC;
  font-size: @tipSize;
  display: inline-block;
  margin-top: 4px;
}

.@{baseClass}__word-content {
  display: flex;
  width: @inputW;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: @fSize;
  color: @primaryC;

  .@{baseClass}__word-content-word {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    li {
      margin-right: @marginRight;
      cursor: pointer;

      &:hover {
        color: @activeC
      }
    }
  }

  .@{baseClass}__word-content-more {
    cursor: pointer;

    &:hover {
      color: @activeC;
    }
  }
}
</style>