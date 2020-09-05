<!--
 * @Description: 新增邮箱输入框
 * @LastEditors: HL
 * @LastEditTime: 2020-02-18 10:36:47
 -->
<template>
  <div class="base-em-input clearfix"
       :title="baseTitle"
       v-clickoutside:em-label="_clickoutsideLabel"
       @click.stop="_wrapClickHandle"
       unselectable="on">
    <div class="em-input-content"
         v-if="curOperateIndex == -1">
      <input class="em-ipt-edit"
             ref="iptRefHead"
             type="text"
             :style="`width:${inputW}px`"
             v-model.trim="iptVal"
             aria-label="收件人地址输入框，请输入邮件地址，多人时地址请以分号隔开"
             @input="_inputHandle"
             v-clickoutside="_clickOutSide">
    </div>
    <div class="em-input-label clearfix"
         unselectable="on"
         v-for="(item,index) in emailList"
         :key="index">
      <span v-if="index == 0"
            class="ipt-placeholder-first ipt-placeholder"
            @click.stop="_clickPlaceHolder(-1)"></span>
      <em :class="{
              'em-label':true,
              'active':_isSelected(index)
            } "
          unselectable="on"
          @click.stop="e=>_clickEmail(e,item,index)"
          @dblclick.stop="_dbClickEmail(item,index)">{{item}}</em>
      <span class="ipt-placeholder"
            @click.stop="_clickPlaceHolder(index)"></span>
      <div class="em-input-content"
           v-if="curOperateIndex == index"
           id="emInput">
        <input class="em-ipt-edit"
               ref="iptRef"
               type="text"
               :style="`width:${inputW}px`"
               v-model.trim="iptVal"
               aria-label="收件人地址输入框，请输入邮件地址，多人时地址请以分号隔开"
               @input="_inputHandle"
               v-clickoutside="_clickOutSide">
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import Clickoutside from "./clickoutside";
export default {
  props: {
    // 外部title
    baseTitle: {
      type: String,
      default: "发给多人时地址请以分号隔开"
    }
  },
  directives: { Clickoutside },
  data() {
    return {
      curOperateIndex: null, // 当前输入框在第x后
      curSelectEmail: [],
      iptVal: "",
      emailList: ["1@qq.com;", "2@qq.com;", "3@qq.com;"],
      emailRegxp: /^([.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    };
  },
  computed: {
    inputW() {
      const el = document.querySelector(".em-ipt-edit");
      let fontSize = 1;
      let result;
      if (this.iptVal) {
        if (el) {
          fontSize = window.getComputedStyle(el).fontSize;
          if (fontSize) {
            fontSize = fontSize.slice(0, -2);
          }
        }
        result = this.iptVal.length * fontSize;
      } else {
        result = fontSize;
      }
      console.log(result);
      return result;
    }
  },
  methods: {
    // 输入值变更
    _inputHandle(e) {
      if (e.data == ";") {
        if (this.emailRegxp.test(this.iptVal.substr(0, this.iptVal.length - 1))) {
          if (!this.emailList.includes(this.iptVal)) {
            if (this.curOperateIndex != -1) {
              this.emailList.splice(this.curOperateIndex + 1, 0, this.iptVal);
              this.curOperateIndex++;
            } else {
              this.emailList.push(this.iptVal);
            }
            this.iptVal = "";
          }
        }
        this._focusInput();
      }
    },
    // 点击外部失去焦点
    _clickOutSide() {
      // 结尾分号的邮箱和邮箱归入
      const _semicolon = this.emailRegxp.test(this.iptVal.substr(0, this.iptVal.length - 1)) && this.iptVal.substr(-1) === ";";
      const _eml = this.emailRegxp.test(this.iptVal);
      let val;
      if (_semicolon) {
        val = this.iptVal;
      } else if (_eml) {
        val = this.iptVal + ";";
      }
      if (_semicolon || _eml) {
        if (this.curOperateIndex != -1) {
          this.emailList.splice(this.curOperateIndex + 1, 0, val);
          this.curOperateIndex++;
        } else {
          this.emailList.push(val);
        }
      }
      this.iptVal = "";
      this.curOperateIndex = null;
    },
    // 点击输入框
    _wrapClickHandle() {
      this.curOperateIndex = this.emailList.length - 1;
      this._focusInput();
    },
    // 已输入邮箱外部点击
    _clickoutsideLabel() {
      this.curSelectEmail = [];
    },
    // 点击已输入
    _clickEmail(e, value, index) {
      if (e.ctrlKey) {
        if (this.curSelectEmail.includes(index)) {
          let i = this.curSelectEmail.indexOf(index);
          this.curSelectEmail.splice(i, 1);
        } else {
          this.curSelectEmail.push(index);
        }
      } else {
        this.curSelectEmail = [index];
      }
    },
    // 双击已有邮箱
    _dbClickEmail(value, index) {
      this.iptVal = value;
      this.emailList.splice(index, 1);
      this.curOperateIndex = index - 1;
      this._focusInput();
    },
    // 点击占位符
    _clickPlaceHolder(index) {
      console.log(index);
      // 插入input
      this.iptVal = "";
      this.curOperateIndex = index;
      this._focusInput();
    },
    // 输入框获取焦点
    _focusInput() {
      this.$nextTick(() => {
        if (this.curOperateIndex == -1) {
          this.$refs.iptRefHead && this.$refs.iptRefHead.focus();
        } else {
          this.$refs.iptRef[0] && this.$refs.iptRef[0].focus();
        }
      });
    },
    // 是否选中
    _isSelected(index) {
      return this.curSelectEmail.includes(index);
    },
    // 退格键逻辑
    _backspaceHandle(e) {
      // 输入框内退格
      let targetClass = e.target && e.target.getAttribute("class");
      if (targetClass && targetClass.includes("em-ipt-edit")) {
        if (!this.iptVal) {
          if (!this.curSelectEmail.includes(this.curOperateIndex)) {
            this.curSelectEmail.push(this.curOperateIndex);
            this.$refs.iptRef && this.$refs.iptRef[0] && this.$refs.iptRef[0].blur();
            this.curOperateIndex = null;
          }
        }
      } else {
        // 全局退格
        if (this.curSelectEmail && this.curSelectEmail.length) {
          this.curSelectEmail.forEach((item, index) => {
            if (index != 0) {
              item--;
            }
            this.emailList.splice(item, 1);
          });
          const index = _.max(this.curSelectEmail) - this.curSelectEmail.length;
          this.curOperateIndex = index > -1 ? index : -1;
          console.log(this.curOperateIndex);
          this.curSelectEmail = [];
          this._focusInput();
        }
      }
    },
    // tab键
    _tabHandle(e) {
      // 输入框内退格
      let targetClass = e.target && e.target.getAttribute("class");
      if (targetClass && targetClass.includes("em-ipt-edit")) {
        this._clickOutSide();
      }
    },
    // 左键逻辑
    _leftHandle(e) {
      let targetClass = e.target && e.target.getAttribute("class");
      if (targetClass && targetClass.includes("em-ipt-edit")) {
        if (!this.iptVal && this.curOperateIndex >= 0) {
          this.curOperateIndex--;
        }
        this._focusInput();
      } else {
        // 全局左键
        if (this.curSelectEmail && this.curSelectEmail.length) {
          this.curOperateIndex = _.max(this.curSelectEmail) - 1;
          this.curSelectEmail = [];
          this._focusInput();
        }
      }
    },
    // 右键逻辑
    _rightHandle(e) {
      let targetClass = e.target && e.target.getAttribute("class");
      if (targetClass && targetClass.includes("em-ipt-edit")) {
        if (!this.iptVal && this.curOperateIndex != null && this.curOperateIndex != this.emailList.length - 1) {
          this.curOperateIndex++;
        }
        this._focusInput();
      } else {
        // 全局右键
        if (this.curSelectEmail && this.curSelectEmail.length) {
          this.curOperateIndex = _.max(this.curSelectEmail);
          this.curSelectEmail = [];
          this._focusInput();
        }
      }
    },
    // 键盘按键处理
    keyupHandle(e) {
      const k = e.keyCode || e.which;
      switch (k) {
      case 8:
        this._backspaceHandle(e);
        break;
      case 9:
        this._tabHandle(e);
        break;
      case 37:
        this._leftHandle(e);
        break;
      case 39:
        this._rightHandle(e);
        break;
      default:
        break;
      }
    },
    // 初始化数据
    initData() {
      this.curOperateIndex = this.emailList.length - 1;
    },
    // 获取当前输入数据
    getResult() {
      return this.emailList;
    }
  },
  created() {
    this.initData();
    document.addEventListener("keydown", this.keyupHandle);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keyupHandle);
  },
  watch: {
    emailList: {
      handler(nv) {
        this.$emit("change", nv);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style scoped lang="less">
@baseH: 30px;
.base-em-input {
  display: inline-block;
  position: relative;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  min-height: 18px;
  height: @baseH;
  line-height: @baseH;
  cursor: text;
  .em-input-label {
    color: #a0a0a0;
    float: left;
    height: 100%;
    white-space: nowrap;
    user-select: none;
    .em-label {
      float: left;
      // border: 1px solid #c2d4e3;
      padding: 0 2px;
      cursor: pointer;
      box-sizing: border-box;
      height: 100%;
      &:hover {
        background-color: #ccc;
      }
      &.active {
        background-color: #0f6099;
        color: #fff;
      }
    }
    .ipt-placeholder {
      float: left;
      display: block;
      width: 4px;
      height: 100%;
      cursor: text;
    }
    .ipt-placeholder-first {
      width: 15px;
    }
  }
  .em-input-content {
    float: left;
    height: 100%;
    overflow: hidden;
    input {
      height: 100%;
    }
  }
  &:hover {
    border-color: #c0c4cc;
  }
  &:focus-within {
    outline: none;
    border-color: #409eff;
  }
}
</style>
