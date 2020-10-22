let crypto = require("crypto");
let str = "hello";
let sha1 = crypto.createHash("sha1");
sha1.update("hello");
sha1.update("world");
console.log(sha1.digest("hex"));
