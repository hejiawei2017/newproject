console.log('main1');
setTimeout(function () {
    console.log('setTimeout');
    process.nextTick(function () {
        console.log('process.nextTick2');
    });
}, 0);
new Promise(function (resolve, reject) {
    console.log('promise');
    resolve();
}).then(function () {
    console.log('promise then');
});
process.nextTick(function () {
    console.log('process.nextTick1');
});
console.log('main2');

//main1 promise main2 process.nextTick1 promise then setTimeout process.nextTick2