# 一.docker

1.体系结构

![image-20200527211635007](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200527211635007.png)

![image-20200527212140424](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200527212140424.png)

2.安装docker

  

```js
1.安装依赖包 
sudo yum install -y yum-utils

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io
2.启动docker
 systemctl start docker
3.查看安装的版本
docker info

4.拉取镜像
docker pull nginx

5.查看本地的镜像
docker images

6.卸载
yum remove dockrer-ce
rm -rf /var/lib/docker
```

3.镜像的管理

什么是镜像？简单来说镜像是一个不包含linux内核而又精简的操作系统

镜像从哪里来的？docker hub 是由docker公司负责维护的公共注册中心，包含大量的容器镜像，docker工具默认会从这个源下载镜像：https://hub.docker.com/explore

默认是国外的源，可以改为国内的：

#vi  /etc/docker/deamon.json

{

 "registry-mirrors":['https://registy.docker-cn.com']

}



4.镜像与容器联系

容器其实是在镜像的最上面加了一层读写层，在运行容器里做的任何文件的改动，都会写到这个读写层，如果容器删除了，最上面的读写层也就删除了，改动也就丢失了



5.dokcer帮助命令：docker --help

![image-20200609062101290](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200609062101290.png)

帮助子命令：：docker image --help



![image-20200609063905451](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200609063905451.png)

docker一般命令

 1.查看所有的镜像：docker image ls

2.查看一个镜像的详情：docker image inspect nginx

3.远程拉取一个镜像docker image pull nginx:1.11

4.删除一个镜像：docker image rm nginx:1.12

5.给镜像打标签 ：docker tag  9bc90d9f01f3  jenken:test  //给镜像id9bc90d9f01f3，重新命名一个名字和tag

6.保存导入镜像：docker image save nginx:1.11 > nginx1.11.tar    docker load < nginx1.11.tar





6.docker 容器：

![image-20200611065025868](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200611065025868.png)

  1.创建并且运行一个容器：dockder container run -itd --name bs busybox

​    传入变量：dockder container run -itd -e a=123  --name bs busybox

  2.查看所有容器：docker ps    //docker ps -a //停止的再用的所有的容器都在里面  

​    也可以是docker container ls, 看一个容器的详细信息：docker container inspect  容器id

  3.进入一个容器：docker container attach bs

​     进入容器并且运行 sh : docker exec -it  bs sh    (推荐)

​     如果有变量的话：echo $a

  4.启动一个容器：docker container start bs

  5.进入容器退出来：ctrl + T +Q

  6.把容器的80端口映射到主机的8080：

  docker container run -itd -p 8080:80 --name ng nginx

  7.现在容器cpu使用一个 ：docker container run -itd  --cpus 1  -p 8080:80 --name ng nginx

  8.限制使用内存：docker container run -itd  --menory 512m  -p 8080:80 --name ng nginx

  9.禁止主机因为内存不住而杀掉容器：--oom-kill-disable

 10.提交一个镜像：docker commit 新镜像名字 busybox:v2（busybox:是原来的镜像）

11.把当前主机上的文件拷贝到容器中：docker container cp filename bs1:/root

​     进入容器查看：：docker container exec bs1 ls /root   (容器重启文件还会在)

12.查看某个容器的错误输出信息,和资源使用情况

​    docker logs bs1      docker stats  bs1

13.容器启动停止和删除

  docker container  start 容器id

 docker container  stop 容器id

  docker container  rm 容器id





7.管理应用程序的数据

![image-20200614111944443](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200614111944443.png)



volumes：可以在主机中挂载数据到容器中

![image-20200614170821338](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200614170821338.png)

1.docker volume ls //查看卷

2.docker volume create nginx-vol//创建

3.创建并且运行一个容器，在主机挂载数据卷nginx-vol 到容器的/usr/share/ngiux/html

   docker run -d -it --name=nginx-test --mount src=nginx-vol, dst=/usr/share/ngiux/html nginx

进入数据卷里面 cd /var/lib/docker/volumes/ngnix-vol/_data/    新建一个index.html，就可以用nginx访问了，多个网站的数据共享可以这么配置

4.停止容器，删除容器，删除数据卷

  docker container stop nginx-test

  dokcer container rm nginx-text

  docker volume rm nginx-vol

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
touch 1.txt

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



13.添加贡献者setttings => collaborators,添加之后的人拥有项目的最大权限

14.gui界面化

   sourceTree



# 二.node基础

1.nodejs是基于v8引擎的js运行环境,他可以让js执行效率与低端的c语言相近的执行效率

nodejs使用了一个事件驱动的，非阻塞io的模型，使其轻量又高效

nodejs的包管理器npm，是全球最大的开源生态系统

2.进程是操作系统分配资源和调度任务的基本单位，进程里面可以开启很多的线程

3.apache：一般网络请求是客户端发起请求，服务器开启一个线程，当处理完数据，线程返回数据到客户端，线程被销毁。多个请求会发起多个线程

4.nodejs：进程nodejs里面只会启动一个主的线程，各个请求到了都由这个线程处理，线程处理完了就不会管后面的步骤，去处理其他的请求了，直到请求处理完之后，再由这个线程放回客户端

 这样做会有以下的有优势：

  1.节约内存，每个线程有需要大约5m的内存，现在只有一个了，大量节约内存

  2.节约上下文切换的时间，没有线程之间的切换时间

  3.可以很好的解决锁的问题，并发资源的处理问题

  4.一般4g的内存就可以处理几万的并发了



![image-20200328183403863](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200328183403863.png)

  5.为什么js是单线程的呢？

​        这个是由js这门脚本语言决定的，如果是多线程就很难避免dom操作的冲突，而且多线程之间的通讯也是个问题，浏览器里面ui线程和js线程是公用一个线程，webworder虽然说是多线程，但是他是完成受主线程的控制的，并且是不能操作dom的，并不有完全的线程能力

​    除了ui+js线程还有1.事件触发线程 2.定时器线程 3.异步请求线程

  6.event loop

​     在主要ui+js线程外面，遇到事件，定时器，异步请求，这些会独立开一个新的线程，这些线程任务执行完毕会把回调函数会放到一个回调队列里面，当主线程的同步代码执行完毕以后，event loop 会遍历回调队列，按照先进先出的顺序执行回调，每次执行完主线程的代码，都会通过event loop检查回调队列，执行回调，process.nextTick()是把代码放到当前同步代码的后面（注意和宏任务和微任务的区别）,stack队列后面还有一个taskqueue队列，主要用于放置微任务（想异步执行，又想尽快执行），先于callback queue执行

   

  ![image-20200328205745324](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200328205745324.png)



  7.同步异步的区别：同步是可以立刻等到返回结果的，异步是不能立刻等到返回结果的，要通过回调函数通知返回的结果

8.阻塞和非阻塞

  阻塞调用是指调用结果返回之前，当前的线程会被挂起，调用线程只有在得到结果之后才会返回

 非阻塞调用是指不能立刻得到结果之前，该调用不会阻塞当前的线程

  注意：同步是被调用决定的，就是什么时候返回由被调用者决定，立即返回就同步，过后返回就是异步，阻塞是调用者决定的，调用者这时同时去做其他事情就变成非阻塞了，等待就是阻塞了

9.repl：在cmd下面输入node进入repl环境，就是nodejs的执行环境

![image-20200329170127799](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200329170127799.png)

可以新建一个文件repl.js:

 let repl = require('repl');

let context = repl.start().context;

context.msg = 'hello';

context.hello = function(){

  console.log(context.msg)

}

然后在cmd上面执行node repl.js 就可以导入文件执行的代码

可以通过命令.save 1.log 保存当前代码到1.log上面，可以通过.load 1.log 从文件中加载代码

10.global

   1.console.log() console.info()  console.warn(),console.error()

   2.输出时间差console.time('const')   console.timeEnd('const')

3. 断言console.assert(1==1,‘报错’)//如果表达式为false的话就会报错

​    ![image-20200329210043378](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200329210043378.png)

​    4.跟踪代码调用栈console.trace()

​    5.console.log(process.cwd())/当前工作目录，process.chdir('..')//切换到上级目录

​    6.nextTick 和setImmediate的区别与联系

​    nextTick 把回调函数放到当前执行栈的底部，   setImmediate把函数放在事件队列的尾部，所以应              该是nextTick先执行的，node的作者是推荐setImmediate的写法的，另外setImmediate和settimeout的执行顺序是不确定的

11.events

 let EvemtEmitter = require('events');

 let util = require('util');

 function Bell(){

​     EvemtEmitter.call(this)

 }

util.inherits(Bell,EvemtEmitter);

bell.on('name',fucntion(){})//订阅

bell.emit('name')//发布

自己编写：

```
function EventEmitter(){
  this.events = {};//会把所有的事件监听函数放在这个对象里保存
  //指定给一个事件类型增加的监听函数数量最多有多少个
  this._maxListeners = 10;
}
EventEmitter.prototype.setMaxListeners = function(maxListeners){
  this._maxListeners = maxListeners;
}
EventEmitter.prototype.listeners = function(event){
  return this.events[event];
}
//给指定的事件绑定事件处理函数，1参数是事件类型 2参数是事件监听函数
EventEmitter.prototype.on = EventEmitter.prototype.addListener = function(type,listener){
  if(this.events[type]){
    this.events[type].push(listener);
    if(this._maxListeners!=0&&this.events[type].length>this._maxListeners){
      console.error(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this.events[type].length} ${type} listeners added. Use emitter.setMaxListeners() to increase limit`);
    }
  }else{
    //如果以前没有添加到此事件的监听函数，则赋一个数组
    this.events[type] = [listener];
  }
}
EventEmitter.prototype.once = function(type,listener){
  //用完即焚
 let  wrapper = (...rest)=>{
   listener.apply(this,rest);//先让原始的监听函数执行
   this.removeListener(type,wrapper);
 }
 this.on(type,wrapper);
}
EventEmitter.prototype.removeListener = function(type,listener){
  if(this.events[type]){
    this.events[type] = this.events[type].filter(l=>l!=listener)
  }
}
//移除某个事件的所有监听函数
EventEmitter.prototype.removeAllListeners = function(type){
  delete this.events[type];
}
EventEmitter.prototype.emit = function(type,...rest){
  this.events[type]&&this.events[type].forEach(listener=>listener.apply(this,rest));
}
module.exports = EventEmitter;
```



12. util 模块

    let util = require('util');

    let obj = {name:'zzfpx',home:{city:'北京'}}

    console.log(util.inspect(obj))

     对象原样输出：{name:'zzfpx',home:{city:'北京'}}

    util下面还是很多的类型判断方法

13. 思考下面的代码：

    ```
    function Clock(){
      this.listener;
    
      process.nextTick(()=>{
        this.listener();
      })
    }
    Clock.prototype.add = function(listener){
      this.listener = listener;
    }
    let c = new Clock();
    c.add(()=>{console.log('ok')});
    ```

    因为nextTick慢于同步代码，所以这样写不会报错

14.js模块化：

​     模块化发展历程：

​     

```javascript
/* 0. 命名空间
 * 1. 闭包 自执行函数
 * 2. require.js AMD
 * 3. sea.js CMD
 * 4. node.js common.js
 * 6. es6 es module
 * 7  umd amd+cmd+common+es+module 全部兼容
 **/
 
 requirejs 和seajs 用的不多了，就不需要再关注了，nodejs用的是commonjs规范
 反过来促进了commonjs的发展
 commonjs：
1.在node.js里面每一个单独的文件都是一个单独的模块
2.通过require方法实现模块间的依赖管理 
3.commonjs的模块基本上就是函数闭包，模块的封装的闭包函数是如下代码：
 (function(exports,require,module,__filename,__dirname){
   //这里是模块内部代码
   return module.exports;
 })();
 
 4 * 在node.js里通过require方法加载其它模块
 * 这个加载是同步的
 * 1. 找到这个文件
 * 2. 读取此文件模块的内容
 * 3. 把它封装在一个函数里立刻执行
 * 4. 执行后把模块的module.exports对象赋给school
5.commonjs对缓存的控制
   在第一次加载的require之后，会缓存这个模块的export对象，第二次就会从缓存中读取这个模块
   不会再次加载执行代码了，也就是说多次require一个文件是同一个对象来的
  
6.返回绝对路方法,不加载模块：
  console.log(require.resolve('./school'));
7.最原始的执行的入口模块：
  require.main
8.nodejs格式加载顺序
 let user = require('./user')
 当require加载一个模块的时候，会先找user.如果找不到，会再找user.js,如果还找不到找user.json,如果还找不到user.node，还是找不到就找文件夹，找到文件夹就找packjson中的main，没有packjson就找index.js或者index.node
9.在模块中this === module.export
10.nodejs是不支持这个import方法导入的，这个是静态的导入和require动态导入有冲突，为什么vue+webpack就可以了呢，是因为webpack把import打包成require了
11.nodejs原生的模块有http fs util path等等，是放在了node.exe中的
12.reiquire的加载过程:先判断有没有缓存，如果没有就判断是不是原生的模块，如果不是就查找加载模块，再缓存模块，然后在export导出

 
```

15.npm发布流程

  1.先登录：npm login，输入用户名和密码，然后输入npm pulish发布

16.单位

  8位=1字节

  1024字节 = 1k

17.encoding

 二进制:let a = 0b10010; //0b 是二进制的标记

八进制：let b = 0o24 // 0o 是二进制的标记

 十六进制：let d = 0x;// 0x 是十六进制的标记

任意进制转换成十进制：parseInt('0x10',16)  //后面的参数对应前面的进制，0x代表16进制，后面参数就填写16

十进制转化成功任意的进制：let c= 20; c.toString(2)//把c转化成2进制

一般来说用两个字节表示一个汉字，第一个字节大于127的加上后面的一个组合而成ascii编码加上对汉字的扩展成了gb2312

utf-8其实是unicode的一种存储方式，和实现方式

18.buffer

buffer中存放的是8位一个字节的数组

```
//表示分配 一个长度为6个字节的Buffer
//会把所有的字节设置为0
//可以提供默认值buffer中的所有值都是2
let buf1 = Buffer.alloc(6,2);
//从文字中初始化一个字节
let buf3 = Buffer.from('珠峰');

//1填充的值 2 填充的开始索引 3 结束 索引
buf1.fill(3,1,3);// [0,3,3,0]


//1写的字符串 2填充的开始索引 3填充的字节长度 编码
buf1.write("珠峰",0,3,'utf8');

//合并buffer
let buf3 = Buffer.from('珠')
let buf4 = Buffer.from('峰')
let result = Buffer.concat([buf3,buf4])
console.log(result)


```

19.fs模块：

```
//创建目录
let fs =require('fs')
//创建的时候父目录一定要存在的例如 fs.mkdir('a/b')，这个时候a一定要存在
fs.mkdir("a",()=>{
})


注意utf-8前面有三个字节是不能要的，一般情况下是要过滤的
let fs =require('fs')
fs.readFile('1.txt',function(err,data){
   if(data[0]==oxef&&data[1]==oxbb&&data[2]==oxbf){
      data =data.slice(3)
   }

})
默认的情况下nodejs是不支持gbk的,可以通过iconv-lite的库来解决
let iconb = require('iconv-lite');
fs.readFile('2.txt',function(err,data){
    let str = iconv.decode(data,'gbk')
})

//读目录,判断是目录还是文件
let fs =require('fs');
let path = require('path')
fs.readdire("./a",function(err,files){
  console.log(files)
  files.forEach((file)=>{
    let child = path.join("a",file);//把路径拼起来
    fs.stat(child,(err,stat)=>{
       //stat.isDirecttory 有需要的信息
         
    })
  })
})

//删除文件，文件夹
let fs = require('fs')
//删除文件:fs.unlink
//删除文件夹 fs.rmdir


//同步删除目录以及目录下面的文件
function remove(dir){
   let files = fs.readdirSync(dir);
   files.forEach((item)=>{
        let child = fs.statSync(path.join(dir,item));
        if(child.isDirectory()){
           rmdirSync(path.join(dir,item))
        }else{
           fs.unlinkSync(path.join(dir,item))
        }
   });
   fs.rmdirSync(dir)
}
remove("a")


//异步删除目录以及下面的文件夹

function rmPromise(dir) {
    return new Promise((resolve,reject) => {
        fs.stat(dir,(err,stat) => {
            if (err) return reject(err);
            if (stat.isDirectory()) {
                fs.readdir(dir,(err,files) => {
                    let paths = files.map(file => path.join(dir,file));
                    let promises = paths.map(p=>rmPromise(p));
                    Promise.all(promises).then((() => fs.rmdir(dir,resolve)));
                });
            } else {
                fs.unlink(dir,resolve);
            }
        });
    });
}
rmPromise(path.join(__dirname,'a')).then(() => {
    console.log('删除成功');
})

//同步深度先序遍历目录
  console.log(dir);
  fs.readdirSync(dir).forEach(file=>{
      let child = path.join(dir,file);
      let stat = fs.statSync(child);
      if(stat.isDirectory()){
          deepSync(child);
      }else{
          console.log(child);
      }
  });
}

//异步深度先序遍历目录
function deep(dir,callback) {
  console.log(dir);
  fs.readdir(dir,(err,files)=>{
      !function next(index){
          if(index == files.length){
              return callback();
          }
          let child = path.join(dir,files[index]);
          fs.stat(child,(err,stat)=>{
              if(stat.isDirectory()){
                  deep(child,()=>next(index+1));
              }else{
                  console.log(child);
                  next(index+1);
              }
          })
      }(0)
  })
}


//连接两个目录
let path = require("path")
path.join('a','b')
//resolve从当前目录出发解析出一个绝对路径
//..代表上一级目录
//.代表当前目录
//字符串a代表当前目录下面的啊目录
path.resolve("..",".","a")

//获取文件名字
path.basename(__filename,'a.js')
//获取文件扩展名字
path.extname(__filename)

//监听文件的变化
let fs = require('fs');
fs.watchFile("a.txt",function(nexStat，preStat){
    if(Date.parse(preState.ctime==0)){
      //新增的文件
    }else if(Date.parse(preState.ctime)!=Date.parse(nexStat.ctime)){
       //修改文件了
    }else if(Date.parse(nexStat.ctime)==0){
      //删除文件了
    }

})


```

20.stream

  1.可读流

```
let fs =require('fs')

//options
//flags打开文件要做的操作,默认为'r'
//encoding默认为null
//start开始读取的索引位置
//end结束读取的索引位置(包括结束位置),包括结束符
//highWaterMark读取缓存区默认的大小64kb
let rs = fs.createReadStream('./1.txt',{highWaterMark:64})

rs.on('open',()=>{}) //顺序1
//一般是先读64k，触发data,highWaterMark为缓冲区大小默认64k
rs.on('data',functiion(data){
   rs.pause()//暂停读取和发射data事件
   setTimeout(()=>{
     rs.resume()//恢复读取和发射data
   },1000)
   

})//顺序2
rs.on('end',()=>{})//顺序3
rs.on('close',()=>{})//顺序4
rs.on('error',()=>{})
```

2.可写流

```
let fs = require('fs');

let ws = fs.createWriteStream('./1.txt',{
    flags:'w',
    mode:0o666,
    autoClose:true,
    highWaterMark:3, // 默认写是16k
    encoding:'utf8',
    start:0
});

// 写入的数据必须是字符串或者buffer
// flag代表是否能继续写
// 表示符表示的并不是是否写入 表示的是能否继续写，但是返回false 也不会丢失，就是会把内容放到内存中
let flag = ws.write("1")//true
let flag = ws.write("1")//true
let flag = ws.write("1")//false
let flag = ws.write("1")//false
```

21.stream2

```
1.
Readable - 可读的流 (例如 fs.createReadStream()).
Writable - 可写的流 (例如 fs.createWriteStream()).
Duplex - 可读写的流 (例如 net.Socket).
Transform - 在读写过程中可以修改和变换数据的 Duplex 流 (例如 zlib.createDeflate()).
2.流中的数据有两种模式
二进制模式, 每个分块都是buffer或者string对象.
对象模式, 流内部处理的是一系列普通对象
3.可读流有两种模式
可读流事实上工作在下面两种模式之一：flowing 和 paused
在 flowing 模式下， 可读流自动从系统底层读取数据，并通过 EventEmitter 接口的事件尽快将数据提供给应用。
在 paused 模式下，必须显式调用 stream.read() 方法来从流中读取数据片段。
所有初始工作模式为 paused 的 Readable 流，可以通过下面三种途径切换到 flowing 模式：
监听 'data' 事件
调用 stream.resume() 方法
调用 stream.pipe() 方法将数据发送到 Writable
可读流可以通过下面途径切换到 paused 模式：
如果不存在管道目标（pipe destination），可以通过调用 stream.pause() 方法实现。
如果存在管道目标，可以通过取消 'data' 事件监听，并调用 stream.unpipe() 方法移除所有管道目标来实现。
4.缓冲区
Writable 和 Readable 流都会将数据存储到内部的缓冲器（buffer）中。这些缓冲器可以 通过相应的 writable._writableState.getBuffer() 或 readable._readableState.buffer 来获取。

缓冲器的大小取决于传递给流构造函数的 highWaterMark 选项。 对于普通的流， highWaterMark 选项指定了总共的字节数。对于工作在对象模式的流， highWaterMark 指定了对象的总数。

当可读流的实现调用stream.push(chunk)方法时，数据被放到缓冲器中。如果流的消费者没有调用stream.read()方法， 这些数据会始终存在于内部队列中，直到被消费。

当内部可读缓冲器的大小达到 highWaterMark 指定的阈值时，流会暂停从底层资源读取数据，直到当前 缓冲器的数据被消费 (也就是说， 流会在内部停止调用 readable._read() 来填充可读缓冲器)。

可写流通过反复调用 writable.write(chunk) 方法将数据放到缓冲器。 当内部可写缓冲器的总大小小于 highWaterMark 指定的阈值时， 调用 writable.write() 将返回true。 一旦内部缓冲器的大小达到或超过 highWaterMark ，调用 writable.write() 将返回 false 。

stream API 的关键目标， 尤其对于 stream.pipe() 方法， 就是限制缓冲器数据大小，以达到可接受的程度。这样，对于读写速度不匹配的源头和目标，就不会超出可用的内存大小。

Duplex 和 Transform 都是可读写的。 在内部，它们都维护了 两个 相互独立的缓冲器用于读和写。 在维持了合理高效的数据流的同时，也使得对于读和写可以独立进行而互不影响。
5.可读流的三种状态

在任意时刻，任意可读流应确切处于下面三种状态之一：

readable._readableState.flowing = null
readable._readableState.flowing = false
readable._readableState.flowing = true

若 readable._readableState.flowing 为 null，由于不存在数据消费者，可读流将不会产生数据。 在这个状态下，监听 'data' 事件，调用 readable.pipe() 方法，或者调用 readable.resume() 方法， readable._readableState.flowing 的值将会变为 true 。这时，随着数据生成，可读流开始频繁触发事件。

调用 readable.pause() 方法， readable.unpipe() 方法， 或者接收 “背压”（back pressure）， 将导致 readable._readableState.flowing 值变为 false。 这将暂停事件流，但 不会 暂停数据生成。 在这种情况下，为 'data' 事件设置监听函数不会导致 readable._readableState.flowing 变为 true。

当 readable._readableState.flowing 值为 false 时， 数据可能堆积到流的内部缓存中

6.readable
let fs =require('fs');
let rs = fs.createReadStream('./1.txt',{
  start:3,
  end:8,
  encoding:'utf8',
  highWaterMark:3
});
rs.on('readable',function () {
  console.log('readable');
  console.log('rs._readableState.buffer.length',rs._readableState.length);
  let d = rs.read(1);
  console.log('rs._readableState.buffer.length',rs._readableState.length);
  console.log(d);
  setTimeout(()=>{
      console.log('rs._readableState.buffer.length',rs._readableState.length);
  },500)
});
注意highWaterMark为3，当调用 rs.read(1);读取一个的时候，rs会立即补充3个字节，所以settimeout出来的为rs._readableState.length为5


7.流的经典应用：行读取器：
let fs = require('fs');
let EventEmitter = require('events');
let util = require('util');
util.inherits(LineReader, EventEmitter)
fs.readFile('./1.txt',function (err,data) {
    console.log(data);
})
function LineReader(path) {
    EventEmitter.call(this);
    this._rs = fs.createReadStream(path);
    this.RETURN = 0x0D;// \r 13
    this.NEW_LINE = 0x0A;// \n 10
    this.on('newListener', function (type, listener) {
        if (type == 'newLine') {
            let buffer = [];
            //当read读取后少于缓存的时候，会重新触发readable，直到全部读完
            this._rs.on('readable', () => {
                let bytes;
                while (null != (bytes = this._rs.read(1))) {
                    let ch = bytes[0];
                    switch (ch) {
                        case this.RETURN:
                            this.emit('newLine', Buffer.from(buffer));
                            buffer.length = 0;
                            let nByte = this._rs.read(1);
                            if (nByte && nByte[0] != this.NEW_LINE) {
                                buffer.push(nByte[0]);
                            }
                            break;
                        case this.NEW_LINE:
                            this.emit('newLine', Buffer.from(buffer));
                            buffer.length = 0;
                            break;
                        default:
                            buffer.push(bytes[0]);
                            break;
                    }
                }
            });
            this._rs.on('end', () => {
                if (buffer.length > 0) {
                    this.emit('newLine', Buffer.from(buffer));
                    buffer.length = 0;
                    this.emit('end');
                }
            })
        }
    });
}
//读文件，一行一行地读取
var lineReader = new LineReader('./1.txt');
lineReader.on('newLine', function (data) {
    console.log(data.toString());
}).on('end', function () {
    console.log("end");
})


```

22.自定义可写流动



```
let EventEmitter = require('events');
let fs = require('fs');
class WriteStream extends EventEmitter{
    constructor(path,options){
        super();
        this.path = path;
        this.highWaterMark = options.highWaterMark||16*1024;
        this.autoClose = options.autoClose||true;
        this.mode = options.mode;
        this.start = options.start||0;
        this.flags = options.flags||'w';
        this.encoding = options.encoding || 'utf8';

        // 可写流 要有一个缓存区，当正在写入文件是，内容要写入到缓存区中
        // 在源码中是一个链表 => []

        this.buffers = [];

        // 标识 是否正在写入
        this.writing = false;

        // 是否满足触发drain事件
        this.needDrain = false;

        // 记录写入的位置
        this.pos = 0;

        // 记录缓存区的大小
        this.length = 0;
        this.open();
    }
    destroy(){
        if(typeof this.fd !=='number'){
            return this.emit('close');
        }
        fs.close(this.fd,()=>{
            this.emit('close')
        })
    }
    open(){
        fs.open(this.path,this.flags,this.mode,(err,fd)=>{
            if(err){
                this.emit('error',err);
                if(this.autoClose){
                    this.destroy();
                }
                return
            }
            this.fd = fd;
            this.emit('open');
        })
    }
    write(chunk,encoding=this.encoding,callback=()=>{}){
       //写文件一般是二进制的所以要转换
        chunk = Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk,encoding);
        // write 返回一个boolean类型 
        this.length+=chunk.length; 
        let ret = this.length<this.highWaterMark; // 比较是否达到了缓存区的大小
        this.needDrain = !ret; // 是否需要触发needDrain
        // 判断是否正在写入 如果是正在写入 就写入到缓存区中
        if(this.writing){
            this.buffers.push({
                encoding,
                chunk,
                callback
            }); // []
        }else{
            // 专门用来将内容 写入到文件内
            this.writing = true;
            this._write(chunk,encoding,()=>{
                callback();
                this.clearBuffer();
            }); // 8
        }
        return ret;
    }
    
    //排空缓存区，改变标志位writing =false
    clearBuffer(){
        let buffer = this.buffers.shift();
        if(buffer){
            this._write(buffer.chunk,buffer.encoding,()=>{
                buffer.callback();
                this.clearBuffer()
            });
        }else{
            this.writing = false;
            if(this.needDrain){ // 是否需要触发drain 需要就发射drain事件
                this.needDrain = false;
                this.emit('drain');
            }
        }
    }
    _write(chunk,encoding,callback){
        //等文件打开再去写
        if(typeof this.fd !== 'number'){
            return this.once('open',()=>this._write(chunk,encoding,callback));
        }
        fs.write(this.fd,chunk,0,chunk.length,this.pos,(err,byteWritten)=>{
            this.length -= byteWritten;
            this.pos += byteWritten;
            
            callback(); // 清空缓存区的内容
        });
    }
}

module.exports = WriteStream;



```

23.自定义读流

```
let fs = require('fs');
let EventEmitter = require('events');
function computeNewHighWaterMark(n) {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
     return n;
  }
class ReadStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.path = path;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.autoClose = options.autoClose || true;
        this.start = 0;
        this.end = options.end;
        this.flags = options.flags || 'r';

        this.buffers = []; // 缓存区 
        this.pos = this.start;
        this.length = 0; // 缓存区大小
        this.emittedReadable = false;
        this.reading = false; // 不是正在读取的
        this.open();
        this.on('newListener', (eventName) => {
            if (eventName === 'readable') {
                this.read();
            }
        })
    }
    read(n) { // 想取1个

        if(n>this.length){
            // 更改缓存区大小  读取五个就找 2的几次放最近的
            this.highWaterMark = computeNewHighWaterMark(n)
            this.emittedReadable = true;
            this._read();
        }


        // 如果n>0 去缓存区中取吧
        let buffer=null;
        let index = 0; // 维护buffer的索引的
        let flag = true;
        if (n > 0 && n <= this.length) { // 读的内容 缓存区中有这么多
            // 在缓存区中取 [[2,3],[4,5,6]]
            buffer = Buffer.alloc(n); // 这是要返回的buffer
            let buf;
            while (flag&&(buf = this.buffers.shift())) {
                for (let i = 0; i < buf.length; i++) {
                    buffer[index++] = buf[i];
                    if(index === n){ // 拷贝够了 不需要拷贝了
                        flag = false;
                        this.length -= n;
                        let bufferArr = buf.slice(i+1); // 取出留下的部分
                        // 如果有剩下的内容 在放入到缓存中
                        if(bufferArr.length > 0){
                            this.buffers.unshift(bufferArr);
                        }
                        break;
                    }
                }
            }
        }
        // 当前缓存区 小于highWaterMark时在去读取
        if (this.length == 0) {
            this.emittedReadable = true;
        }
        if (this.length < this.highWaterMark) {
            if(!this.reading){
                this.reading = true;
                this._read(); // 异步的
            }
        }
        return buffer
    }
    // 封装的读取的方法
    _read() {
        // 当文件打开后在去读取
        if (typeof this.fd !== 'number') {
            return this.once('open', () => this._read());
        }
        // 上来我要喝水 先倒三升水 []
        let buffer = Buffer.alloc(this.highWaterMark);
        fs.read(this.fd, buffer, 0, buffer.length, this.pos, (err, bytesRead) => {
            if (bytesRead > 0) {
                // 默认读取的内容放到缓存区中
                this.buffers.push(buffer.slice(0, bytesRead));
                this.pos += bytesRead; // 维护读取的索引
                this.length += bytesRead;// 维护缓存区的大小
                this.reading = false;
                // 是否需要触发readable事件
                if (this.emittedReadable) {
                    this.emittedReadable = false; // 下次默认不触发
                    this.emit('readable');
                }
            } else {
                this.emit('end');
                this.destroy();
            }
        })
    }
    destroy() {
        if (typeof this.fd !== 'number') {
            return this.emit('close')
        }
        fs.close(this.fd, () => {
            this.emit('close')
        })
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            if (err) {
                this.emit('error', err);
                if (this.autoClose) {
                    this.destroy();
                }
                return
            }
            this.fd = fd;
            this.emit('open');
        });
    }
}

module.exports = ReadStream;
```

# 四.tcp

1.为了让计算机能够通讯， 计算机需要定义通讯规则，这些规则就是协议，协议就是数据封装格式+传输

OSI模型把网络通信的工作分为7层，分别是物理层、数据链路层、网络层、传输层、会话层、表示层和应用层。 首先来看看OSI的七层模型



![image-20200607112608016](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200607112608016.png)





2.tcp/ip参考模型：参考了osi的七层协议



![image-20200607112823540](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200607112823540.png)

*TCP/IP协议被称为传输控制协议/互联网协议，又称网络通讯协议

*是由网络层的ip协议和传输层的tcp协议组成，是一个很大的协议集合

*物理层和数据链路层没有定义任何的特定协议，支持所有的标准和专用的协议

*网络层电仪了网络互联也就是ip协议

  1.网际协议ip负责主机和网络之间的寻址和路由数据包

  2.地址解析协议arp 获得同一物理网络中的硬件主机mac地址

  3.反向地址转换协议 通过mac地址找ip地址

  4.网际控制消息协议icmp，发送消息，并报告有关数据包的传送错误（ping地址）

  5.互联组管理协议igmp  ip主机向本地多路广播路由器报告主机成员

*传输层定义了tcp 和upd协议

*应用层定义了http，ftp，dns等协议

五层对应的协议：

![image-20200607160409426](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200607160409426.png)

双工，单工，半双攻

双工：服务器和客户端可以同时双向通讯

半双攻：服务器和客户端可以不同时双向通讯

单工：服务器和客户端只能单向通讯

## tcp/ip各层的介绍：

1.物理层

  计算机在传递数据的时候传递的都是0和1的数字，而物理层关心的是用什么信号来表示0和1，是否可以双向通信，最初的连接如何建立以及完成连接如何终止,物理层是为数据传输提供可靠的环境。

- 为数据端设备提供传送数据的通路

- 传输数据

  - 激活物理连接，在连接的设备之间连接起来形成通路
  - 传输数据,关心如何打包数据和控制传输速度
  - 关闭物理连接

  ![image-20200608055817834](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200608055817834.png)



2.数据链路层

数据链路层们于物理层和互联网层之间，用来向网络层提供数据，就是把源计算机网络层传过来的信息传递给目标主机。

- 如何将数据组合成数据帧(Frame)，帧是数据链路层的传输单位
- 数据链路的建立、维护和拆除
- 帧包装、帧传输、帧同步
- 帧的差错恢复
- 流量控制



注意：物理层可以简单的理解为运输过程中的道路，数据链路层可以理解为货车（数据需要拆分打包）



3.mac地址（全球唯一的）



- 在通信过程中是用内置在网卡内的地址来标识计算机身份的
- 每个网卡都有一个全球唯一的地址来标识自己，不会重复
- MAC地址48位的二进制组成，通常分为6段，用16进制表示

![image-20200608061501924](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200608061501924.png)

4.网络层

  位于传输层和数据链路层之间,用于把数据从源主机经过若干个中间节点传送到目标主机,并向传输层提供最基础的数据传输服务,它要提供路由和选址的工作（ip地址有层次结构的，对应地方地址的）

 4.1 选址

   交换机是靠MAC来寻址的，而因为MAC地址是无层次的,所以要靠IP地址来确认计算机的位置,这就是选址

![image-20200608065949948](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200608065949948.png)

![image-20200608070348139](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200608070348139.png)

ip地址就是省市区地址，申请上网的时候，电信服务商会给一个ip地址，姓名就是mac地址，先地位ip地址，再在局域网里面找mac地址

ip地址分为三类：

![image-20200609233621612](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200609233621612.png)

私有IP

- A类私有IP：10.0.0.0 ~ 10.255.255.255
- B类私有IP：172.16.0.0 ~ 172.31.255.255
- C类私有IP：192.168.0.0 ~ 192.168.255.255

其他范围的IP均为公有IP地址

![image-20200610000143224](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200610000143224.png)



局域网的ip地址和子网掩码 作运算（遇到1是原来的，遇到0就是0），如果得到的网络部分相同，就可以在局域网里面通信

4.2路由（选择最近的道路）

![image-20200611231334097](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200611231334097.png)

2发出请求，路由器寻址，找到理1最近的路由器，最近的路由器再找到ip，找到mac地址，再在两个mac地址之间通讯