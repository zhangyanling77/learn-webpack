# webpack 打包文件分析

## 前言
![webpack](https://github.com/zhangyanling77/learn-webpack/blob/master/webpack.png)

`Webpack` 是一个用于静态资源打包的工具。它分析你的项目结构，会递归的构建依赖关系，找到其中脚本、图片、样式等将其转换和打包输出为浏览器能识别的资源。
本篇文章仅对webpack打包输出的文件进行简要的分析。

## 项目准备
[项目地址](https://github.com/zhangyanling77/learn-webpack)

下面列一下关键文件：

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
  // webpack 自己实现的 require 方法
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

根据上面的文件可以看出，最终打包出的是一个自执行函数。<br>
首先，这个自执行函数它接收一个参数`modules`，`modules`为一个对象，其中`key`为打包的模块文件的路径，对应的`value`为一个函数，其内部为模块文件定义的内容。<br>
然后，我们再来看一看自执行函数的函数体部分。<br>
