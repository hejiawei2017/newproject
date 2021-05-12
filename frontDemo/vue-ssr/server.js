
const VueServerRenderer = require("vue-server-renderer")
const Koa = require("koa")
const Router = require("koa-router")
const static = require("koa-static")
const fs = require("fs")
const path = require("path")
const os = require('os');
require('console-color-mr');
const proxys = require("./src/proxy.js");
const proxy = require('koa-server-http-proxy')

const resolve = dir => path.resolve(__dirname, dir)
// 创建koa实例
const app = new Koa()


// 创建router实例
const router = new Router()
// 读取js 和 模板
const serverBundle = require("./dist/vue-ssr-server-bundle.json")
const template = fs.readFileSync(resolve("dist/index.ssr.html"), "utf8")
const clientManifest = require("./dist/vue-ssr-client-manifest.json")
// 创建renderer
const renderer = VueServerRenderer.createBundleRenderer(serverBundle, {
  template,
  clientManifest // 通过后端注入前端的js脚本
})
router.get("/(.*)", async ctx => {
  // 客户端 = template + 编译结果 = 组成的html
  // 在渲染页面的时候 需要让服务器根据当前路径渲染对应的路由
  try {
    const body = await renderer.renderToString({
      url: ctx.url,
      ctx: ctx,
    })
    ctx.body = body
  } catch (e) {
    console.log(e)
    if (e.code == 404) {
      ctx.body = "not found"
    }
  }
})

Object.keys(proxys).forEach((k) => {
  app.use(proxy(k, proxys[k]))
})


// 优先使用静态服务插件 加载静态资源
app.use(static(resolve("dist")))
// 路由插件
app.use(router.routes())
function getIPv4() {
  //同一接口可能有不止一个IP4v地址，所以用数组存
  let ipv4s = [];
  //获取网络接口列表对象
  let interfaces = os.networkInterfaces();
  let interfacesArr = []
  Object.keys(interfaces).forEach((key) => {
    interfacesArr = interfacesArr.concat(interfaces[key])
  })
  interfacesArr.forEach(function (item) {
    if ('IPv4' == item.family && item.internal == false) {
      ipv4s.push(item.address); //可用的ipv4s加入数组
    }
  })
  return ipv4s;
}
// 启动服务 监听端口
const port = 3008;
const ipv4s = getIPv4();
app.listen(port, (e) => {
  console.log('listening in ' + '\n' + 'http://localhost:'.green + port.green)
  ipv4s.forEach((ipv4) => {
    console.log('http://'.green + ipv4.green + ':'.green + port.green)
  })

})
