let { SyncBailHook } = require('tapable');
let queue = new SyncBailHook(['name']);
queue.tap('1', function (name) {
    console.log(name, 1);
    return 'wrong'//有返回值，跳过后面的
});
queue.tap('2', function (name) {
    console.log(name, 2);
});
queue.tap('3', function (name) {
    console.log(name, 3);
});
queue.call('zfpx');