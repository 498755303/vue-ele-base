
const config = {
  api: "https://api.xxx.com",
  suffix: "/api",
  cdn: "https://cdn.aliyun.cn/temporary/",
  urlSuffix: {
    picWater:
      "?x-oss-process=image/watermark,image_dHVrdS9pbWFnZS9hZG1pbl8xLzIwMTgtMDkvMTUzNjExNzg1NTg0NF9sb2dvLnBuZw==,t_90,g_center"
  },
  sentry: {
    realease: "staging@online"
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
