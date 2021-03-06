
//基本koa服务器
const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const path = require('path');
const fs = require('fs');


app.use(bodyParser())
app.use(static(__dirname + '/'));


// var cors = require('koa2-cors');
// app.use(cors());

const NodeRSA = require('node-rsa')
const key = new NodeRSA({ b: 512 })
key.setOptions({ encryptionScheme: 'pkcs1' })

router.get('/nodersa/getPublicKey', (ctx) => {
    let publicKey = key.exportKey('public')  //生成公钥
    console.log(publicKey)
    ctx.body = {
        publicKey: publicKey
    }
})

router.post('/nodersa/login', (ctx) => {
    let userInfo = ctx.request.body.password.replace(/\s+/g, '+')
    let decrypted = key.decrypt(userInfo, 'utf8'); //解密
    console.log('解密数据：' + decrypted);
    ctx.body = {
        data: decrypted
    }
})


router.get("/redirectTest", function (ctx) {
    // ctx.set("Access-Control-Allow-Origin", "*")
    ctx.response.redirect('http://172.30.207.28:3009/login.html')
})

router.get("/redirect2", function (ctx) {
    // ctx.set("Access-Control-Allow-Origin", "*")
    // ctx.set("Access-Control-Allow-Credentials", true)
    ctx.cookies.set('RSESSIONID', 'hejiawei002');
    ctx.response.redirect('http://172.30.207.28:8080/#/logins')
})



//nodejs 流文件下载服务器
router.get('/file/:fileName', function (ctx) {
    // 实现文件下载 
    var fileName = ctx.params.fileName;
    var filePath = path.join(__dirname, "files/" + fileName);
    var stats = fs.statSync(filePath);
    if (stats.isFile()) {
        ctx.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'inline;filename=' + fileName,
            'Content-Length': stats.size
        });
        ctx.body = fs.createReadStream(filePath);
    } else {
        res.end(404);
    }
});


app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3009, function () {
    console.log("listen in 3009")
})