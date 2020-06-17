# learn-webpack
学习webpack的记录，版本4.x

webpack 工作流程

初始化参数：

1.获取命令行参数

2.获取webpack.config.js导出对象，进行合并

开始编译：

1.用获取到的options初始化compiler，加载所有的插件plugins，执行run方法开始编译。

2.先找配置文件中的entry入口文件

3.从入口文件出发，调用此模块的loader进行模块进行转换，转成AST。通过遍历语法树，找到这个模块的依赖模块(ImportDeclaration, CallExpression(callee.name = require))，再按此流程遍历依赖的模块

4.当一个模块及其依赖的模块都编译完成后，就能得到每个模块最终的内容和他们之间的依赖关系

输出资源：

根据入口文件和模块之间的依赖关系，组装成一个一个的chunk，再把chunk转成一个单独的文件添加到输出列表，这是修改输出文件的最后机会

输出完成：

在确定输出的文件后，根据配置的路径和文件名，把文件内容写入到文件系统
