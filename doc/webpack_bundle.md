# webpack 打包文件分析

## 前言
![webpack](https://github.com/zhangyanling77/learn-webpack/blob/master/webpack.png)

`Webpack` 是一个用于静态资源打包的工具。它分析你的项目结构，会递归的构建依赖关系，找到其中脚本、图片、样式等将其转换和打包输出为浏览器能识别的资源。<br>
本篇文章仅对webpack打包输出的文件进行简要的分析。

## 项目准备
[项目地址](https://github.com/zhangyanling77/learn-webpack)

看一下几个关键文件：

- 入口文件：src/index.js
```javascript
import foo from './foo.js';

console.log(foo)
```
- 依赖文件：src/foo.js
```javascript
const foo = 'foo';
export default foo;
```
- webpack配置文件：webpack.config.js
```javascript
const path = require('path');

module.exports = {
  mode: 'development', // 标识不同的环境，development 开发 | production 生产
  devtool: 'none', // 不生成 sourcemap 文件
  entry: './src/index.js', // 文件入口
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出文件名称
  }
}
```
## bundle分析
首先放上打包输出文件：dist/bundle.js，这里先隐藏一些细节，稍后再详细分析。

```javascript
 (function(modules) {
  // 模块缓存对象
  var installedModules = {};
  function __webpack_require__(moduleId) {
    // ... 执行一些操作
    // 返回该模块的导出对象
    return module.exports;
  }

  // ... 执行一些操作

  // 加载入口模块并返回模块的导出对象
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
({
  "./src/foo.js":
  (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    const foo = 'foo';
    __webpack_exports__["default"] = (foo);
  }),
  "./src/index.js":
  (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    console.log(_foo_js__WEBPACK_IMPORTED_MODULE_0__["default"])
  })
});
```

根据上面的源码可以看出，最终打包出的是一个自执行函数。<br>
首先，这个自执行函数它接收一个参数`modules`，`modules`为一个对象，其中`key`为打包的模块文件的路径，对应的`value`为一个函数，其内部为模块文件定义的内容。<br>
然后，我们再来看一看自执行函数的函数体部分。函数体返回 `__webpack_require__(__webpack_require__.s = "./src/index.js")` 这段代码，此处为加载入口模块并返回模块的导出对象。
可以发现，webpack自己实现了一套加载机制，即`__webpack_require__`，可以在浏览器中使用。该方法接收一个moduleId，返回加载的模块的导出对象。让我们来看看内部的实现。
```javascript
  // 模块缓存对象
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 创建一个新的模块对象，并将它放到缓存中
    var module = installedModules[moduleId] = {
      i: moduleId, // 模块id，即模块所在的路径
      l: false, // 该模块是否已经加载过了
      exports: {} // 导出对象
    };

    // 执行当前传入的模块id对应的函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // 标识该模块赢加载
    module.l = true;

    // 返回该模块的导出对象
    return module.exports;
  }
```
首先，当前作用域顶端声明了`installedModules`这个对象，它用于缓存加载过的模块。在__webpack_require__方法内部，会对于传入的模块在缓存对象中进行检查，如果已经存在，返回该模块对象的导出对象；否则，创建一个新的模块对象，记录模块id、标识模块是否加载过、以及定义导出对象，同时将它放到缓存中。<br>
接下来就是重要的一步，执行模块的函数内容。
```javascript
 modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
```
也就是自执行函数传入的modules对象中当前moduleId对应的函数内容。