## 一.ui-app介绍

uni-app 是一个使用 **Vue.js** 开发跨平台应用的前端框架。
开发者通过编写 Vue.js 代码，uni-app 将其编译到iOS、Android、微信小程序等多个平台，保证其正确运行并达到优秀体验。

uni-app 继承自 Vue.js，提供了完整的 Vue.js 开发体验。

uni-app 组件规范和扩展api与微信小程序基本相同。

有一定 Vue.js 和微信小程序开发经验的开发者可快速上手 uni-app ，开发出兼容多端的应用。

uni-app提供了条件编译优化，可以优雅的为某平台写个性化代码、调用专有能力而不影响其他平台。

uni-app打包到App时仍然使用了5+引擎，5+的所有能力都可以在uni-app中可以使用。在App端运行性能和微信小程序基本相同。

对于技术人员而言：不用学那么多的平台开发技术、研究那么多前端框架，学会基于vue的uni-app就够了。
对于公司而言：更低成本，覆盖更多用户，uni-app是高效利器。
uni-app多端演示

为方便开发者体验uni-app的组件、接口、模板，DCloud发布了Hello uni-app演示程序（代码已开源，详见Github），Hello uni-app实现了一套代码，同时发布到iOS、Android、微信小程序。

1.ide下载地址https://www.dcloud.io/hbuilderx.html





![image-20200618230520475](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200618230520475.png)



HBuilderX标准版可直接用于web开发、markdown、字处理场景。做App仍需要安装插件。
App开发版预置了App/uni-app开发所需的插件，开箱即用。
标准版也可以在插件安装界面安装App开发所需插件，App开发版只是一个预集成作用。
App开发插件体积大的原因主要有2方面：

1. 真机运行基座，Android版、iOS版、iOS模拟器版，加起来体积就1百多M。真机运行基座需要把所有模块都内置进去，方便大家开发调试。开发者自己做app打包是不会这么大的，因为可以在manifest里选模块来控制体积。
2. uni-app的编译器，依赖webpack和各种node模块，node_modules就是这么一个生态现状，文件超级多，几万个文件，解压起来很慢。

如果你使用`uni-app cli`方式创建项目，编译器会在项目下，且你不开发App，只用uni-app做小程序和H5，那使用标准版就可以。





2.创建项目：文件，新建项目，选择uni\-app

![image-20200618230707236](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200618230707236.png)

注意：没有办法启动小程序的时候：

![image-20200619000040427](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200619000040427.png)

3.项目目录结构：

![image-20200619064718347](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200619064718347.png)



page.json相当于小程序的app.json,配置app相关的选项目，每个页面都需要注册到pages下面

main.js是运行时候的变量总的存放路径

page下面的是页面文件index.vue,里面最多包含一个templete，一个script，和多个style

static方静态文件，注意小程序不要方太大的图片

components方组件

