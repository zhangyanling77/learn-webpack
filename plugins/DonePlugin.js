/**
 * 插件是个类
 * 它有个固定方法apply，参数是compiler
 * 
 * 功能：在所有编译完成后打印一个 done
 */
class DonePlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.run.tapAsync('DonePlugin', (compiler, callback) => {
      console.log('DonePlugin')
      callback();
    })
  }
}

module.exports = DonePlugin;
