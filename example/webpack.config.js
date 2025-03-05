const path = require('path')
const ContentInjector = require('content-injector-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new ContentInjector({
      content: `/*! Build at: ${new Date().toLocaleString()} */\n`,
      match: /\.js$/,
      position: 'head'
    })
  ]
}
