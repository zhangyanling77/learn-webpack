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
    filename: '[name].js', // 输出文件名称
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      // chunks: ['main1']
    })
  ],
  devServer: {}
}