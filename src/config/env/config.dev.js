const config = {
    api: 'http://127.0.0.1:8130',
    // api: 'http://10.1.1.10:8230'
    suffix: '/api',
    cdn: 'http://cdn-test.aliyun.com/temporary/',
    urlSuffix: {
        picWater:
            '?x-oss-process=image/watermark,image_dHVrdS9pbWFnZS9hZG1pbl8xLzIwMTgtMDkvMTUzNjA1Mjc3MDUzNl9sb2dvMS5wbmc=,g_center'
    },
    // 特殊页面链接配置
    page: {
        //分享页面
        sharePage: 'https://share.xxx.com/'
    },
    // 应用配置
    appCfg: {
        renderCfg: {
            copyright: true
        }
    }
};
export default config;
