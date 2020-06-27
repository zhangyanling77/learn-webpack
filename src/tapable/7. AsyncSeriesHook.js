const { AsyncSeriesHook } = require('tapable');

let hook = new AsyncSeriesHook(['name']);

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