
//基本koa服务器
const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const app = new Koa();

app.use(bodyParser())
app.use(static(__dirname + '/'));

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

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3001)