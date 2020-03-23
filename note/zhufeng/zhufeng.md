# 一.webpack

1.实现简单的webpack

a.js:

```javascript
module.exports ='欢迎参加珠峰架构公开课'
```

b.js:

```
//require方法在nodejs中是同步的 a.js会被包含在闭包中
let str = require('./a.js');
console.log(str)
```

本地安装：

 npm init -y

npm install webpack webpack-cli -D //开发中的依赖

https://github.com/zhufengzhufeng/webpack-public



# 二.git

1.git可以帮助我们管理我们的代码保证代码不丢失，记录历史，还可以随时穿越

2.团队协助：两个人修改了同一个文件同一行就会发生冲突，git也需要手动解决冲突

尽量用模块化，组件化开发，避免冲突，git就可以实现自动合并

3.git拥有强大的分支管理系统

4.svn和git的区别：svn是集中式的，需要一台中央服务器，不断的备份代码，防止因为中央服务器挂了导致项目丢失，git是分布式的，每个人都有完整的版本库，中央服务器gutlab挂掉了也不影响，git的速度要比svn快，svn每个文件夹中都有一个文件夹.svn文件,git有一个单独的文件夹.git

git中各区的区分

![image-20200321221026276](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200321221026276.png)

5.安装

  1.window http://git-scm.com

  2.mac 如果安装过xcode自带git，homebrew是mac的包管理器，可以安装各种软件、

  3.配置用户：不配置用户不能提交代码

  4.初始化git

  在需要的目录下面（到目录下右键git bash here）输入 git init，表示这个文件夹给git管理了

  如果想取消git管理这个文件夹就可以删除.git 文件( rm -rf .git)



```
输入：git config --list //查看是否已经配置了用户
$ git config --list
core.symlinks=false
core.autocrlf=true
color.diff=auto
color.status=auto
color.branch=auto
color.interactive=true
pack.packsizelimit=2g
help.format=html
http.sslcainfo=D:/Program Files (x86)/Git/mingw32/ssl/certs/ca-bundle.crt
diff.astextplain.textconv=astextplain
rebase.autosquash=true
user.name=hejiawei11
user.email=499200621@qq.com
credential.helper=store

输入：
git config --global user.name hejiawei11
git config --global user.email 499200621@qq.com

//删除文件夹，以及文件
rm -rf 文件夹名字
rm 文件名字
//新建目录
mkdir git-project
//进入目录
cd git-project
//初始化
git init
//显示所有文件
ls -all 

//创建文件
toucn 1.txt

//查看文件内容
cat 1.txt

//编辑文件
vi 1.txt //在这个模式下面再按i 变成编辑模式就可以编辑了

//保存
按住esc退出编辑模式,输入:wq保存并退出

//查看提交状态
git status //未提交会有提示

//添加进缓存区
git add .  或者 git add -A

//从缓存区回退
git rm --cached . -r

//从缓存区提交到历史区
git commit -m '消息'

//查看当前分支历史信息
git log

//查看各区的代码不同
git diff //比较工作区和暂存区的不同
git diff master //比较工作区和历史区的不同
git diff --cached //比较暂存区和历史区不同

//从暂存区回滚数据到工作区
git checkout .

//从缓存区回滚上一次提交
git reset head .
git checkout .

//文件被提交过一次的情况下，从工作区直接到历史区
git commint -a -m 'msg'

//从历史区中回滚版本
git reset --hard 版本id
git reset --hard head^ //快速回到上一个版本

//查看历史区各个操作历史记录，然后选择id，回到对应的版本
git reflog  


//查看git分支
git branch

//创建git分支
git branch dev

//切换分支
git checkout dev

//删除dev分支
git branch -D dev //这个要退出当前dev分支才能删除dev分支

//暂存分支
git stash
现在可以切换分支了
回来的时候可以通过执行git stash pop 把暂存区的代码抛出来

注意：各个分支之间要真正commit才能区别分支下提交的文件，例如在dev下面提交一个文件
在dev 执行git commit -m ‘’之后 master才看不到这个文件，切换分支的时候必须把代码变更commit、
之后才能切换。或者暂存分支 git stash


//合并分支 
以master为主干，在master分支下面 执行 git merge dev，把dev合并到master

第一次要有一个根提交的文件，执行git add . 再git commit -m 'root',整个流程才能通畅

除了vi可以编辑文件之外，可以使用echo 内容 >> 文件名称,例如:echo hello >> 1.txt







```





5.一个完整的git开发流程

1.本地新建目录，cd 进入目录，执行 git add .  

2.执行git commit -m 'root commit'

3.创建并且切换分支 git checkout -b dev

4.通过 touch index.css 文件 vi 修改文件  :wq 退出保存

5.git add . 提交文件到缓存区

6.git commit -m 'add dev' ，提交文件到历史区

7.切换分支合并，git checkout master ， git merge dev

8.当遇到冲突的时候，回有提示那个文件冲突，修改好文件

![image-20200322215608442](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200322215608442.png)

等号是分割线，最后只留下需要的代码 color：red，修改好之后 执行 git add . 再执行

git commit -m 'msg'



6.提交到github，代码必须要推送到历史区，才能推送到github,并且不会上传空文件夹

  1.touch readme.md

  2.不想提交的文件列表.gitignore

​     ![image-20200322221743379](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200322221743379.png)

3.连接github创库

 git remote add origin https://github.com/zhufenzhufen/node-project.git

 git push -u origin master //第一次写成这样，以后可以直接git push ,  -u是记住origin的意思

4.查看远程源

  git remote -v

5.删除远程源

  git remote rm 名字



6.推送master到远程创库

  git push  origin master

7.拉取线上代码

  git pull origin master



8.在git仓库发布静态页面

 git checkout -b gh-pages

 touch index.html

 git add .

 git commit -m ''

 git push origin gh-pages

在setting上面再到连接，再主页上线加上这个连接别人就可以访问了



9.fork项目

   fork到本地，本地更新远程不会更新

10.拉取到本地

   git clone 项目地址 项目别名（本地的文件夹名字）

11.本地改好commit和push后，这自己的本地的fork地址上点击 new pull request----create pull request,填写相关信息提交

12.自己组员就不需要fork了，可以在settins---options---collaborarors添加组员