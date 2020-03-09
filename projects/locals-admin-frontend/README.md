# locals-admin-frontend 

#### 项目介绍
路客次世代管理后

#### 软件架构
软件架构说明


#### 使用说明
```
本地运行
yarn install || npm install
yarn start || npm start

打包
yarn build || npm run build

发布
yarn deploy
```

#### 实现功能
- [x] 打包构建：Babel Webpack(4.x)
- [x] 热更新
- [x] 包管理：Yarn || Npm
- [x] UI库：React & React-Dom(16.2.0)
- [x] UI组件：Antd(3.x)
- [x] 路由：react-router(4.x)、react-router-redux
- [x] JS：ES6、ES7
- [x] 样式：less
- [x] 状态管理：redux
- [x] Ajax：Axios
- [x] 跨域: 基于 CORS 实现
- [x] 代码校验: Eslint
- [x] 菜单第三层
- [ ] window滚动条
- [ ] layout公共化
- [ ] layout右侧内容scroll
- [ ] 增加tab功能

#### 项目组件
[动态增减表单项](https://gitee.com/jefftam/locals-admin-frontend/blob/coupon/src/components/dynamicFieldSet/readme.md)

#### 参与贡献

1. Fork 本项目
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request


#### 码云特技

1. 使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2. 码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3. 你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4. [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5. 码云官方提供的使用手册 [http://git.mydoc.io/](http://git.mydoc.io/)
6. 码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)

#### 代码规范
前端文档规范

前端文档规范

1，	Js页面的命名  
首字母大写，英文翻译命名且小驼峰式命名  例路客首页:  localsHome

2，	Class 命名 
尽量使用语义明确的单词命名，避免 left bottom 等方位性的词语
中横线命名（全体小写，英翻简洁化）  例： .submit-btn 
如果有行为操作，使用 . js-* 来表示行为(相对于样式)，但是不要在 CSS 中包含这些 class。例： .js-submit-btn
      <div class=”submit-btn  js-submit-btn>按钮</div>

3，	排版规范，尽可能代码中以TAB（4格式）缩进。
4，	规则书写规范 - 使用单引号，不允许使用双引号; - 每个声明结束都应该带一个分号，不管是不是最后一个声明;
 
5，	代码合理注释。
// 初始化序列号
var index = 0;

6，	JS功能书写，尽可能采用 Es6语法

7，	每个页面有一个文件夹，内三部分 例：


	├── home
	│   ├── index.js
	│   ├── home.js
	│   └── index.scss

项目共同样式 common.scss
项目初始化样式 reset.css

常用的命名：  
(1)页面结构  - 容器:
	container - 页头：
	header - 内容：
	content/container - 页面主体：
	main - 页尾：
	footer - 导航：
	nav - 侧栏：
	sidebar - 栏目：
	column - 页面外围控制整体布局宽度：
	wrapper - 左右中：
	left right center 
 (2)导航   - 导航：
	nav - 主导航：
	mainbav - 子导航：
	subnav - 顶导航：
	topnav - 边导航：
	sidebar - 左导航：
	leftsidebar - 右导航：
	rightsidebar - 菜单：
	menu - 子菜单：
	submenu - 标题: title - 摘要: summary  
(3)功能   - 标志：
	logo - 广告：
	banner - 登陆：
	login - 登录条：
	loginbar - 注册：
	regsiter - 搜索：
	search - 功能区：
	shop - 标题：
	title - 加入：
	joinus - 状态：
	status - 按钮：
	btn - 滚动：
	scroll - 标签页：
	tab - 文章列表：
	list - 提示信息：
	msg - 当前的: current - 小技巧：
	tips - 图标: icon - 注释：
	note - 指南：
	guild - 服务：
	service - 热点：
	hot - 新闻：
	news - 下载：
	download - 投票：
	vote - 合作伙伴：
	partner - 友情链接：
	link - 版权：
	copyright




#### Git代码提交流程

git pull //更新自己目录
git status // 查看状态
git add -A . //添加文件
git commit -am ‘修改信息’ //commit

git push //提交线上自己仓库
#没问题
直接PP

#冲突
git pull //拉取线上总仓库文件
git status //查看冲突文件
手动进行冲突文件合并
Git push //提交线上自己仓库

#备注
开发前先查看src/utils/utils.js中dev环境是否正确。
