/**
 * babel-plugin 是名字必须有的 后面跟插件名字
 */
const babel = require('@babel/core');
const t = require('babel-types');

/**
 * import { flatten as flat } from 'lodash';
 * =>
 * import flat from 'lodash/flatten';
 * 
 * 思路：
 * 1、变解构导出为默认导出
 * 2、存在解构重命名，应该取local
 */

const visitor = {
  ImportDeclaration: {
    enter(path, state) {
      let node = path.node;
      let specifiers = node.specifiers;
      let source = node.source;

      if (state.opts.library.includes(source.value) && t.isImportDefaultSpecifier(specifiers[0])) { // 只有不是默认导入才会进
        let declarations = specifiers.map(specifier => {
          let importDefaultSpecifier =  t.importDefaultSpecifier(specifier.local);
          t.importDeclaration([importDefaultSpecifier], t.stringLiteral(`${source.value}/${specifier.imported.name}`));
        });
        path.replaceWithMultiple(declarations);
      }
    }
  }
}

module.exports = function() {
  return {
    visitor
  }
}
