import axios from "axios";
import Raven from "raven-js";
import RavenVue from 'raven-js/plugins/vue';
import { cfg } from "@/config/env";
import { createDbLink, lfKeyMap } from "@/util/app/localForage.js";
import { DebugTool } from "@/util/deptools/DebugTool.ts";
import VueError from "@/util/errHandle";
import moment from "moment";
import _ from "lodash";

moment.locale("zh-cn");

const basePrototype = (Vue) => {
  Vue.prototype.$axios = axios;
  Vue.prototype.$moment = moment;
  Vue.prototype.$_ = _;
  Vue.prototype.$lf = createDbLink('base');
  if (process.env.NODE_ENV !== 'development') {
    Vue.use(VueError);
  }
  // sentry配置
  if (cfg.sentry.realease) {
    Raven.config(cfg.sentry.DSN, {
      release: cfg.sentry.realease
    })
      .addPlugin(RavenVue, Vue)
      .install();
    Vue.use(VueError);
  }
};

// 自定义挂载
const toolPrototype = (Vue) => {
  Vue.prototype.$tools = {
    lf: createDbLink('base'),
    batchLf: createDbLink('batch'),
    bacthCache: async (key) => {
      try {
        let data = await Vue.prototype.$tools.batchLf.getItem(lfKeyMap.promotion.batch.renderCacheKs);
        if (data) {
          console.log(data);
          return key ? data['key'] : data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    tool: DebugTool
  };
};
export default function usePrototype(Vue) {
  basePrototype(Vue);
  toolPrototype(Vue);
}
