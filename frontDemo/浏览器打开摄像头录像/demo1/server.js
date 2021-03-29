"use strict";
/*
  HTTPS服务器只提供WebSocket连接服务，所以每个请求只返回404。
  真正的Web请求由机器上的主服务器处理。
  如果愿意，可以在这里返回真正的HTML并提供Web内容。
  这里使用 express 来指定静态文件
*/
var express = require('express'),
  app = express();
var http = require('http');
var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;

const fs = require('fs');
const path = require('path');
app.use('/', express.static(__dirname + '/public')); //指定静态HTML文件的位置


const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'public/files/') });
app.use(upload.any())
app.post('/upload', function (req, res) {


  var newName = req.files[0].path + path.parse(req.files[0].originalname).ext;
  fs.rename(req.files[0].path, newName, function (err) {
    if (err) {
      res.send('上传失败');
    } else {
      var fileObj = path.parse(newName)
      res.end(JSON.stringify({ successs: "ok", fileUrl: "files/" + fileObj.base }))
    }
  });

});


var httpServer = http.createServer(app);
/*
  在分配给此示例的端口上启动 HTTP 服务器。
  这将很快转换为WebSocket端口。
*/
httpServer.listen(3002, function () {
  console.log("Server is listening on port 3002");
});

/*
  socket 服务器
  通过将 HTTP 服务器转换为一个 WebSocket 服务器
*/
// var wsServer = new WebSocketServer({
//   server: httpServer
// });
// if (!wsServer) {
//   console.log("错误:无法创建WbeSocket服务器!");
// }

/*
  房间信息结构
  {
    房间号: {
      names: [],
      ws: []
    }
  }
*/
var arrWs = [];
var idcount = 0;
var arrBlob = []


// 服务器被客户端连接
// wsServer.on('connection', (ws) => {
//   arrWs.push({
//     id: idcount++,
//     ws
//   })
//   // 接收客户端信息并把信息返回发送
//   ws.on('message', (res) => {
//     let data = res;
//     console.log("data.res11", JSON.stringify(res))
//     if (data.type == "push") {
//       console.log("data.blob", data.blob)
//       arrBlob.push(data.blob)
//     }
//     if (data.type == "pushend") {
//       var filePath = path.join(__dirname, "/public/my.mp4");
//       let writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
//       writeStream.write(arrBlob.toString())
//     }

//   });
//   // 处理WebSocket“关闭”事件;这意味着用户已注销或已断开连接。
//   ws.on('close', function (reason, description) {

//   });
// });
// wsServer.broadcast = function (data) {
//   var msgString = JSON.stringify(data);
//   arrWs.forEach(function (client) {
//     client.ws.send(msgString);
//   });
// };
