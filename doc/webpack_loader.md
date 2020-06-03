# Webpack Loader

## 什么是loader

loader是模块转换器，用于把模块原内容按照需求转换成新内容。通过使用不同的loader，Webpack可以将那些非JavaScript文件处理为可以直接引用的模块，比如图片，CSS，JSX等。

## 使用loader

安装loader

```bash
npm install style-loader css-loader --save-dev
```

`webpack.config.js` 配置

```javascript
// ...
module: {
  rules: [
    test: /\.css$/,
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: {
          modules: true
        }
      }
    ]
  ]
}
// ...
```
### loader的三种使用方式

- 配置（推荐），在 `webpack.config.js` 中指定loader

  这种即上面示例的方式，在 `module.rules` 中通过 `test` 属性标识出应该被对应loader进行转换的某个或某些文件，由 `use` 属性指定转换时使用哪个loader。

- 内联：在每个 `import` 或者 `require` 语句中显式指定loader

  可以在 `import` 语句中指定loader，使用 ! 将资源中的 loader 分开，分开的每个部分都相对于当前目录解析。

  ```javascript
  import 'style-loader!css-loader?modules!./styles.css';
  or
  require('style-loader!css-loader?modules!./styles.css');
  ```

- CLI 在shell命令中指定loader

  指定css文件使用 `style-loader` 和 `css-loader`

  ```bash
  webpack  --module-bind 'css=style-loader!css-loader'
  ```

## loader 特性

- loader 支持链式传递。能够对资源使用流水线(pipeline)。**一组链式的 loader 将按照相反的顺序执行**。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript。

例如：

`webpack.config.js`

```javascript
// ...
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['loader1', 'loader2', 'loader3']
    }
  ]
}
// ...
```

`loader1.js`

```javascript
function loader1(source) { // 传入的文件源码内容 
  console.log('loader1')
  return source + '- loader1'
}

module.exports = loader1
```

`loader2.js`

```javascript
function loader2(source) { // 传入的文件源码内容- loader1
  console.log('loader2')
  return source + '- loader2'
}

module.exports = loader2
```

`loader3.js`

```javascript
function loader3(source) { // 传入的文件源码内容- loader1-loader2
  console.log('loader3')
  return source + '- loader3'
}

module.exports = loader3
```

执行 `npm run build`，可以发现控制台打印了

```bash
// ...
> webpack

loader3
loader2
loader1
Hash: e43a6d267093201ac10c
Version: webpack 4.43.0
// ...
```
最终输出的打包文件

```javascript
//...
({
  "./src/index.js":
  (function(module, exports) {
    // 这是index.js中的源码内容
    var fn = function () {
      // ...
    }
    // 经过所有的loader后添加的内容
    -loader3-loader2-loader1
  })
})
//...
```
可以看出 loader 的执行顺序确实是相反的（从右向左，从下往上）。

- loader 可以是同步的，也可以是异步的。

- loader 运行在 Node.js 中，并且能够执行任何可能的操作。

- loader 接收查询参数。用于对 loader 传递配置。

- loader 也能够使用 options 对象进行配置。

- 除了使用 package.json 常见的 main 属性，还可以将普通的 npm 模块导出为 loader，做法是在 package.json 里定义一个 loader 字段。

- 插件(plugin)可以为 loader 带来更多特性。

- loader 能够产生额外的任意文件。

通过（loader）预处理函数，loader 为 JavaScript 生态系统提供了更多能力。 用户现在可以更加灵活地引入细粒度逻辑，例如：压缩、打包、语言翻译和 [更多其他特性](https://webpack.docschina.org/loaders)。

## loader runner

### loader类型

- 前置 pre

- 普通 normal

- 内联 inline

- 后置 post

loader 的叠加顺序：post + inline + normal + pre

### 特殊配置

符号 | 变量 | 含义
:-|:-|:-
-! | noPreAutoLoaders | 不执行前置和普通loader
! | noAutoLoaders | 不执行普通loader
!! | noPrePostAutoLoaders | 不执行前置、后置及普通loader


## 如何编写一个loader

loader 是导出为一个函数的 node 模块。该函数在 loader 转换资源的时候调用。给定的函数将调用 loader API，并通过 this 上下文访问。

这里编写一个file-loader的实现

```javascript
/**
 * 默认情况下webpack会把要加载的模块从硬盘上读出来，然后变成一个utf8字符串
 * @param  source 
 * getOptions 获取选项对象
 */
let { getOptions, interpolateName } = require('loader-utils');
function loader(source) {
    //this loaderContext上下文对象，里面有很多的属性和值
    //面loader plugin  
    // json 我需要对它进行过滤  有些模块没有现成的loader去处理，就需要自己写 
    console.log('这是在使用我自己的file-loader');
    let options = getOptions(this);
    console.log('options', options);
    // interpolate转译的意思 把一个模板变量字符串 转成一个字符串
    let filename = interpolateName(this, "[hash].[ext]", { content: source });
    this.emitFile(filename, source);
    return `module.exports = {default:${JSON.stringify(filename)}}`;
}
// 只要说loader.raw 等于true就是告诉webpack,请不要把模块内容 转成字符，给我Buffer
loader.raw = true;
module.exports = loader;
// loader只有一个功能就是转换代码 只是创建模块的用的
// plugin贯穿整个webpack生命周期的，功能非常强大

```
