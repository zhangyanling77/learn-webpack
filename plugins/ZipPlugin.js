/**
 * 根据打包出来的文件生成一个压缩包 名字可以通过配置文件指定
 * 需要知道 到底要写入哪几个文件，文件名叫什么，还需要知道文件的内容是什么
 */
const JSZIP = require('jszip');
const { RawSource } = require('webpack-sources');
const { compilation } = require('webpack');

class ZipPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    let that = this;
    // 1.拿到原来webpack将要写入的文件 2.向结果里新添加一个文件，文件的内容是压缩包的内容 ，文件名是asset.zip
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      let zip = new JSZIP();
      // 最终要写入硬件的文件描述 信息放在 compilation.assets {文件名:文件内容}
      for (let filename in compilation.assets) {
        // 值是一个源码对象，可以通过调用它的source方法来获取它的源代码
        let sourceObj = compilation.assets[filename];
        let oldSource = sourceObj.source.bind(sourceObj);
        sourceObj.source = function() {
          return oldSource().replace(/__webpack_require__/g, 'require'); // 替换__webpack_require__为require
        }
        let source = sourceObj.source();
        // 向压缩包里添加文件 filename文件名 source 源文件内容
        zip.file(filename, source);
      }
      // 得到一个压缩包的内容 类型是Buffer
      zip.generateAsync({ type: 'nodebuffer' }).then(content => {
          /*  function RawSource(content) {
              return { source2() { return content } };
          } */
          compilation.assets[that.options.filename] = new RawSource(content);
          /*  {
              source() {
                  return content;
              }
          }; */
          callback();
      });
    })
  }
}

module.exports = ZipPlugin;
