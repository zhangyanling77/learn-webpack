# webpack 打包文件分析（下）

## 回顾

上一篇我们讲到`webpack`打包文件源码中文件加载的部分，通过分析了解了在`webpack`中不同模块规范相互加载的处理。而至此，只包括了文件的**同步加载**分析，对于文件的异步加载又是如何处理的呢？

我们使用`webpack`将项目打包为一个`bundle.js`文件，通过`script`标签插入到页面中引用。但如果这个`bundle.js`体积特别大，就会导致我们加载时间过长，阻塞页面的渲染。

其次，这个打包出来的`bundle.js`中其实部分的代码资源是当前加载页面用不到的，这样也导致了浪费。于是，资源加载的优化就成了必须要考虑的问题，而异步加载（或者说动态加载）就是解决这个问题的方案之一。

## 异步加载

在`webpack`中提供了符合[ECMAScript](https://tc39.github.io/proposal-dynamic-import/)的`import()`语法，允许我们动态的加载模块。（在`webpack`版本较低时，我们使用的代码动态加载方案是`require.ensure`方法，后面已经被`import`取代）。

那么接下来，就继续探究一下**异步加载**的实现。

### 关键文件

- 依赖文件 `src/foo.js`

```javascript
export default 'foo';
```
- 入口文件 `src/index.js`

```javascript
import (/* webpackChunkName: "foo" */ './foo').then(foo => {
  console.log(foo)
})
```
- `webpack.config.js`

```javascript
// ...
  output:  {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].bundle.js', // 输出文件名称
  },
// ...
```

### bundle 分析

打包后输出两个文件：

- `index.bundle.js` 

> 由于打包源码内容过长，这里省略部分已经分析过的代码块。

```javascript
(function(modules) {

	function webpackJsonpCallback(data) {
		var chunkIds = data[0]; // 对应加载的chunk的名称
		var moreModules = data[1]; // 对应加载的chunk组成的对象
    // 将 "moreModules" 添加到 modules 对象中，然后将所有的 chunkIds 标记为已加载，并触发回调
		var moduleId, chunkId, i = 0, resolves = [];
		for(;i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
				resolves.push(installedChunks[chunkId][0]);
			}
			installedChunks[chunkId] = 0; // 标识chunk加载完毕
		}
		for(moduleId in moreModules) {
			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				modules[moduleId] = moreModules[moduleId]; // 将传入的chunk对应的文件定义内容放入 modules 中
			}
    }

		if(parentJsonpFunction) parentJsonpFunction(data);

		while(resolves.length) {
			resolves.shift()(); // 将所有的promise变为成功态，依次执行resolve
		}
	};

  /** 
   * 该对象用于存储已经加载和正在加载中的chunks
   * undefined：表示chunk未加载
   * null：表示chunk预加载 / 预获取
   * Promise：表示chunk正在加载中
   * 0: 表示chunk已经加载了
  */
	var installedChunks = {
		"index": 0
	};

	// 设置加载chunk的脚本路径
	function jsonpScriptSrc(chunkId) {
		return __webpack_require__.p + "" + ({"foo":"foo"}[chunkId]||chunkId) + ".bundle.js"
  }
  
  // ...

	// 作用：懒加载代码块， 原理使用jsonp
	__webpack_require__.e = function requireEnsure(chunkId) {
		var promises = [];

    // 获取加载的chunk内容
		var installedChunkData = installedChunks[chunkId];
		if(installedChunkData !== 0) { // 0 表示已经加载过了
			// Promise 意味着 chunk 正在加载
			if(installedChunkData) {
				promises.push(installedChunkData[2]);
			} else {
        // 在chunk缓存中设置 Promise
				var promise = new Promise(function(resolve, reject) {
					installedChunkData = installedChunks[chunkId] = [resolve, reject];
				});
				promises.push(installedChunkData[2] = promise);

				// 开始加载chunk，jsonp方式
				var script = document.createElement('script');
				var onScriptComplete;

				script.charset = 'utf-8'; // 设置字符集
        script.timeout = 120;
        // 和CSP相关
				if (__webpack_require__.nc) {
					script.setAttribute("nonce", __webpack_require__.nc);
				}
				script.src = jsonpScriptSrc(chunkId);

				// 脚本加载完成、超时、出错的事件处理函数
				var error = new Error();
				onScriptComplete = function (event) {
					// 避免IE内存泄漏
					script.onerror = script.onload = null;
					clearTimeout(timeout);
					var chunk = installedChunks[chunkId];
					if(chunk !== 0) {
						if(chunk) {
							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
							var realSrc = event && event.target && event.target.src;
							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
							error.name = 'ChunkLoadError';
							error.type = errorType;
							error.request = realSrc;
							chunk[1](error);
						}
						installedChunks[chunkId] = undefined;
					}
        };
				var timeout = setTimeout(function(){
					onScriptComplete({ type: 'timeout', target: script });
				}, 120000);
				script.onerror = script.onload = onScriptComplete;
				document.head.appendChild(script);
			}
		}
		return Promise.all(promises);
	};

	// ...

	// 异步加载时触发的错误函数
	__webpack_require__.oe = function(err) { console.error(err); throw err; };
  // 存储的是传入的chunk
  var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
  // 存储旧的 jsonpArray.push 方法
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  // 将 webpackJsonpCallback 覆盖 jsonpArray.push 方法
	jsonpArray.push = webpackJsonpCallback;
	jsonpArray = jsonpArray.slice();
  for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;
  // __webpack_require__.s 用于缓存入口模块id
	return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
({
  "./src/index.js":
  (function(module, exports, __webpack_require__) {
    // 异步加载 foo
    __webpack_require__.e("foo").then(__webpack_require__.bind(null, "./src/foo.js")).then(foo => {
      console.log(foo)
    })

  })
});
```
- `foo.bundle.js`

```javascript
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["foo"],{

  "./src/foo.js":
  (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    // 将模块标识为 ES Module
    __webpack_require__.r(__webpack_exports__);
    // 将代码块内容挂在 default 上
    __webpack_exports__["default"] = ('foo');
    
  })

}]);
```


## 结语

