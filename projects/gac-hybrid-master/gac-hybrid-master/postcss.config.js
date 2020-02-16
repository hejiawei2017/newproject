//在postcss.config.js中进行配置

module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px2rem": {
      remUnit: 75 //转换为rem的基准px
      //rootValue: 75
      //其他配置选项自行查文档
    }
  }
};
