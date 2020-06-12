/**
 * babel 插件 将一个 ES6 箭头函数转换为 ES5 的普通函数
 * 1.拿到sourceCode的AST
 * 2.对比普通函数的AST
 */
const babel = require('@babel/core'); // 用来转换和遍历语法树的
const t = require('babel-types'); // 处理类型，用于创建节点以及判断某个未知节点是否是某种类型

const sourceCode = `const sum = (a, b) => a + b`;
// babel 插件，是给babel-core用的，babel-core 是给 babel-loader用的
const transformArrowFunction = {
  visitor: { // babel会遍历抽象语法树，比如当发现某一个节点的类型是 ArrowFunctionExpression 就进入该方法
    ArrowFunctionExpression(path) {
      // console.log(path)
      const node = path.node; // node代表节点对象
      const id = path.parent.id; // 当前节点父节点的id
      const params = node.params;
      const body = t.blockStatement([
        t.returnStatement(node.body)
      ]);
      const functionExpression = t.functionExpression(id, params, body, false, false);
      path.replaceWith(functionExpression)
    }
  }
}

// 转换代码靠的是插件
const newCode = babel.transform(sourceCode, {
   plugins: [
    transformArrowFunction
   ]
 });

 console.log(newCode.code)

 /**
  * 转换的最终的目标代码
  const targetSourceCode = `
  var sum = function sum(a, b) {
    return a + b;
  }
 `;
  */
