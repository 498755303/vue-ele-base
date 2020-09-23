import './directive.js';
import usePlugin from './use.js';
import usePrototype from './prototype.js';
import config from './config.js';

export class Entry {

  // 配置
  public static extendConfig(Vue) {
    config(Vue);
  }

  // 过滤器
  public static extendFilter(Vue) {
    // 千分位转换
    Vue.filter('formatNumber', (num) => {
      if (isNaN(num)) {
        throw new TypeError('num is not a number');
      }
      return ('' + num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
    });
    // 对账凭证后面增加四位随机数
    Vue.filter('concatImgRandom', (str) => {
      let res = '';
      for (var i = 0; i < 4; i++) {
        res = res + parseInt(String(10 * Math.random()));
      }
      return str + '?' + res;
    });
    // 素材大小展示转换
    Vue.filter('formatMaterialSize', (size) => {
      if (size === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return (size / k ** i).toPrecision(3) + ' ' + sizes[i];
    });
    // 枚举展示
    Vue.filter('enum2Label', (val, enumData, placeholder) => {
      if (!val) {
        return placeholder || '-';
      }
      const list = val.split(',');
      if (list && list.length > 1) {
        const strList = [];
        list.forEach(v => {
          if (enumData[v]) {
            strList.push(enumData[v].label);
          }
        })
        return strList && strList.length ? strList.join(',') : placeholder || '-';
      } else {
        return enumData[val] ? enumData[val].label : placeholder || '-';
      }
    });
  }

  // 原型链
  public static extendPrototype(Vue) {
    usePrototype(Vue);
  }

  // 三方组件
  public static extendPlugin(Vue) {
    usePlugin(Vue);
  }


}
