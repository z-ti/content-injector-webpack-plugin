const ContentInjector = require('content-injector-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new ContentInjector({
        content: () => `\n/*! Version: 1.1.0 */`,
        include: /\.(js|css)$/,
        position: 'tail'
      })
    ]
  }
}
