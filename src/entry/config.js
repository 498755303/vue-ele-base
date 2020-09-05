export default function config(Vue) {
  Vue.config.performance = process.env.NODE_ENV === 'development';
  Vue.config.productionTip = process.env.NODE_ENV === 'development';
};
