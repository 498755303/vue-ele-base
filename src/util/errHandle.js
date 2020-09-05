/*
 * @Description:异常处理方法
 * @LastEditors: HL
 * @LastEditTime: 2020-04-29 16:03:44
 */
import { appCfg } from '@/config/sys/app';
import store from '@/store';

// 异常处理
const errorHandler = function (err, vm, info) {
  console.log(err, vm, info);
  window.$Raven.setTagsContext({
    env: process.env.NODE_ENV,
    platform: appCfg.logo.companyName || '百传中云',
    href: window.location.href
  });

  window.$Raven.setUserContext({
    userId: store.getters.userId,
    userName: store.getters.userName
  });
  const p = _performanceCalc();
  p && window.$Raven.setExtraContext(p);
  window.$Raven.captureException(err);
};

const _performanceCalc = () => {
  let result = {};
  const p = window.performance;
  try {
    if (p) {
      if (p.timing) {
        result['重定向时间'] = p.timing.edirectEnd - p.timing.redirectStart
        result['DNS解析时间'] =
          p.timing.domainLookupEnd - p.timing.domainLookupStart;
        result['TCP链接时间'] = p.timing.connectEnd - p.timing.connectStart;
        result['HTTP请求响应完成时间'] =
          p.timing.responseEnd - p.timing.responseStart;
        result['DOM开始加载前耗时'] =
          p.timing.responseEnd - p.timing.navigationStart;
        result['DOM加载完成时间'] = p.timing.domComplete - p.timing.domLoading;
        result['DOM解析完成时间'] =
          p.timing.domInteractive - p.timing.domLoading;
        result['DOM渲染完成时间'] =
          p.timing.domComplete - p.timing.domInteractive;
        result['脚本加载时间'] =
          p.timing.domContentLoadedEventEnd -
          p.timing.domContentLoadedEventStart;
        result['页面完全加载时间'] =
          result['重定向时间'] +
          result['DNS解析时间'] +
          result['TCP链接时间'] +
          result['HTTP请求响应完成时间'] +
          result['DOM渲染完成时间'];
      }
      if (p.memory) {
        result['JS对象占用的内存(包括V8引擎内部对象)'] = p.memory.usedJSHeapSize
          ? (p.memory.usedJSHeapSize / 1024 / 1024).toFixed(4) + 'M'
          : '';
        result['可使用的内存'] = p.memory.totalJSHeapSize
          ? (p.memory.totalJSHeapSize / 1024 / 1024).toFixed(4) + 'M'
          : '';
        result['内存大小限制'] = p.memory.jsHeapSizeLimit
          ? (p.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(4) + 'M'
          : '';
        result['是否溢出'] =
          p.memory.usedJSHeapSize > p.memory.totalJSHeapSize ? '是' : '否';
      }
    }
  } catch (e) {
    errorHandler(e);
  }
  return result;
};

// function isPromise(ret) {
//   return (
//     ret && typeof ret.then === "function" && typeof ret.catch === "function"
//   );
// }
// function registerActionHandle(actions) {
//   Object.keys(actions).forEach(key => {
//     let fn = actions[key];
//     actions[key] = function(...args) {
//       let ret = fn.apply(this, args);
//       if (isPromise(ret)) {
//         return ret.catch(errorHandler);
//       } else {
//         // 默认错误处理
//         return ret;
//       }
//     };
//   });
// }
// const registerVuex = instance => {
//   if (instance.$options["store"]) {
//     let actions = instance.$options["store"]["_actions"] || {};
//     if (actions) {
//       let tempActions = {};
//       Object.keys(actions).forEach(key => {
//         tempActions[key] = actions[key][0];
//       });
//       registerActionHandle(tempActions);
//     }
//   }
// };
// const registerVue = instance => {
//   if (instance.$options.methods) {
//     let actions = instance.$options.methods || {};
//     if (actions) {
//       registerActionHandle(actions);
//     }
//   }
// };

let VueError = {
  install: (Vue, options) => {
    /**
     * 全局异常处理
     * @param {
     * } error
     * @param {*} vm
     */

    Vue.config.errorHandler = errorHandler;
    // Vue.mixin({
    //   beforeCreate() {
    //     registerVue(this);
    //     registerVuex(this);
    //   }
    // });
    Vue.prototype.$throw = errorHandler;
  }
};

export default VueError;
