
// 首屏优化: gzip 提供带 Content-Encoding 编码的压缩版的资源
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = new CompressionWebpackPlugin({
  algorithm: 'gzip',
  test: /\.(js|css|html)$/,
  threshold: 10240, // 最小处理资源
  minRatio: 0.6 // 压缩略小于此值处理
})
