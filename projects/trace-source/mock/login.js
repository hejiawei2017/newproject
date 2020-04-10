module.exports = function(app) {
  app.get('/api/login', function(req, res) {
    const { username, password } = req.query;
    console.log(username, password);
    if (username && password) {
      //设置session
      req.session.username = username;
      res.json({ code: 1, token: 'jilei' });
    } else {
      res.status(401).json({ code: 0, message: '用户名或者密码错误' });
    }
  });
  app.get('/api/logout', function(req, res) {
    req.session.cookie.maxAge = 0;
    res.send('退出成功');
  });
  app.get(
    '/api/getTestList',
    function(req, res, next) {
      if (!req.session.username) {
        res.status(401).json({ code: 1, msg: '没有登录' });
      } else {
        next();
      }
    },
    function(req, res) {
      res.json({ code: 1, data: [{ name: 'test1', age: '12' }] });
    }
  );
};
