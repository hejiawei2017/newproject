import babel from 'rollup-plugin-babel';
export default {
    input: './src/index.js', // 以哪个文件作为打包的入口
    output: {
        file: 'dist/umd/vue-shepherd.js', // 出口路径
        name: 'vueShepherd', // 指定打包后全局变量的名字
        format: 'umd', // 统一模块规范
        sourcemap: true, // es6-> es5  开启源码调试 可以找到源代码的报错位置
    },
    plugins: [ // 使用的插件
        babel({
            exclude: "node_modules/**"
        })
    ]
}