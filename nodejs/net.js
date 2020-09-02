let net = require("net");
let path = require("path");
let ws = require("fs").createWriteStream(path.join(__dirname, "msg.txt"));
let server = net.createServer(function (socket) {
  //先暂停
  socket.pause();
  socket.setTimeout(3 * 1000);
  //3秒后再重新写入
  socket.on("timeout", function () {
    //通过socket.pipe，灌入写流，end: false代表写完后不关闭
    socket.pipe(ws, { end: false });
  });
});
server.listen(8080);
