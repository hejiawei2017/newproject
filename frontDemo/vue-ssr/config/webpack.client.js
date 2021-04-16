/*
 * @Author: hejiawei
 * @Date: 2021-04-13 13:47:22
 * @LastEditors: hejiawei
 * @LastEditTime: 2021-04-13 23:53:36
 * @Description: 客户端webpack配置
 */
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")
const { merge } = require("webpack-merge")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const isClear = process.env.IS_BUILD == 1 ? true : false;
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const base = require("./webpack.base")
let plugins = []
if (isClear) {
  plugins = [new CleanWebpackPlugin(), new VueSSRClientPlugin()]
} else {
  plugins = [new VueSSRClientPlugin()]
}
const resolve = dir => {
  return path.resolve(__dirname, dir)
}
module.exports = merge(base, {
  devServer: {
    // 开启本地服务端口号
    port: 9000,
    open: true
  },
  entry: {
    // 打包入口
    // [文件名]: [入口路径]
    client: resolve("../src/client-entry.js")
  },
  plugins: plugins
})
