
const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const cors = require('cors');

var corsOptions = {
    origin: 'http://172.30.220.205:8084',
    // 允许跨域情况下发送cookie,
    credentials: true,
    maxAge: '1728000',

}
app.use(cors(corsOptions))
app.use(cookieParser());

//允许跨域访问
// app.all('*', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://172.30.220.205:8082');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//     res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
//     res.header('X-Powered-By', ' 3.2.1');
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });
app.use(express.static('./public'));

app.get("/api/user", function (req, res, next) {


    res.json({
        code: 0,
        message: "成功"
    });
    next()
})
app.post("/api/login", function (req, res, next) {
    let param = Object.assign({}, req.query, req.body);//初始化参数
    let username = param.username;
    let password = param.password;
    console.log("param.usename", param.username)
    console.log("param.password", param.password)
    if (username == "hejiawei" && password == "123456") {

        res.cookie("RSESSIONID", "hejiawei", {
            expires: new Date(Date.now() + 900000),
        });
        res.json({
            code: 0,
            message: "成功"
        });
    } else {
        res.json({
            code: -1,
            message: "失败"
        });
    }
    next()
})

app.listen(3010, function () {
    console.log('listen in 3010');
});
