const { SyncLoopHook } = require('tapable');
//它的特点是不停的循环执行事件函数，直到结果等于undefined
//特别要注意的每次都是从头开始循环的
let hook = new SyncLoopHook(['name', 'age']);

let counter1 = 0;
let counter2 = 0;
let counter3 = 0;

hook.tap('1', (name, age) => {
    console.log(1, 'counter1', counter1, name, age);
    if (++counter1 == 1) {
        counter1 = 0;
        return;
    }
    return true;
});

hook.tap('2', (name, age) => {
    console.log(2, 'counter2', counter2, name, age);
    if (++counter2 == 2) {
        counter2 = 0;
        return;
    }
    return true;
});//counter1 1 counter2 2 counter3 3

hook.tap('3', (name, age) => {
    console.log(3, 'counter3', counter3, name, age);
    if (++counter3 == 3) {
        counter3 = 0;
        return;
    }
    return true;
});

hook.call('zhang', 26);