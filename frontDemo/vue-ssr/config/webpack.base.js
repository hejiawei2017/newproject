/*
 * @Author: hejiawei
 * @Date: 2021-04-13 13:47:13
 * @LastEditors: hejiawei
 * @LastEditTime: 2021-04-13 00:24:48
 * @Description: 基础(共用)webpack配置
 */
const path = require("path")
const { VueLoaderPlugin } = require("vue-loader")

const mode = process.env.IS_BUILD == 1 ? "production" : "development";
const filename = process.env.IS_BUILD == 1 ? "[name].bundle_[chunkhash:8].js" : "[name].bundle.js";
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  mode,
  output: {
    // 出口
    filename, // 打包文件名
    path: path.resolve(__dirname, "../dist") // 输出路径
  },
  devtool: "source-map",
  resolve: {
    // 解析文件时  按照以下孙旭查找后缀
    extensions: [".js", ".vue", ".css", ".jsx"],
    alias: {
      '@': resolve('../src')
    }// 这样配置后 @ 可以指向 src 目录
  },
  module: {
    // 针对不同模块做不同的处理
    rules: [
      { test: /\.vue/, use: "vue-loader" },
      // loader顺序是从上到下  从右到左
      // 默认会把.vue文件中的样式变成.css
      { test: /\.css/, use: ["vue-style-loader", "css-loader", "postcss-loader"] },
      {
        test: /\.js/,
        use: {
          // 默认使用babel-loader ==> babel-core (transform) => preset
          loader: "babel-loader",
          options: {
            // 将js文件 从 es6 => es5
            presets: ["@babel/preset-env"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|bmp|gif|svg)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(woff|ttf|eot|svg|otf)$/,
        use: {
          //url内部内置了file-loader
          loader: 'url-loader',
          options: {//如果要加载的图片大小小于10K的话，就把这张图片转成base64编码内嵌到html网页中去
            limit: 10 * 1024,
            esModule: false
          }
        }
      },
    ]
  },
  plugins: [new VueLoaderPlugin()]
}
