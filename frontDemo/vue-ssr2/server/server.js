const fs = require("fs");
const path = require("path");
const Router = require('koa-router')
const send = require('koa-send')
const router = new Router()

let { parse, format } = require('url');
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const resolve = file => path.resolve(__dirname, file);


// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require("vue-server-renderer");
const bundle = require("../dist/server/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/client/vue-ssr-client-manifest.json");

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve("../src/index.temp.html"), "utf-8"),
  clientManifest: clientManifest
});

function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
}

// 第 3 步：添加一个中间件来处理所有请求
const handleRequest = async (ctx, next) => {

  let req = ctx.request
  const resourceLoader = new jsdom.ResourceLoader({
    userAgent: ctx.request.req.headers["user-agent"],
  });

  let { protocol } = parse(req.header.referer || "http://", true);
  protocol = protocol || "http:"
  const dom = new JSDOM('', {
    url: protocol + '//' + req.header.host,
    resources: resourceLoader
  });
  global.window = dom.window
  global.document = window.document
  global.navigator = window.navigator
  window.nodeis = true
  const url = ctx.path
  if (url.includes('.')) {
    console.log(`proxy ${url}`)
    try {
      return await send(ctx, url, { root: path.resolve(__dirname, '../dist/client') })
    } catch (err) {
      console.log(err)
    }

  }

  ctx.res.setHeader("Content-Type", "text/html");
  const context = {
    title: "ssr",
    url
  };
  // 将 context 数据渲染为 HTML
  const html = await renderToString(context);
  ctx.body = html;
}
router.get('/(.*)', handleRequest)

module.exports = router
