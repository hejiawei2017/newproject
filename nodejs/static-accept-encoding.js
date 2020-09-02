let http = require("http");
let path = require("path");
let url = require("url");
let fs = require("fs");
let { promisify } = require("util");
let mime = require("mime");
let zlib = require("zlib");
//把一个异步的方法转换成一个promise方法
let stat = promisify(fs.stat);
//客户端发起请求的时候，会通过accept-encoding 告诉服务器我支持的解压格式
// 例如：accept-encodinh:gzip,deflate
http
  .createServer(async function (req, res) {
    let { pathname } = url.parse(req.url);
    if (pathname == "favicon.ico") {
      return;
    }
    let filepath = path.join(__dirname, pathname);
    try {
      let statObj = await stat(filepath);
      //根据文件名返回不同的content-type，设置响应头
      res.setHeader("Content-Type", mime.getType(pathname));
      //accept-encoding小写是为了兼容不同的浏览器
      let acceptEncodeing = req.headers["accept-encoding"];
      //内容压缩协商
      if (acceptEncodeing) {
        if (acceptEncodeing.match(/\bgzip\b/)) {
          res.setHeader("Content-Encoding", "gzip");
          fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res);
        } else if (acceptEncodeing.match(/\bdeflate\b/)) {
          res.setHeader("Content-Encoding", "deflat");
          fs.createReadStream(filepath).pipe(zlib.createDeflate()).pipe(res);
        } else {
          fs.createReadStream(filepath).pipe(res);
        }
      } else {
        fs.createReadStream(filepath).pipe(res);
      }
    } catch (e) {
      res.statueCode = 404;
      res.end();
    }
  })
  .listen(8081, function () {
    console.log("success");
  });
