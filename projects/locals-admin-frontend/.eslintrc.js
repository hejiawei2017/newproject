module.exports = {
    "extends": "react-app",
    "env": {
        "browser": true,
        "node": true,
        "mocha": true,
        "es6": true
    },
    "rules": {
        "no-unused-vars": 0,
        "no-cond-assign": 1,
        // "no-empty": 1,                                       // 禁止出现空语句块
        // "use-isnan": 1,                                      // 要求使用 isNaN() 检查 NaN
        "no-irregular-whitespace": 0,                           //不规则的空白不允许
        "no-trailing-spaces": 1,                                //一行结束后面有空格就发出警告
        "comma-dangle": [2, "never"],                           // 要求或禁止末尾逗号：不允许逗号
        "space-before-function-paren": [2, "always"],           // 函数声明的圆括号前增加一个空格
        "space-infix-ops": [2, {"int32Hint": false}],           // 中缀运算符必须使用一个空格分开
        'eqeqeq':[2, "always", {"null": "ignore"}],             // 使用严格运算符===替代相等运算符==
        //"indent": [2, 4],
        "no-multi-spaces": 1,
        //"react/jsx-tag-spacing": 1,                             // 总是在自动关闭的标签前加一个空格，正常情况下也不需要换行
        "jsx-quotes": [1, "prefer-double"],
        "no-mixed-operators": 0,                                // 不允许混合使用不同的运算符
        "react/jsx-closing-bracket-location": 1,                // 遵循JSX语法缩进/格式
        "react/jsx-boolean-value": 1,                           // 如果属性值为 true, 可以直接省略
        "react/no-string-refs": 1,                              // 总是在Refs里使用回调函数
        // "react/self-closing-comp": 0,                        // 对于没有子元素的标签来说总是自己关闭标签
        "react/jsx-no-bind": 1,                                 // 当在 render() 里使用事件处理方法时，提前在构造函数里把 this 绑定上去
        "react/sort-comp": 1,                                   // 按照具体规范的React.createClass 的生命周期函数书写代码
        "react/jsx-pascal-case": 1,                             // React模块名使用帕斯卡命名，实例使用骆驼式命名,
        "react/prop-types": ["ignore"],                         // 干掉 react-prop，日后再补~
        "no-fallthrough": 0,                                    //禁止 case 语句落空
        "no-unreachable": 0,                                    //禁止未使用过的变量
    }
}



