/** 该文件不需要进行整合！！！只需要执行一次即可，用来生成dll文件及映射文件 */
/** 该文件不需要进行整合！！！只需要执行一次即可，用来生成dll文件及映射文件 */
/** 该文件不需要进行整合！！！只需要执行一次即可，用来生成dll文件及映射文件 */
/**
 * package.json所在路径下，运行:
 * yarn dll
 */
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: "production",
  entry: {
    react: ['react', 'react-dom'],
    // jquery:['jquery']
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: 'dll_[name].js',
    library: 'dll_[name]'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false
      }),
    ],
  },
  plugins: [
    // 配置dll
    // 去entry中找要执行需要进行dll处理的文件
    new webpack.DllPlugin({
      name: 'dll_[name]',// dll打包后，xx.manifest.json文件中name字段的对应的文字
      // xx.manifest.json文件就是使用了第三方包的一个文件映射
      path: path.resolve(__dirname, '../dll/[name].manifest.json')// xx.manifest.json文件的路径
    })
  ]
}