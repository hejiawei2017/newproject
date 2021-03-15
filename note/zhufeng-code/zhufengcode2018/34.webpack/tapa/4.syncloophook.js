let { SyncLoopHook } = require('tapable');
let queue = new SyncLoopHook(['name']);
let count = 0;
// 返回true，则回调重复执行
queue.tap('1', function (name) {
    console.log(name, count++);
    if (count == 3) {
        return;
    } else {
        return true;
    }
});
queue.call('zfpx');