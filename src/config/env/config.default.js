/*
 * @Description: 新增通用配置文件
 * @LastEditors: HL
 * @LastEditTime: 2020-06-29 00:00:36
 */
import { version as appVersion } from "../../../package.json";

const version = {
  v1: 'v1.0',
  v2: 'v2.0'
};

// 生成配置
const generateConfig = () => {
  let config = {};
  config.webVersion = appVersion;
  // 接口版本
  config.version = version;
  // 请求配置
  config.axios = {
    // 忽略全局loading项
    ignoreLoading: [
      '/common.user.save/' + version.v1
    ]
  };
  // 特殊页面
  config.page = {
    home: "http://www.xxxx.cn"
  };
  // sentry配置
  config.sentry = {
    DSN: 'sentry-dsn'
  };
  // url 后缀
  config.urlSuffix = {
    picDefault: '?x-oss-process=image/resize,m_lfit,l_130',
    videoCover: '?x-oss-process=video/snapshot,t_0,w_130,m_fast'
  };
  // 全局限制配置
  config.limitCfg = {
    createCount: 50,
  };
  return config;
};
export default generateConfig;
