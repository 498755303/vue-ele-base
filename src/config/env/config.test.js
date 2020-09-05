/*
 * @Description:
 * @LastEditors: HL
 * @LastEditTime: 2020-03-03 16:26:49
 */
const config = {
  api: "http://10.1.1.10:8230",
  suffix: "/api",
  cdn: "http://cdn-test.aliyun.com/temporary/",
  urlSuffix: {
    picWater:
      "?x-oss-process=image/watermark,image_dHVrdS9pbWFnZS9hZG1pbl8xLzIwMTgtMDkvMTUzNjA1Mjc3MDUzNl9sb2dvMS5wbmc=,g_center"
  },
  sentry: {
    realease: "staging@test"
  },
  page: {
    sharePage: "https://share.xxx.com/"
  },
  appCfg: {
    renderCfg: {
      copyright: true
    }
  }
};
export default config;
