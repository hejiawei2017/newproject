let path = require("path");
let str = "a/b/c/a.jpg";
//去连接中和文件名称，并且去掉后缀
console.log(path.basename(str, ".jpg"));
//取得后缀名称
console.log(path.extname(str, ".jpg"));
