const path = require("path");
const glob = require("glob");
const pages = getPages("./src/pages/**/*.js");
const config = require("./src/config.js");
console.log(config.baseURL);

function getPages(globPath) {
  let pages = {},
    basename,
    tmp,
    pathname;
  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split("/").splice(-3);
    pathname = tmp.splice(0, 1) + "/" + basename;
    pages[pathname.replace("pages/", "")] = {
      entry: entry,
      template: entry.replace(".js", "") + ".html",
      filename: `${basename}.html`
    };
  });
  return pages;
}

var sdkMap = {
  pgc: {
    version: 0.1
  },
  "pgc-n": {
    version: 0.1
  }
};

const pluginName = "SDKGePlugin";

class SDKGePlugin {
  apply(compiler) {
    var sdkKeyArr = Object.keys(sdkMap);
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      //   console.log('The webpack build process is starting!!!',Object.keys(compilation.assets));
      Object.keys(compilation.assets).forEach(key => {
        var paths = key.split("/");
        var segs = paths[paths.length - 1].split(".");
        if (segs.length == 3 && segs[2] == "js") {
          var index = sdkKeyArr.indexOf(segs[0]);
          if (index != -1) {
            var filePath = `${segs[0]}.sdk.v${sdkMap[segs[0]].version}.js`;
            var sdkPath = paths
              .slice(0, -1)
              .concat([filePath])
              .join("/");
            compilation.assets[sdkPath] = compilation.assets[key];
          }
        }
      });
      callback();
    });
  }
}
// console.log(pages)
module.exports = {
  publicPath: "",
  outputDir: "dist",
  assetsDir: "static",

  devServer: {
    port: 8999,
    proxy: {
      "/order": {
        target: config.baseURL,
        changOrigin: true,
        secure: false
      },
      "/score": {
        target: config.baseURL,
        changOrigin: true,
        secure: false
      },
      "/community": {
        target: config.baseURL,
        changOrigin: true,
        secure: false
      }
    }
  },

  chainWebpack: config => {
    // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
    config.optimization.splitChunks({
      cacheGroups: {}
    });
  },
  pages: pages,
  configureWebpack: {
    plugins: [new SDKGePlugin()]
  }
};
