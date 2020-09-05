// import 'lib-flexible';
import Vue from "vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import Raven from "raven-js";
import App from "./App.vue";
import "@/entry/style.js";
import "@/router/permission.js";
import { Entry } from "./entry/entry.ts";
import "@/util/expand/string.js";

window.$Raven = Raven;
Entry.extendConfig(Vue);
Entry.extendFilter(Vue);
Entry.extendPlugin(Vue);
Entry.extendPrototype(Vue);

window.$adeskTool = new Vue({
  el: "#app",
  router,
  store,
  axios,
  template: "<App/>",
  components: {
    App
  }
});
