const { AsyncParallelHook } = require('tapable');

//Async关键字的钩子都支持三种注册方式 tap tapAsync tapPromise

let hook = new AsyncParallelHook(['name']);
/* hook.tap('1', (name) => {
    console.log(1, name);
});
hook.tap('2', (name) => {
    console.log(2, name);
});
hook.tap('3', (name) => {
    console.log(3, name);
});
hook.callAsync('zhang', () => {
    console.log('over');
}); */
/* console.time('cost');
hook.tapAsync('1', (name, callback) => {
    setTimeout(() => {
        console.log(1, name);
        callback();
    }, 1000);
});
hook.tapAsync('2', (name, callback) => {
    setTimeout(() => {
        console.log(2, name);
        callback();
    }, 2000);
});
hook.tapAsync('3', (name, callback) => {
    setTimeout(() => {
        console.log(3, name);
        callback();
    }, 3000);
});
hook.callAsync('zhang', () => {
    console.timeEnd('cost');
});  */

console.time('cost');

hook.tapPromise('1', (name) => {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(1, name);
            resolve();
        }, 1000);
    });
});

hook.tapPromise('2', (name) => {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(2, name);
            resolve();
        }, 2000);
    });
});

hook.tapPromise('3', (name) => {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            console.log(3, name);
            resolve();
        }, 3000);
    });
});

hook.promise('zhang').then((result) => {
    console.timeEnd('cost');
}); 