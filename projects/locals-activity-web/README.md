# Locals 活动页

# 使用方法

## 开始开发：

1. 生成活动文件：
npm run new 活动文件名

2. 启动开发环境：
npm run start --m="活动文件名"

3. 打包活动页：
npm run prod --m=活动文件名

# TODO
[] axios
[] react

# IE8 支持的写法


[√] es5 && es6
[√] Promise
[ ] es7
[ ] async&await

# 兼容IE8方案

```
// IE8 支持es5 需要引入：
import '@js/es5-shim.min.js'
// IE8 Promise 需要引入
import '@js/es6-promise.auto.min.js'
```

# 目录结构

```
├── src
    ├── page
    │    ├── activity-page // 活动名称
    │         ├── index.html 入口模板对应着入口文件
    │         ├── css
    │         ├── js
    │              ├── components
    │              ├── index.js 入口文件
    │              ├── index2.js 入口文件
    │         ├── images
    │         ├── fonts
    ├── css
    ├── font
    ├── js // 公用js
    ├── build // node文件
```

# px2rem 使用规则

0. 只处理less文件,不处理css文件
1. 不打算转换原始值，例如：1px边框，/*no*/在声明后添加
2. 打算强制使用px，根据data-dpr的值来变化，例如：font-size，/*px*/在声明后添加
3. 注意：处理SASS或LESS，只能使用/*...*/注释
4. IE11以下不支持

例子：
```
.selector {
    width: 150px;
    height: 64px; /*px*/
    font-size: 28px; /*px*/
    border: 1px solid #ddd; /*no*/
}
```

编译成：
```
.selector {
    width: 2rem;
    border: 1px solid #ddd;
}

/** data-dpr需要借助flexible.js来生成 **/

[data-dpr="1"] .selector {
    height: 32px;
    font-size: 14px;
}
[data-dpr="2"] .selector {
    height: 64px;
    font-size: 28px;
}
[data-dpr="3"] .selector {
    height: 96px;
    font-size: 42px;
}
```

# 使用 async && await 需要引入

```
import 'babel-polyfill'
```

# package

jquery: 1.x版本

less: css预处理

babel: 转换es6语法

cross-env: 兼容win/mac系统执行命令行

lib-flexible: 移动端自适应

lrz: 压缩拍摄图片/图片资源

## 测试环境配置：

1. 修改配置文件：
deploy.sh

2.project_list加入自己的文件夹名
project_list=("preInsurance" "20181022registeredH5" "20180919guoJiaH5" "20190221visaInterview" "20190109cleanKeeping")

3.url访问
http://tp.localhome.cn:9096/{project_list.xxx}/index.html


##vue-generate-form控件文档
https://vue-generators.gitbook.io/vue-generators/


### 生产
文件位置： 120.76.204.105/locals/attachment
环境：http://f.localhome.cn/{project_list.xxx}/index.html