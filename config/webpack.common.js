const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const resolveApp = require('../paths')
const {merge} = require("webpack-merge")
const prod = require('./webpack.prod')
const dev = require('./webpack.dev')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const base = (isProd) => ({
  // entry: './src/index.ts', // 相对于当前运行的命令行路径
  // entry: {
  //   main1: {import: './src/main1.js', dependOn: 'xxx'},
  //   main2: {import: './src/main2.js', dependOn: 'xxx'},
  //   xxx: ['lodash', 'jquery']
  // },
  entry: {
    index: "./src/index.ts"
  },

  output: {
    filename: "js/[name].js",
    path: path.join(__dirname, '../project'),
    publicPath: "/",
    // libraryTarget:'umd',
    // library:'whj',
    // globalObject: 'this' // 会报错

    // 动态import包打包后的文件名， 优先级高于 optimization.chunkIds
    // chunkFilename: 'js/chunk_[name]_[id].js'
  },
  externals: {
    lodash: "_"
    // 第三方包名：第三方包暴露出来的变量名
  },
  optimization: {
    // true: 会出现 runtime~index.696def7a.js文件，用来管理动态导包的依赖逻辑
    // false: 默认值，只要文件发生变化，hash只=值就会变，不利于浏览器缓存
    runtimeChunk: true, // 默认false  性能优化使用
    minimizer: [
      new TerserPlugin({
        extractComments: false // 默认true, false可以删除txt文件，同时压缩打包后的代码
      })
    ],

    // splitChunks:不使用splitChunks，那么入口文件以及第三方文件全部打包到了唯一一个js文件中。
    // 针对于import后面的包B，决定是否要拆分B, 只有涉及到导入了的第三方包才能进行拆包
    // 第三方的包打包完成后，根据minSize和maxSize进行判断是否需要拆包。
    // 打包后的入口文件就是上面output中配置的js文件，一般以_bundle.js结尾。这个文件只包含项目中自己的代码，不包括第三方包（前提：满足下面的拆包规则）
    // 自己的js文件，只用使用到的变量才会被打包
    // 然后第三方包再抽出来打包成其他的js文件
    // 只要引用了第三方包，即使没有使用，该第三方包也会被打包。

    // 总结splitChunks：
    // 打包后一般会有一个入口文件的打包文件
    // 以及多个第三方包的打包文件（根据条件决定是否拆包）


    // 分包后，动态import包打包后的文件名
    chunkIds: 'deterministic',
    // natural：不利于浏览器缓存 以自然数的形式进行展示js文件名
    // named: 开发使用 - 以路径的名字展现成js文件名
    // deterministic 生产环境建议使用 名字与output中filename规则一致

    splitChunks: {
      // 默认 async 只能处理异步引入
      // initial 只支持同步导入
      chunks: 'all',
      minSize: 20000, // 默认: 20000b 即只有超过20k的第三方包才进行打包📦
      maxSize: 20000, // 默认0
      // Size的优先级高于minChunks
      minChunks: 1, // 至少引用1次，
      cacheGroups: {
        syVendors: {
          test: /[\\/]node_modules[\\/]/, // 将第三方的包打包到一个文件中
          filename: 'js/[name]_[id]_vendor.js', //打包后的文件名
          priority: -10, //cacheGroups中的条件优先级
        },
        default: { //如果一个js包（第三方或自己的包）被引用了两次及以上，则单独打包出来
          minChunks: 1,
          filename: 'js/syy_[id].js',
          priority: -20, //cacheGroups中的条件优先级
        }
      }
    }
  },
  resolve: {
    extensions: [".js", ".json", '.ts', '.jsx', '.vue', '.tsx'],
    alias: {
      // resolveApp中的逻辑是相对于当前运行的命令行路径
      '@': resolveApp('./src') // 路径别名
    }
  },


  plugins: [
    // 使用dll
    new webpack.DllReferencePlugin({
      context: resolveApp('./'),// 就是存放manifest.json与对应dll文件的文件夹
      manifest: resolveApp('./dll/react.manifest.json')
    }),
    // 将js文件添加到index.html中的script中 - 通过插件
    new AddAssetHtmlPlugin({
      filepath: resolveApp('./dll/dll_react.js'),
      // outputPath: 'js', // 设置后，会将上面的filepath文件拷贝至打包目录的js文件夹中
      // 坑：html文件中的script引用地址不会随着改变！！！！！！
    }),
    new HtmlWebpackPlugin({
      title: '王泓钧',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/public/index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/, // 不要对该文件下的js做babel处理，否则会冲突，如polyfill会生成两个Promise
        use: [{
          loader: "babel-loader"
        }]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: "css-loader",
            options: {
              esModule: false,
              importLoaders: 1,
            }
          },
          'postcss-loader'
        ],
        sideEffects: true // true: 不要摇掉css文件
      },
      {
        test: /\.less$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: "css-loader",
            options: {
              esModule: false,
              importLoaders: 1,
            }
          },
          'postcss-loader',
          'less-loader'
        ],
        sideEffects: true // true: 不要摇掉less文件
      },
      {
        test: /\.(png|svg|gif|jpe?g)$/,
        type: 'asset',
        generator: {
          filename: "_imgwhj/[name].[hash:4].[ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024
          }
        }
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:3][ext]'
        }
      },
    ]
  }
})
module.exports = (env) => {
  const isProduction = env.production;
  process.env.NODE_ENV = isProduction ? 'production' : 'development'
  const config = isProduction ? prod : dev
  return merge(base(isProduction), config)
}