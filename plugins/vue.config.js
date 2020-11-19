module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-plugin-px2rem")({
            rootValue: 75, // 新版本的是这个值
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3, //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ],
      },
    },
  },
  devServer: {
    headers: { // needed for iFrame inclusion
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    proxy: {
      "/redirectTest": {
        target: "http://localhost:3009",
        changOrigin: true,
        headers: { // needed for iFrame inclusion
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
      },
      "/uploadfromfront": {
        target: "http://14.23.157.98:8090",
        changOrigin: true,
      },
      '/gtcommtool': {
        target: "http://10.10.104.3",
        changOrigin: true,
      },
      '/nodersa': {
        target: "http://localhost:3001",
        changOrigin: true,
      }
    },
  },
};
