const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const compressionWebpackPlugin = require("compression-webpack-plugin"); //引入插件
const nodeExternals = require("webpack-node-externals");
const pconfig = require("./src/p.config.js");
const proxy = require("./src/proxy.js");
const merge = require("lodash.merge");
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";
const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  lintOnSave: false,
  publicPath: isDev ? "http://127.0.0.1:7799" : "",
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 7799,
    https: false,
    hotOnly: false,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: proxy,
  },
  css: {
    extract: !isDev,
    sourceMap: isDev,
  },
  outputDir: TARGET_NODE ? "./dist/server" : "./dist/client", // 输出路径
  configureWebpack: () => ({
    // 将 entry 指向应用程序的 server / client 文件
    entry: `./src/entry-${target}.js`,
    // 对 bundle renderer 提供 source map 支持
    devtool: "source-map",
    target: TARGET_NODE ? "node" : "web",
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? "commonjs2" : undefined,
      globalObject: "this",
    },
    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: TARGET_NODE
      ? nodeExternals({
          // 不要外置化 webpack 需要处理的依赖模块。
          // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
          // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
          allowlist: [/\.css$/],
        })
      : undefined,
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined,
    },
    plugins: [
      new compressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
        threshold: 10240, // 文件超过10k，进行gzip压缩
        minRatio: 0.8,
        deleteOriginalAssets: false, // 是否删除原文件
      }),

      TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
    ],
  }),
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.transformAssetUrls = {
          img: "src",
          image: "xlink:href",
          "b-img": "src",
          "b-img-lazy": ["src", "blank-src"],
          "b-card": "img-src",
          "b-card-img": "src",
          "b-card-img-lazy": ["src", "blank-src"],
          "b-carousel-slide": "img-src",
          "b-embed": "src",
        };
        return merge(options, {
          optimizeSSR: false,
        });
      });
    config.plugin("define").tap((args) => {
      //从命令传入参数，用参数在项目中判断是否是显示项目
      args[0]["process.env"].WEBPACK_TARGET = JSON.stringify(
        process.env.WEBPACK_TARGET
      );
      args[0]["process.env"].SYSTEM_TYPE = JSON.stringify(pconfig.systemType);
      args[0]["process.env"].ENV_IS_BROWSER = JSON.stringify(target);
      args[0]["process.env"].BASE_IMG_URL = JSON.stringify(
        pconfig.base_image_url
      );
      args[0]["process.env"].PROXY_URL = JSON.stringify(pconfig.proxy_url);

      return args;
    });
    config.module // 覆盖v-html指令，防止xss攻击
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
          options.compilerOptions.directives = {
              html(node, directiveMeta) {
                  (node.props || (node.props = [])).push({
                      name: "innerHTML",
                      value: `xss(_s(${directiveMeta.value}))`
                  });
              }
          };
          return options;
      });
    if (!isDev) {
      config.optimization.splitChunks({
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 100000, // 依赖包超过100000bit将被单独打包
        automaticNameDelimiter: "-",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `chunk.${packageName.replace("@", "")}`;
            },
            priority: 10,
          },
        },
      });
      config.externals = {
        vue: "Vue",
        "vue-router": "VueRouter",
        moment: "moment",
      };
    }
    // fix ssr hot update bug
    if (TARGET_NODE) {
      config.plugins.delete("hmr");
    }
  },
};
