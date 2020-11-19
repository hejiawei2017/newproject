let net = require("net");
let server = net.createServer((socker) => {
  socker.setEncoding("utf8");
  //接受客户端的数据
  socker.on("data", function (data) {
    socker.write("服务器回应：" + data);
  });
  socker.on("end", function () {});
  socker.on("close", function () {});
});
server.listen(8080, function () {
  console.log("listen in 8080");
});
