const { SyncHook } = require('tapable');
// 事件订阅 事件发布
// tapable是webpack运转的核心，整个核心架构都是基于这个实现
let hook = new SyncHook(['name', 'age']);
// tap注册事件 1参数是名字，这个名字其实没什么太大的用途，是给开发人员自己看的
hook.tap('1', (name, age) => { // tap注册
  console.log(1, name, age);
});

hook.tap('2', (name, age) => {
  console.log(2, name, age);
});

hook.tap('3', (name, age) => {
  console.log(3, name, age);
});

hook.call('zhang', 26); // call触发事件，或者说执行