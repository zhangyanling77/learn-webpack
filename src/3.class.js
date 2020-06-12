/**
 * 类转为普通代码
 */
const babel = require('@babel/core');
const t = require('babel-types');

const sourceCode = `
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
`;

// 插件
const transformClassPlugin = {
  visitor: {
    ClassDeclaration(path) {
      const node = path.node;
      const id = node.id;
      const classMethods = node.body.body; // 获取两个方法 constructor 和 getName
      let statements = [];
      classMethods.forEach(method => {
        if (method.kind === 'constructor') { // 构建构造函数
          statements.push(
            t.functionDeclaration(id, method.params, method.body)
          )
        } else { // 普通类上的方法，应该被转译到普通函数的原型对象上去
          statements.push(
            t.assignmentExpression(
              '=',
              t.memberExpression(
                t.memberExpression(id, t.identifier('prototype')),
                method.key
              ),
              t.functionExpression(null, method.params, method.body)
            )
          )
        }
      })
      if (statements.length === 1) { // 只有构造函数
        path.replaceWith(statements[0]);
      } else {
        path.replaceWithMultiple(statements); // 替换多个
      }
    }
  }
}

const newCode = babel.transform(sourceCode, {
  plugins: [
    transformClassPlugin
  ]
});

console.log(newCode.code)

/**
 * 最终目标代码
const targetSourceCode = `
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  return this.name;
}
`;
 */
