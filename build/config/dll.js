/*
 * @Description: webpack配置dll 自动导入
 * cli官方已使用hard-source-webpack-plugin 替代dll
 * 配合webpack.dll.conf.js使用
 * @LastEditors: HL
 * @LastEditTime: 2020-04-29 12:24:24
 */
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
export const dllReferencePlugin = new webpack.DllReferencePlugin({
  context: process.cwd(),
  manifest: require('./public/vendor/vendor-manifest.json')
})

// 将 dll 注入到 生成的 html 模板中
export const addAssetHtmlPlugin = new AddAssetHtmlPlugin({
  // dll文件位置
  filepath: path.resolve(__dirname, './public/vendor/*.js'),
  // dll 引用路径
  publicPath: './vendor',
  // dll最终输出的目录
  outputPath: './vendor'
})
