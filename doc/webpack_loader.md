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
  rules: {
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
  }
}
// ...
```
### loader的三种使用方式

- 配置（推荐），在 `webpack.config.js` 中指定loader

  这种即上面示例的方式，在 `module.rules` 中通过 `test` 属性标识出应该被对应loader进行转换的某个或某些文件，由 `use` 属性指定转换时使用哪个loader。

- 内联：在每个 `import` 语句中显式指定loader

  可以在 `import` 语句中指定loader，使用 ! 将资源中的 loader 分开，分开的每个部分都相对于当前目录解析。

  ```javascript
  import Styles 'style-loader!css-loader?modules!./styles.css';
  ```

- CLI 在shell命令中指定loader

  指定css文件使用 `style-loader` 和 `css-loader`

  ```bash
  webpack  --module-bind 'css=style-loader!css-loader'
  ```

## loader 特性


## 如何编写一个loader