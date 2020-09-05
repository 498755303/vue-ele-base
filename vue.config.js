const envs = ['production', 'deploy'];
module.exports = {
  lintOnSave: true,
  runtimeCompiler: true,
  productionSourceMap: true,
  devServer: {
    port: 80,
    https: false,
    hotOnly: false,
    proxy: null, // 设置代理
    quiet: true,
    clientLogLevel: 'silent',
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    }
    // before: app => { }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    // 使用hash最每次编译检测,chunkhash为文件改动会变动
    config.output.filename('[name].[hash].js').end();
  },
  configureWebpack: config => {
    config.devtool = envs.indexOf(process.env.NODE_ENV) > -1 ? 'nosources-source-map' : 'cheap-module-eval-source-map';
    config.resolve.alias['vue$'] = 'vue/dist/vue.js';

    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100
          },
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true
          },
          runtimeChunk: {
            name: 'manifest'
          }
        },
        chunks: 'async'
      }
    };
    // 缓存加载
    // config.plugins.push(new HardSourceWebpackPlugin())
    config.module.rules.push({
      test: /\.ts?$/,
      exclude: /node_modules/,
      enforce: 'pre',
      loader: 'tslint-loader'
    });
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    });
    // 区分环境
    if (envs.indexOf(process.env.NODE_ENV) > -1) {
      const pluginSentry = require('./build/config/sentry');
      const pluginCompressionWebpack = require('./build/config/gzip');
      // 打包优化: 缓存优化,cli新版本取代dll,性能优于dll
      // const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
      // 自动去除console
      const TerserPlugin = require('terser-webpack-plugin');
      // 为生产环境修改配置...
      config.devtool = 'cheap-source-map';
      // sentry
      config.plugins.push(pluginSentry);
      if (config.optimization) {
        config.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              ecma: undefined,
              warnings: false,
              parse: {},
              sourceMap: true,
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log'] // 移除console
              }
            }
          })
        ];
      }
      // 开启gzip压缩
      config.plugins.push(pluginCompressionWebpack);
    } else {
      // 为开发环境修改配置...
    }
  }
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         require("postcss-pxtorem")({
  //           rootValue: 136.6, // 换算的基数
  //           unitPrecision: 8, // 换算后保留的小数位数
  //           propList: ["*"], // 被转换的属性列表
  //           selectorBlackList: [], // css选择器进行过滤 [el]过滤el-
  //           replace: true,
  //           mediaQuery: false
  //           // minPixelValue: 12 // 最小处理像素
  //         })
  //       ]
  //     }
  //   }
  // }
};
