let config = require("./src/p.config.js");
let yargs = require("yargs");

process.argv.slice(2).forEach(function (arg) {
  process.stdout.write(arg);
});

let argv = yargs.option("sys", {
  alias: "systemtype",
  demand: "false",
  type: "string",
  default: "centerMain",
  description:
    "系统类型：中心公服 centerMain 知识产权 intellectual  检测检验 Inspection  产业 industry 消费者 consumer",
}).argv;
console.log("argv--------", argv);
if (argv.systemtype) {
  config.systemType = argv.systemtype;
}

var fs = require("fs");
fs.readFile("./src/p.config.js", "utf8", function () {
  config.systemType = argv.systemtype;
  var new_config = JSON.stringify(config);
  var result = "module.exports =" + new_config;
  console.log("new_config", result);
  fs.writeFile("./src/p.config.js", result, function (err) {
    console.log(err);
  });
});
