let button = document.createElement("button");
button.innerHTML = "点我";
button.onclick = function() {
    import(/*webpackChunkName: 'title'*/'./title.js').then(function(result){
        console.log(result.default);
    });
    //异步加载
    /*require.ensure([], function(){//当title.js需要依赖于其他模块的时候，需要在[]中加入
    let result = require('./title.js')
        console.log(result);
    })*/
};
document.body.appendChild(button);