const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const resolveApp = require('../paths')
const glob = require('glob')
const CompressionPlugin = require("compression-webpack-plugin")
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  optimization: {
    // 以下三者结合起来才能实现树摇
    usedExports: true,// 以魔法注释的形式标记出来哪些代码是没有使用的，方便后续摇掉未使用的代码
    minimize: true, //必须设置true才能实现压缩js
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false // 默认true, false可以删除txt文件，同时压缩打包后的代码
      })
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/public', // public目录下必须有其他的文件才能执行成功
          // to:'', to可以不写，默认会去上面找output.path
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css'
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${resolveApp('./src')}/**/*`, { nodir: true }),
      safelist: function () {
        return {
          standard: ['body', 'html', 'background'] // css的css选择器不要被摇掉
        }
      }
    }),
    new CompressionPlugin({
      test: /\.(css|js)$/, // 压缩css js
      minRatio: 0.8,// 压缩比
      threshold: 0,//
      algorithm: 'gzip'
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime.*\.js/]),
    new BundleAnalyzerPlugin()
  ],
}