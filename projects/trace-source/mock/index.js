var express = require('express');
const session = require('express-session');

var app = express();
app.use(
    session({
      secret: 'Keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        maxAge: 5000
      } /*第一个参数：只有在https才可以访问cookie；第二个参数：设置cookie的过期时间*/,
      rolling: true /*只要页面在操作就不会过期，无操作5秒后过期*/
    })
  );
require('./login')(app);

app.listen(3001, () => {
  console.log('app listen at 3001');
});
