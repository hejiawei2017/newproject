const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
const fs = require("fs");
const WebpackDevServer = require("webpack-dev-server");
const SpritesmithPlugin = require("webpack-spritesmith");
const SitemapPlugin = require("sitemap-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const VueLoaderPlugin = require("vue-loader/lib/plugin");

const NODE_ENV = process.env.NODE_ENV;
const isDevelopEnv = process.env.isDevelopEnv;

const buildEnv = ["prod", "pre", "dev", "test"];
// 是否打包上线服务器
const isUploadOnline = buildEnv.indexOf(NODE_ENV) > -1 && !isDevelopEnv;
// 获取script命令参数
const argv = JSON.parse(process.env.npm_config_argv);
// 获取 -m=xxxx 文件名
const m = argv.original
  .slice(2)
  .toString()
  .split("=");
const FILENAME = m[1] || process.env.npm_config_message;

if (!FILENAME) {
  console.log(
    "没有传入文件夹名！:格式：npm " + argv.original.join(" ") + " --m=xxxx "
  );
  process.exit();
  return false;
}

const FILEDIR = "src/page/" + FILENAME;

if (!fsExistsSync(path.resolve(__dirname, FILEDIR))) {
  console.log("没有此" + FILENAME + "文件夹名！");
  process.exit();
}

var commonsChunk = getCommonsChunk("src/js/*/*.js", FILEDIR);

if (isUploadOnline) {
  // 在打包生产环境时资源路径需要加上文件夹路径
  publicPath = "/" + FILENAME + "/";
} else {
  // 在开发环境时资源路径默认为根目录
  publicPath = "/";
}

var config = {
  entry: getEntry(FILEDIR + "/js/*.js", FILEDIR),
  output: {
    // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
    path: path.join(__dirname, "./dist/", NODE_ENV + "/" + FILENAME),
    // 模板、样式、脚本、图片等资源对应的server上的路径
    publicPath: publicPath,
    // 每个页面对应的主js的生成配置
    filename: "js/[name].js",
    // chunk生成的配置
    chunkFilename: "js/[id].chunk.js"
  },
  resolve: {
    alias: {
      "@js": path.resolve(__dirname, "src/js"),
      "@css": path.resolve(__dirname, "src/css"),
      'vue$': "vue/dist/vue.common.js"
    }
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: "/node_modules/",
        loader: ExtractTextPlugin.extract("css")
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            less: [
              //lang属性对应的名称
              "vue-style-loader", //首先给vue的样式loader过滤一遍
              "css-loader", //css-loader,把css转js
              "less-loader" //用less编译
            ]
          }
        }
      },
      {
        test: /\.less$/i,
        exclude: "/node_modules/",
        loader: ExtractTextPlugin.extract(["css", "px2rem", "less"]),
        options: {
          // 100px / 75 => 1.3333333rem
          remUnit: 75,
          remPrecision: 6
        }
      },
      {
        //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
        //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
        test: /\.html$/,
        exclude: /node_modules/,
        loader: "html?minimize=false&attrs=img:src img:data-src"
      },
      {
        //文件加载器，处理文件静态资源
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },
      {
        //视频加载
        test: /\.(mp4|flv|swf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=video/[name].[ext]"
      },
      {
        //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
        //如下配置，将小于50000byte的图片转成base64码
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: "url-loader?limit=5000&name=images/[hash].[ext]"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/"
      }
    ],
    postLoaders: [
      {
        test: /\.js$/,
        loaders: ["es3ify-loader"]
      }
    ]
  },
  devtool: "inline-source-map",
  plugins: [
    // new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery", // 使jquery变成全局变量,不用在自己文件require('jquery')
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    // 类库统一打包生成一个文件
    new webpack.optimize.CommonsChunkPlugin({
      name: "common", // 将公共模块提取，生成名为`common`的chunk
      chunks: commonsChunk, // 提取哪些模块共有的部分
      minChunks: commonsChunk.length // 提取使用3次以上的模块，打包到common里
    }),
    //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new ExtractTextPlugin("css/[name].[hash:8].css"),
    new webpack.DefinePlugin({
      MY_ENV: JSON.stringify(NODE_ENV)
    }),
    // 仅对webpack 1.x需要OccurenceOrderPlugin
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

if (!!NODE_ENV) {
  config.plugins.push(
    new CleanWebpackPlugin([path.join("dist", NODE_ENV + "/" + FILENAME)])
  );
}

if (isUploadOnline) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        properties: false,
        warnings: false
      },
      output: {
        beautify: false,
        quote_keys: false
      },
      mangle: {
        screw_ie8: false
      },
      sourceMap: false
    })
  );
}

var viewObj = getView(FILEDIR + "/*.html", FILEDIR);

// 生成HTML文件
viewObj.forEach(function(item) {
  var conf = {
    //生成的html存放路径，相对于path
    filename: path.resolve(
      __dirname,
      "dist",
      NODE_ENV + "/" + FILENAME,
      item.basename + ".html"
    ),
    //html模板路径
    template: item.entry,
    inject: "body", // js插入的位置，true/'head'/'body'/false
    hash: true, // true:为静态资源生成hash值
    // favicon: './favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
    chunks: [item.basename], //需要引入的chunk，不配置就会引入所有页面的资源
    minify: {
      //压缩HTML文件
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: false //删除空白符与换行符
    }
  };
  config.plugins.push(new HtmlWebpackPlugin(conf));
});

function getView(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = [],
    entry,
    dirname,
    basename,
    pathname,
    extname;
  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    entries.push({
      basename: basename,
      entry: entry
    });
  }
  return entries;
}

/**
 * 动态查找所有入口文件
 * @params globPath 命令 'src/page/*通配符/index.js'
 * @params pathDir 相对根目录的文件名
 **/
function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = {},
    entry,
    dirname,
    basename,
    pathname,
    extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    // 键值为活动文件名
    entries[basename] = ["./" + entry];
  }
  return entries;
}

function getCommonsChunk(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = [],
    entry,
    dirname,
    basename,
    extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    entries.push(basename);
  }
  return entries;
}

function getSitemap(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = [],
    entry;

  entries.push("");
  for (var i = 0; i < files.length; i++) {
    entry = files[i];

    entries.push(entry);
  }

  for (n in entries) {
    entries[n] = entries[n].replace("src", "");
  }
  return entries;
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = config;
