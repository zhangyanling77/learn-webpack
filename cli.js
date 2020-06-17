const webpack = require('webpack');
const options = require('./webpack.config'); // 配置文件导出对象

let args = process.env.args; // 命令行参数
// 将配置对象传给webpack，得到Compiler 编译器。维护了webpack工作的大部分流程。
const compiler = webpack(options);
// run: new AsyncSeriesHook(['compiler'])
compiler.hooks.run.tapAsync('cli.js', (compiler, callback) => {
    console.log('cli run');
    // console.log(compiler);
    callback();//异步串行钩子，可以异步代码，异步完成之后可以调用callback执行下一步
});
// 开始编译
compiler.run((err, stats) => {
  console.log('compiler');
  //stats保存的是此次编译的结果信息
  /*  console.log(stats.toJson({
      entries: true, //输出入口信息
      chunks: true,  //输出代码块信息
      module: true,  //输出模块信息
      _modules: true,// 输出模块信息
      assets: true   //输出文件信息
  })) */
})

/**
 * stats 对象
 * 在webpack的回调中可获取到
 * 该对象来自于 Compilation.getStats()，返回的是主要含有modules、chunks和assets三个属性值的对象
 * stats对象本质上来自于lib/Stats.js的类实例
 * 
 * modules：记录了所有解析后的模块
 * chunks：记录了所有chunk
 * assets：记录了所有要生成的文件
 */
