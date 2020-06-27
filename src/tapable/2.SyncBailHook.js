const { SyncBailHook } = require('tapable');
// Bail是保险丝
let hook = new SyncBailHook(['name', 'age']);

hook.tap('1', (name, age) => {
  console.log(1, name, age);
});

hook.tap('2', (name, age) => {
  console.log(2, name, age);
  return 2; // 1 旦发现有一个事件函数返回了不为undefined的返回值，则不再执行后续的事件函数
});

hook.tap('3', (name, age) => {
  console.log(3, name, age);
});

hook.call('zhang', 26);