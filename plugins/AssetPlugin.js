/**
 * 希望在控制台打印出当前编译的文件名
 */

class AssetPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    //每次compiler在创建一个新的compilation之后都会触发compilation事件
    //compilation代表本次编译
    compiler.hooks.compilation.tap('AssetPlugin', (compilation, params) => {
      compilation.hooks.chunkAsset.tap('AssetPlugin', (chunk, filename) => {
        console.log('chunk', chunk, 'filename', filename) // filename: __child-HtmlWebpackPlugin_0 和 bundle.js
      })
    })
  }
}


module.exports = AssetPlugin;
