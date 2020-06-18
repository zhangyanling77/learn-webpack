/**
 * 1.读取插件里的配置
 * 2.遍历所有的import 和 require 
 */

 let ExternalModule = require('webpack/lib/ExternalModule');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 class AutoExternalPlugin {
   constructor(options){
     this.options = options
     this.externalModules = {}; // 实际用到的，并需要处理的外链模块
   }

   apply(compiler) {
     /**
      * 每当webpack要创建编译一个模块的时候，都会先创建这个模块工厂，不同的模块有不同的工厂
      */
     compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
       normalModuleFactory.hooks.parser//normalModuleFactory解析AST 
       .for('javascript/auto')
       .tap('AutoExternalPlugin', parser => { // 得到了javascript/auto类型JS模块的解析器
          parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => { // source = jquery
            if (this.options[source]) { // 代码里用到这个模块，才需要引入，如果没有用不需要外链引入
              this.externalModules[source] = true
              // this.externalModules['jquery'] = true
            }
          })
       })
       // factory生产，当我们拿到 normalModuleFactory 需要生产模块 使用factory方法来生成模块
       normalModuleFactory.hooks.factory.tap('AutoExternalPlugin', factory => (data, callback) => {
         let request = data.request;
         if (this.externalModules[request]) { // request jquery
            let varName = this.options[request].expose; // jQuery
            callback(null, new ExternalModule(varName/*jQuery*/, 'window'))
            // module.exports = window.jQuery
         } else { // 正常逻辑
           factory(data, callback); // 可能会调用老的工厂函数
         }
       })
     });

     compiler.hooks.compilation.tap('AutoExternalPlugin', compilation => {
      //  console.log('alertAssetTags', HtmlWebpackPlugin.getHooks(compilation).alterAssetTags)

      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags
      .tapAsync('AutoExternalPlugin', (data, callback) => {
        console.log(JSON.stringify(data, null, 2))
        Object.keys(this.externalModules).forEach(name => { // jquery
          let url = this.options[name].url; // https://cdn.bootcss.com/jquery/3.1.0/jquery.js
          // 向script数组的头部添加一个jquery CDN链接
          data.assetTags.scripts.unshift({
            "tagName": "script",
            "voidTag": false,
            "attributes": {
              "defer": false,
              "src": url
            }
          })
        })
        callback(null, data)
      })
     })
   }
 }

 module.exports = AutoExternalPlugin;
