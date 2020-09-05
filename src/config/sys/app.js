/*
 * @Description:应用相关参数
 * @LastEditors: HL
 * @LastEditTime: 2020-05-20 10:47:13
 */

import { cfg } from '@/config/env';

const appCfg = cfg.appCfg;
const baseUrl = cfg._baseUrl;
const _videoShare = cfg._videoShare;
const page = cfg.page;
cfg.extendCfg({
  axios: {
    // 取消重复请求的接口地址
    canelApi: [
      baseUrl + '/video.get/v1.0' // 视频帧获取
    ]
  }
});
const reqCfg = cfg.axios;
export {
  cfg,
  appCfg,
  baseUrl,
  _videoShare,
  page,
  reqCfg
};
