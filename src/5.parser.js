const { jSXIdentifier } = require("babel-types");

/**
 * AST的解析分为两步：
 * parser 把代码转成语树
 * 
 * 1、分词 把整个代码字符串分割成token符号，并不关心它的含义，token也被称为语法单元
 * 2、语法分析 建立token之间的关系
 * 
 * 语法单元有哪些？
 * 1.关键字 const let var
 * 2.标识符 可能是一个变量，也可能是 if else true false这些常量
 * 3.运算符 + - * /
 * 4.数字 0-9
 * 5.空格 s -t
 * 6.注释
 * 
 * 实现babel插件，将jsx => js
 * 
 */
const OPERATOR = 'OPERATOR'; // 操作符
const JSX_ELEMENT = 'JSX_ELEMENT'; // jsx 元素
const IDENTIFIER = 'IDENTIFIER'; // 标识符
const KEYWORD = 'KEYWORD'; // 关键字
const WHITESPACE = 'WHITESPACE'; // 空格

let sourceCode = `let element = <h1>hello</h1>`;
//  let transpileCode = `let element = React.createElement('h1', null, 'hello')`;

// 第一步，分词
function lexical(code) {
  const tokens = [];
  for(let i = 0; i < code.length; i++) {
    let char = code.charAt(i);
    if (char === '=') {
      tokens.push({
        type: OPERATOR, // token的类型
        value: char
      })
    } else if(char === '<') {
      const token = {
        type: JSX_ELEMENT,
        value: char
      }
      tokens.push(token);
      let isFirstGreaterThan = true;
      for (i++; i < code.length; i++) {
        char = code.charAt(i)
        token.value += char
        if (char === '>') {
          if (isFirstGreaterThan) {
            isFirstGreaterThan = false
          } else { // jsx的第二个结束符，跳出当前循环
            break;
          }
        }
      }
      continue;
    } else if (/[a-zA-Z\$\_]/.test(char)) {
      const token = {
        type: IDENTIFIER,
        value: char
      }
      tokens.push(token)
      for (i++; i < code.length; i++) {
        char = code.charAt(i)
        if (/[a-zA-Z\$\_]/.test(char)) {
          token.value += char
        } else {
          i--;
          break;
        }
      }
      if (token.type === IDENTIFIER && (token.value === 'let' || token.value === 'var')) {
        token.type = KEYWORD
      }
      continue;
    } else if (/\s/.test(char)) {
      const token = {
        type: WHITESPACE,
        value: char
      }
      tokens.push(token)
      for (i++; i < code.length; i++) {
        char = code.charAt(i)
        if (/\s/.test(char)) {
          token.value += char
        } else {
          i--;
          break;
        }
      }
      continue;
    }
  }
  return tokens;
}

let tokens = lexical(sourceCode);
// console.log(tokens)
/**
 * 
 [ 
  { type: 'KEYWORD', value: 'let' },
  { type: 'WHITESPACE', value: ' ' },
  { type: 'IDENTIFIER', value: 'element' },
  { type: 'WHITESPACE', value: ' ' },
  { type: 'OPERATOR', value: '=' },
  { type: 'WHITESPACE', value: ' ' },
  { type: 'JSX_ELEMENT', value: '<h1>hello</h1>' }
 ]
 */

 // 第二步，语法分析
 // 确定token之间的关系，把tokens转为AST
 const VariableDeclaration = 'VariableDeclaration'; // 变量声明语句，可能包含多个变量声明，如：var a, b, c;
 const VariableDeclarator = 'VariableDeclarator'; // 变量声明
 const Identifier = 'Identifier'; // 定义
 const JSXElement = 'JSXElement';
 const JSXOpeningElement = 'JSXOpeningElement';
 const JSXClosingElement = 'JSXClosingElement';
 const JSXIdentifier = 'JSXIdentifier';
 const JSXText = 'JSXText';

 function parse(tokens) {
  const astTree = {
    type: 'Program', // 程序
    sourceType: 'module', // 类型是模块
    body: [], // 代码体，数组
  }
  
  let i = 0;
  let currentToken;
  while(currentToken = tokens[i]) {
    if (currentToken.type === KEYWORD) { // 关键字，VariableDeclaration
      let variableDeclaration = {
        type: VariableDeclaration,
        declarations: [],
        kind: currentToken.value
      }
      i += 2;
      let varibaleDeclarator = {
        type: VariableDeclarator,
        id: {
          type: Identifier,
          name: currentToken.value
        }
      }
      variableDeclaration.declarations.push(varibaleDeclarator);
      i += 4;
      currentToken = tokens[i];
      if (currentToken.type === JSX_ELEMENT) { // JSX Element
        let value = currentToken.value; // <h1>hello</h1>
        let [, type, children] = value.match(/<([^<]+?)>([^<]*)<\/\1>/); // \1 代表引用第一个分组 type = h1 children = hello
        varibaleDeclarator.init = {
          type: JSXElement,
          openingElement: {
            type: JSXOpeningElement,
            name: {
              type: JSXIdentifier,
              name: type
            }
          },
          closingElement: {
            type: JSXClosingElement,
            name: {
              type: JSXIdentifier,
              name: type
            }
          },
          children: [
            {
              type: JSXText,
              value: children
            }
          ]
        }
      }
      astTree.body.push(variableDeclaration)
      i++;
    }
  }
  return astTree;
}

let astTree = parse(tokens);
console.log(JSON.stringify(astTree, null, 2))

/**
{
  "type": "Program",
  "sourceType": "module",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "let"
          },
          "init": {
            "type": "JSXElement",
            "openingElement": {
              "type": "JSXOpeningElement",
              "name": {
                "type": "JSXIdentifier",
                "name": "h1"
              }
            },
            "closingElement": {
              "type": "JSXClosingElement",
              "name": {
                "type": "JSXIdentifier",
                "name": "h1"
              }
            },
            "children": [
              {
                "type": "JSXText",
                "value": "hello"
              }
            ]
          }
        }
      ],
      "kind": "let"
    }
  ]
}
 */
