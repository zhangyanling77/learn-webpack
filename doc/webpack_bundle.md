# webpack 打包文件分析

## webpack简介
`Webpack` 是一个用于静态资源打包的工具。它分析你的项目结构，会递归的构建依赖关系，找到其中脚本、图片、样式等将其转换和打包输出为浏览器能识别的资源。
![](/assets/webpack.png)

## 项目准备

## 打包文件分析

```javascript
 (function(modules) {
  // 模块缓存对象
  var installedModules = {};
  // webpack 自己实现的 require 方法
  function __webpack_require__(moduleId) {
    // 检查模块是否在缓存中存在
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
 
  // 该属性用于公开modules对象 (__webpack_modules__)
  __webpack_require__.m = modules;
 
  // expose the module cache
  // 该属性用于公开模块缓存对象
  __webpack_require__.c = installedModules;
 
  // 该属性用于定义兼容各种模块规范输出的getter函数，d即Object.defineProperty
  __webpack_require__.d = function(exports, name, getter) {
    if(!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };
 
  // 该属性用于在导出对象exports上定义 __esModule = true，表示该模块是一个es6模块
  __webpack_require__.r = function(exports) {
    // 定义这种模块的Symbol.toStringTag为 [object Module]
    if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };
 
  // 创建一个假的命名空间对象
  // mode & 1: 传入的value为模块id，使用__webpack_require__加载该模块
  // mode & 2: 将传入的value的所有的属性都拷贝定义到ns对象上
  // mode & 4: 当ns对象已经存在时，直接返回value。表示该模块已经被包装过了
  // mode & 8|1: 已经加载好直接返回就好了
  __webpack_require__.t = function(value, mode) {
    if(mode & 1) value = __webpack_require__(value);
    if(mode & 8) return value;
    if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    // 创建一个命名空间对象
    var ns = Object.create(null);
    // 将ns对象标识为es模块
    __webpack_require__.r(ns);
    // 给ns对象定义default属性，值为传入的value
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
    return ns;
  };
 
  // 获取模块的默认导出对象，这里区分 commonjs 和 es modlue两种方式
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
 
  // 该属性用于判断对象自身属性中是否具有指定的属性，o即Object.prototype.hasOwnProperty
  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // 该属性用于存放公共访问路径，默认为'' (__webpack_public_path__)
  __webpack_require__.p = "";

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

