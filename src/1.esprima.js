/**
 * esprima 把JS源码转成抽象语法树
 * estraverse 可以遍历语法树并且可以生成新的AST
 * escodegen 将AST重新生成源码
 */

 const esprima = require('esprima');
 const estraverse = require('estraverse');
 const escodegen = require('escodegen');

 let sourcecode = 'function fn() {}';

 let astTree = esprima.parseScript(sourcecode);
 let indent = 0;

 function padding() {
   return ' '.repeat(indent)
 }

 estraverse.traverse(astTree, {
   enter(node) {
    console.log(padding() + '进入' + node.type)
    if (node.type === 'FunctionDeclaration') {
      node.id.name = 'ast_rename'; // 修改name
    }
    indent += 2;
   },
   leave(node) {
    indent -= 2;
    console.log(padding() + '退出' + node.type)
   }
 })

 let newCode = escodegen.generate(astTree);
 console.log(newCode)
