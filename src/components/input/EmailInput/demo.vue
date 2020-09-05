<template>
  <div class="demo">
    <el-input type="text"></el-input>
    <email-input ref="emlIpt"
                 @change="_changeHandle"></email-input>
    <div class="select">
      <p>已输入收件人邮箱:</p>
      <ul>
        <li v-for="(item,index) in emails"
            :key="index">{{item}}</li>
      </ul>
    </div>
    <email-input ref="emlIpt2"
                 @change="_changeHandle2"></email-input>
    <div class="select">
      <p>已输入抄送邮箱:</p>
      <ul>
        <li v-for="(item,index) in ccEmails"
            :key="index">{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import EmailInput from "./index";
export default {
  data() {
    return {
      emails: [],
      ccEmail: []
    };
  },
  methods: {
    _changeHandle(list) {
      this.emails = list;
    },
    _changeHandle2(list) {
      this.ccEmails = list;
    }
  },
  components: {
    EmailInput
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.demo {
  width: 800px;
  // height: 50px;
}
</style>
