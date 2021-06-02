// server.js
const express = require("express")
const path = require("path")
const resolve = dir => path.join(__dirname, dir)
const fs = require("fs")
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require(resolve('dist/vue-ssr-server-bundle.json'))
const clientManifest = require('../../www/statics/m/first-aid/vue-ssr-client-manifest.json')
const renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false,
      template: fs.readFileSync(resolve('template.html'), 'utf-8'),
     clientManifest
})

const app = express()
// 静态资源
app.use(express.static(resolve('../../www')))

app.use((req, res) => {
      const context = { url: req.url }
     const resourceLoader = new jsdom.ResourceLoader({
            userAgent: req.headers['user-agent'],
        });
      const dom = new JSDOM('', {
            url: req.protocol+'://'+req.hostname,
            resources: resourceLoader
      });
      global.window = dom.window
      global.document = window.document
      global.navigator = window.navigator
      window.nodeis = true
     window.scrollTo = (x, y) => {
            document.documentElement.scrollTop = y;
        }
      renderer.renderToString(context, (err, html) => {
            if (err) {
                 console.log(err)
                  if (err.code === 404) res.status(404).end('Page not found')
                  else res.status(500).end('Internal Server Error')
              } else res.end(html)
        })
  })

app.listen(80)
