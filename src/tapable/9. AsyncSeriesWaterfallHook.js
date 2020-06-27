const { AsyncSeriesWaterfallHook } = require('tapable');
//1.支持异步  2. 串行一个接一个执行 3.瀑布 上一个返回值可以成为下一个参数
let hook = new AsyncSeriesWaterfallHook(['name']);
/* hook.tap('1', (name) => {
    console.log(1, name);
});
hook.tap('2', (name) => {
    console.log(2, name);
    return 'result2';
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
        callback(null, 'result2');
    }, 2000);
});
hook.tapAsync('3', (name, callback) => {
    setTimeout(() => {
        console.log(3, name);
        callback();
    }, 3000);
});
//凡是异步callback,第一个参数是表示有没有错误的，如果第1个参数为null就表示没有错误，不为null就错误
hook.callAsync('zhang', () => {
    console.timeEnd('cost');
}); */

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
}, (error) => {
    console.log('error', error);
    console.timeEnd('cost');
}); 