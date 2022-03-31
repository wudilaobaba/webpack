const plugins = []
if(process.env.NODE_ENV === 'development'){
  plugins.push(['react-refresh/babel'])
}
module.exports = {
  presets: [
    [
      '@babel/preset-env',

      // 下面是polyfill的使用
      {
        // useBuiltIns的值有以下：
        // false: 不对当前的JS处理做 polyfill 的填充
        // usage:
        //    依据用户源代码当中所使用到的新语法,再根据browserslists，看看是否需要进行填充
        // entry: 依据我们当前筛选出来的浏览器决定填充什么,
        //        无论代码中是否使用了新的js对象，他都会根据浏览器筛选的结果进行填充

        // 使用entry的话，webpack打包的入口文件中要引入以下两个文件：
        // import "core-js/stable";
        // import "regenerator-runtime/runtime"
        useBuiltIns: 'usage',
        corejs: 3 // 版本 当前core-js的版本，与你下载的大版本保持一致，package.json中可见
      }
    ],
    ['@babel/preset-react'],
    ['@babel/preset-typescript'],
  ],
  plugins
}