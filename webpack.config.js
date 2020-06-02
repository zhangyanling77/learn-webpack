// const path = require('path');

// module.exports = {
//   mode: 'development', // 标识不同的环境，development 开发 | production 生产
//   devtool: 'none', // 不生成 sourcemap 文件
//   entry: './src/index.js', // 文件入口
//   output:  {
//     path: path.resolve(__dirname, 'dist'), // 输出目录
//     filename: 'bundle.js', // 输出文件名称
//   }
// }

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development', // 标识不同的环境，development 开发 | production 生产
  devtool: 'none', // 不生成 sourcemap 文件
  entry: './src/main.js', // 文件入口
  output:  {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].bundle.js', // 输出文件名称
  },
  // 告诉webpack如何解析loader路径
  resolveLoader: {
    alias: {
      'babel-loader': path.resolve(__dirname, 'loaders', 'babel-loader')
    },
    modules: [
      path.resolve(__dirname, 'loaders'), "node_modules"
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'loader1', 'loader2', 'loader3'
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     presets: [
          //       "@babel/preset-env",
          //       "@babel/preset-react"
          //     ]
          //   }
          // }
        ]
      }
    ]
  },
  plugins: [
    /**
     * 这个参数配置要删除哪些文件，和不要删除哪些文件，不要删除的文件前面加个逻辑运算符非 ! ，*号可以通过占位符来处理，表示什么开头，什么结尾
     * 比如：
     * cleanOnceBeforeBuildPatterns: ['main*.*', '!vendor', '!vendor.manifest.json']
     */
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {}
}
