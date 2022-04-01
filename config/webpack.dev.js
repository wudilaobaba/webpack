const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web', // 开发环境下忽略browserslists,否则会与webpack-dev-server产生冲突
  devtool: "cheap-module-source-map",
  devServer: {
    hot: true,
    port: 8998, //端口号，默认8080
    open: true,// 自动打开浏览器
    compress: true,// 浏览器会使用gzip压缩请求到的资源文件，会把文件压缩体积变小
    historyApiFallback: true,// 适用于前端做路由的场景，刷新页面如果没有请求到服务则返回index.html
    proxy: {
      '/xxx': {
        target: 'https://api.github.com',
        pathRewrite: {
          '^/xxx': '' // 将/xxx替换为空串
        },
        changeOrigin: true // 不带主机名请求 即不带localhost:8998
      }
    }
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ]
}