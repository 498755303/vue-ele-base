const SentryPlugin = require('@sentry/webpack-plugin')
module.exports = new SentryPlugin({
  include:
    process.env.NODE_ENV !== 'production'
      ? `../../dist-${process.env.NODE_ENV}`
      : '../../dist',
  release: 'staging@' + process.env.NODE_ENV,
  ignore: ['node_modules', 'webpack.config.js']
})
