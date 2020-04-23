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

```

20.stream

 