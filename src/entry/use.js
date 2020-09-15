import Element from 'ele-pro-hl';
import 'ele-pro-hl/lib/theme-chalk/index.css';
// 滚动条组件
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
// 右键菜单
import vueContextmenu from 'vue-contextmenu';
// 剪贴板
import VueClipboard from 'vue-clipboard2';
import VueBus from "vue-bus";
VueClipboard.config.autoSetContainer = true;
export default function usePlugin(Vue) {
  Vue.use(vuescroll);
  Vue.use(VueBus);
  Vue.use(VueClipboard);
  Vue.use(vueContextmenu);
  Vue.use(Element, {
    size: 'medium'
  });
}
