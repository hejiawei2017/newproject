let { AsyncParallelBailHook } = require('tapable');
let queue = new AsyncParallelBailHook(['name']);
console.time('cost');
//带保险的异步并行执行钩子,只要有一个任务有resolve或者reject值，不管成功失败都结束
queue.tapPromise('1', function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(name, 1);
            reject('a');
        }, 1000);
    });
});
queue.tapPromise('2', function (name, cb) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(name, 2);
            resolve('b');
        }, 2000);
    });
});
queue.tapPromise('3', function (name, cb) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log(name, 3);
            resolve('c');
        }, 3000);
    });
});
queue.promise('zfpx').then(data => {
    console.log(data);
    console.timeEnd('cost');
}, err => {
    console.error(err);
});