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
	// install a JSONP callback for chunk loading
	function webpackJsonpCallback(data) {
		var chunkIds = data[0];
		var moreModules = data[1];
		// add "moreModules" to the modules object,
		// then flag all "chunkIds" as loaded and fire callback
		var moduleId, chunkId, i = 0, resolves = [];
		for(;i < chunkIds.length; i++) {
			chunkId = chunkIds[i];
			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
				resolves.push(installedChunks[chunkId][0]);
			}
			installedChunks[chunkId] = 0;
		}
		for(moduleId in moreModules) {
			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
				modules[moduleId] = moreModules[moduleId];
			}
		}
		if(parentJsonpFunction) parentJsonpFunction(data);

		while(resolves.length) {
			resolves.shift()();
		}
	};

	// The module cache
	var installedModules = {};

	// object to store loaded and loading chunks
	// undefined = chunk not loaded, null = chunk preloaded/prefetched
	// Promise = chunk loading, 0 = chunk loaded
	var installedChunks = {
		"index": 0
	};

	// script path function
	function jsonpScriptSrc(chunkId) {
		return __webpack_require__.p + "" + ({"foo":"foo"}[chunkId]||chunkId) + ".bundle.js"
  }
  
  // ...

	// This file contains only the entry chunk.
	// The chunk loading function for additional chunks
	__webpack_require__.e = function requireEnsure(chunkId) {
		var promises = [];

		// JSONP chunk loading for javascript

		var installedChunkData = installedChunks[chunkId];
		if(installedChunkData !== 0) { // 0 means "already installed".

			// a Promise means "currently loading".
			if(installedChunkData) {
				promises.push(installedChunkData[2]);
			} else {
				// setup Promise in chunk cache
				var promise = new Promise(function(resolve, reject) {
					installedChunkData = installedChunks[chunkId] = [resolve, reject];
				});
				promises.push(installedChunkData[2] = promise);

				// start chunk loading
				var script = document.createElement('script');
				var onScriptComplete;

				script.charset = 'utf-8';
				script.timeout = 120;
				if (__webpack_require__.nc) {
					script.setAttribute("nonce", __webpack_require__.nc);
				}
				script.src = jsonpScriptSrc(chunkId);

				// create error before stack unwound to get useful stacktrace later
				var error = new Error();
				onScriptComplete = function (event) {
					// avoid mem leaks in IE.
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

	// on error function for async loading
	__webpack_require__.oe = function(err) { console.error(err); throw err; };

	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
	jsonpArray.push = webpackJsonpCallback;
	jsonpArray = jsonpArray.slice();
	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;
  
	// Load entry module and return exports
	return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
({
  "./src/index.js":
  (function(module, exports, __webpack_require__) {

    __webpack_require__.e(/*! import() | foo */ "foo").then(__webpack_require__.bind(null, /*! ./foo */ "./src/foo.js")).then(foo => {
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
    __webpack_require__.r(__webpack_exports__);

    __webpack_exports__["default"] = ('foo');
    
  })

}]);
```
先看`index.bundle.js`，

## 结语

