let net = require("net");
let socket = new net.Socket();
socket.connect(8080, "localhost", function () {
  //连接后向服务器写数据
  socket.write("hello");
});
//防止乱码
socket.setEncoding("utf8");
//接受服务器过来的数据
socket.on("data", function (data) {
  console.log(data);
});
