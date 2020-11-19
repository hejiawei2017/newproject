let url = require("url");
let str = "http://usr:pwd@localhost:8080/user?id=5#top";
//如果第二个参数为true，那么query就是一个对象了
let userObj = url.parse(str, true);
console.log(userObj);
console.log(url.format(userObj));
