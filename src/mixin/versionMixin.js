/*
 * @Description: 版本更新提示mixin
 * @LastEditors: HL
 * @LastEditTime: 2020-07-02 00:48:39
 */
import { FunctionUtil } from "@/util/expand/FunctionUtil.ts";

export default {
  data() {
    return {
      curHash: null,
      timerVersion: null,
      notify: null
    };
  },
  methods: {
    async getHash() {
      const response = await this.$axios.get(`${window.location.protocol}//${window.location.host}/`);
      let el = document.createElement('html');
      el.innerHTML = response.data;
      const newHash = this._getJsHash(el);
      let words = this.generateWords();
      if (newHash !== this.curHash) {
        if (!this.notify) {
          this.notify = this.$notify({
            title: '已有新版本,请您强制刷新后使用',
            type: "warning",
            dangerouslyUseHTMLString: true,
            message: `<p>${words}</p>`,
            duration: 0,
            onClose: () => {
              this.notify = null;
              if (this.notify) {
                this.notify.close();
              }
            }
          });
        }
      }
    },
    _getJsHash(el) {
      let new_hash_src = el.getElementsByTagName('script')[0].src.split('/');
      return new_hash_src[new_hash_src.length - 1].split('.')[1];
    },
    generateWords() {
      if (FunctionUtil.isWin()) {
        return "WINDOWS用户,请在完成当前操作后,使用CTRL+F5清除缓存并刷新";
      } else if (FunctionUtil.isMac()) {
        return "MAC用户,请在完成当前操作后,使用shift+command+r清除缓存并刷新";
      } else {
        return "请在完成当前操作后,强制刷新后使用";
      }
    }
  },
  mounted() {
    this.curHash = this._getJsHash(document.getElementsByTagName('body')[0]);
    this.timerVersion = setInterval(this.getHash, 300000);
  }
};
