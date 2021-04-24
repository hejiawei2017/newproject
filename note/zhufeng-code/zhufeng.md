一.docker

1.体系结构

![image-20200527211635007](zhufeng.assets/image-20200527211635007.png)

![image-20200527212140424](zhufeng.assets/image-20200527212140424.png)

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

 "registry-mirrors":['https://mirror.ccs.tencentyun.com']

}



4.镜像与容器联系

容器其实是在镜像的最上面加了一层读写层，在运行容器里做的任何文件的改动，都会写到这个读写层，如果容器删除了，最上面的读写层也就删除了，改动也就丢失了



5.dokcer帮助命令：docker --help

![image-20200609062101290](zhufeng.assets/image-20200609062101290.png)

帮助子命令：：docker image --help



![image-20200609063905451](zhufeng.assets/image-20200609063905451.png)

docker一般命令

 1.查看所有的镜像：docker image ls

2.查看一个镜像的详情：docker image inspect nginx

3.远程拉取一个镜像docker image pull nginx:1.11

4.删除一个镜像：docker image rm nginx:1.12

5.给镜像打标签 ：docker tag  9bc90d9f01f3  jenken:test  //给镜像id9bc90d9f01f3，重新命名一个名字和tag

6.保存导入镜像：docker image save nginx:1.11 > nginx1.11.tar    docker load < nginx1.11.tar





6.docker 容器：

![image-20200611065025868](zhufeng.assets/image-20200611065025868.png)

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

![image-20200614111944443](zhufeng.assets/image-20200614111944443.png)



volumes：可以在主机中挂载数据到容器中

![image-20200614170821338](zhufeng.assets/image-20200614170821338.png)

1.docker volume ls //查看卷

2.docker volume create nginx-vol//创建

3.创建并且运行一个容器，在主机挂载数据卷nginx-vol 到容器的/usr/share/ngiux/html

   docker run -d -it --name=nginx-test --mount src=nginx-vol, dst=/usr/share/ngiux/html nginx

进入数据卷里面 cd /var/lib/docker/volumes/ngnix-vol/_data/    新建一个index.html，就可以用nginx访问了，多个网站的数据共享可以这么配置

4.停止容器，删除容器，删除数据卷

  docker container stop nginx-test

  dokcer container rm nginx-text

  docker volume rm nginx-vol





8.搭建lnmp网站平台

 1.创建自定义网络：

​    docker network create lnmp 

  2.创建mysql容器：



docker run -itd --name  lnmp_mysql  --net lnmp -p 3306:3306  --mount src=mysql-vol,dst=/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_c

 查看lnmp_mysql 进程和日志   

   docker top lnmp_mysql 
   docker logs lnmp_mysql 

  3.创建数据库



   docker exec  lnmp_mysql sh -c 'exec mysql -uroot  -p123456  -e"create database wp"'

  进入数据库： docker exec -it lnmp_mysql bash

​                          mysql -uroot -p   //密码123456



   执行命令show databases;  //注意分号

   修改登录密码：ALTER user 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456'; 

  在主机安装mysql ：yum install  mysql



4.创建php环境容器

 docker run -itd --name lump_web --net lnmp -p 88:80 --mount type=bind,src=/app/wwwroot,dst=/var/www/html richarvey/nginx-php-fpm



5.以wordpress博客为例测试

 wget https://cn.wordpress.org/wordpress-4.7.4-zh_CN.tar.gz

  tar zxf wordpress-4.7.4-zh_CN.tar.gz -C /app/wwwroot



 访问： http://106.52.141.232:88/wordpress/

![image-20200617231654396](zhufeng.assets/image-20200617231654396.png)





6.dockerfile

![image-20200619071958668](zhufeng.assets/image-20200619071958668.png)



![image-20200619072131121](zhufeng.assets/image-20200619072131121.png)





run 是执行shell命令的，加【】是另外开一个线程去执行，不加是当前的线程去执行，加【】能并行的去执行任务

cmd是镜像启动一个容器的最后一步去执行的，一般执行npm install 等命令

entrypoint 是镜像启动一个容器前执行，可以传参数给容器，一般执行/bin/bash 等命令

env从外包传入变量到容器里面

add 把镜像外的一个包拉倒镜像中

add  php-5.6.31.tar.gz /tmp/  把文件字段解压放到tmp中，同时有拷贝和解压的功能

copy和add基本一样，就是没有自动解压的功能

volume 挂载宿主机的目录到容器目录

workdir 切换到工作目录，默认exec进的是根目录，配合这个可以进指定目录





6.0，可以通过dokcerfile 构建基础的镜像，用镜像启动相应的容器：

6.1nginx dockerfle:

 <img src="zhufeng.assets/image-20200622070516024.png" alt="image-20200622070516024" style="zoom:150%;" />

![image-20200622070451551](zhufeng.assets/image-20200622070451551.png)



 构建镜像：docker image build -t nginx:v1 -f Dockerfile .   

  -t ：指定一个镜像名称    -f：指定一个dockerfile的名字   . : 当前的上下文环境



6.2.php 的dockerfile

![image-20200622070725126](zhufeng.assets/image-20200622070725126.png)



![image-20200622070753298](zhufeng.assets/image-20200622070753298.png)

![image-20200622070846550](zhufeng.assets/image-20200622070846550.png)

6.3.java的docker镜像：

![image-20200622231935692](zhufeng.assets/image-20200622231935692.png)



有了dockerfile之后就开始构建镜像了：

docker build -t  tomcat:v1 .



根据镜像启动容器



![image-20200622231952293](zhufeng.assets/image-20200622231952293.png)



7.镜像仓库

  //这种方法不推荐

 7.1 docker image save -o /data2/shenyaqi/syq-anaconda.tar anaconda//  将镜像anaconda保存到目录

  docker load -i /data2/shenyaqi/syq-anaconda.tar  //本地拉去镜像



7.2搭建私有的镜像创库

![image-20200623070518712](zhufeng.assets/image-20200623070518712.png)

1.从docker hub上面拉去镜像：  docker pull nginx:1.12

2.打标签：docker  tag nginx:1.1.2  192.168.0.211:5000/niginx:1.12

3.上传镜像：docker push 192.168.0.211:5000/nginx:1.12

可能会报错的。设置信任地址：

![image-20200623072609055](zhufeng.assets/image-20200623072609055.png)



4.现在可以在别的机器拉取了：

docker pull 192.168.0.211:5000/nginx:1.12 

或者

docker run -itd --name nginx -p 88:80  192.168.0.211:5000/nginx:1.2



8.docker hub 公共仓库的使用

![image-20200629060700471](zhufeng.assets/image-20200629060700471.png)



docker hub 帐号密码：hejiawei2020   as7683032389



8.1 创建仓库

![image-20200629061716868](zhufeng.assets/image-20200629061716868.png)8.2登录 docker login   输入用户名和密码

8.3打tag：docker tag nginx:v1   hejiawei2020/nignx:v1 //     把 nginx:v1 的镜像打tag为 hejiawei2020/nignx:v1 ，hejiawei2020是帐号

8.4上传镜像  docker push  hejiawei2020/nignx:v1

8.5拉取镜像     docker pull hejiawei2020/nignx:v1







9.企业级的私有镜像harbor

9.1安装：一般采用离线安装，因为在线安装很多包不能访问

 git地址：https://github.com/vmare/harbor

 下载地址：https://github.com/goharbor/harbor/releases，选择offline安装

  用winscp工具上传文件到服务器 

 进入服务器目录tar zxvf harbor-offline-installer-v1.5.0.tgz  解压压缩包

92.自签tls证书

 https://gitbub.com/vmware/harbor/blob/marter/doc/configure_https.md

  9.2.1  生成自签证书（不受信任的）： openssl req -newkey rsa:4096 -nodes -sha256 -keyout ca.key -x509 -days 365 -out ca.crt
  ![image-20200704204655124](zhufeng.assets/image-20200704204655124.png)

9.2.3  生成请求证书：  openssl req -newkey rsa:4096 -nodes -sha256 -keyout  reg.hejiawei2020.cn.key  -out reg.hejiawei.cn.csr

9.24 颁发证书：openssl x509 -req -days 365 -in reg.hejiawei.cn.csr -CA ca.crt  -CAkey ca.key -CAcreateserial -out reg.hejiawei.cn.crt



93.harbor配置

 进入harbor安装目录  vi harbor.cfg   

   修改主域名，修改密码，修改证书文字，保存提出

执行：./prepare // 生成配置文件和指定的证书

执行：./install.sh //安装

执行：docker-compose ps //查看容器的启动状态

没有经过dns域名解释所以行不通：https://reg.hejiawei.cn  通过host配置先做映射

进入目录编辑hosts文件，C:\Windows\System32\drivers\etc

可以创建项目和创建成员了，项目下有管理成员的选项





9.5  docker主机访问harbor



9.6发布到企业私有的配置

 9.6.1 先登录  docker login reg.hejiawei.cn

​     输入用户名和密码（之前这harbor创建的用户）

​    之后打tag，然后push，然后pull，注意都要加reg.hejiawei.cn

10. 使用kubeadm快速部署一个K8S集群![image-20200713232305808](zhufeng.assets/image-20200713232305808.png)

    10.1 在每台机器上面安装doker

    ![image-20200715233637456](zhufeng.assets/image-20200715233637456.png)

 



​    ![image-20200715234323016](zhufeng.assets/image-20200715234323016.png)

![image-20200715234535294](zhufeng.assets/image-20200715234535294.png)

![image-20200716002709090](zhufeng.assets/image-20200716002709090.png)

第五部在主机上执行，其他都在各个机器要执行

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

![image-20200321221026276](zhufeng.assets/image-20200321221026276.png)

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

![image-20200322215608442](zhufeng.assets/image-20200322215608442.png)

等号是分割线，最后只留下需要的代码 color：red，修改好之后 执行 git add . 再执行

git commit -m 'msg'



6.提交到github，代码必须要推送到历史区，才能推送到github,并且不会上传空文件夹

  1.touch readme.md

  2.不想提交的文件列表.gitignore

​     ![image-20200322221743379](zhufeng.assets/image-20200322221743379.png)

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



![image-20200328183403863](zhufeng.assets/image-20200328183403863.png)

  5.为什么js是单线程的呢？

​        这个是由js这门脚本语言决定的，如果是多线程就很难避免dom操作的冲突，而且多线程之间的通讯也是个问题，浏览器里面ui线程和js线程是公用一个线程，webworder虽然说是多线程，但是他是完成受主线程的控制的，并且是不能操作dom的，并不有完全的线程能力

​    除了ui+js线程还有1.事件触发线程 2.定时器线程 3.异步请求线程

  6.event loop

​     在主要ui+js线程外面，遇到事件，定时器，异步请求，这些会独立开一个新的线程，这些线程任务执行完毕会把回调函数会放到一个回调队列里面，当主线程的同步代码执行完毕以后，event loop 会遍历回调队列，按照先进先出的顺序执行回调，每次执行完主线程的代码，都会通过event loop检查回调队列，执行回调，process.nextTick()是把代码放到当前同步代码的后面（注意和宏任务和微任务的区别）,stack队列后面还有一个taskqueue队列，主要用于放置微任务（想异步执行，又想尽快执行），先于callback queue执行

   

  ![image-20200328205745324](zhufeng.assets/image-20200328205745324.png)



  7.同步异步的区别：同步是可以立刻等到返回结果的，异步是不能立刻等到返回结果的，要通过回调函数通知返回的结果

8.阻塞和非阻塞

  阻塞调用是指调用结果返回之前，当前的线程会被挂起，调用线程只有在得到结果之后才会返回

 非阻塞调用是指不能立刻得到结果之前，该调用不会阻塞当前的线程

  注意：同步是被调用决定的，就是什么时候返回由被调用者决定，立即返回就同步，过后返回就是异步，阻塞是调用者决定的，调用者这时同时去做其他事情就变成非阻塞了，等待就是阻塞了

9.repl：在cmd下面输入node进入repl环境，就是nodejs的执行环境

![image-20200329170127799](zhufeng.assets/image-20200329170127799.png)

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

​    ![image-20200329210043378](zhufeng.assets/image-20200329210043378.png)

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



![image-20200607112608016](zhufeng.assets/image-20200607112608016.png)





2.tcp/ip参考模型：参考了osi的七层协议



![image-20200607112823540](zhufeng.assets/image-20200607112823540.png)

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

![image-20200607160409426](zhufeng.assets/image-20200607160409426.png)

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

  ![image-20200608055817834](zhufeng.assets/image-20200608055817834.png)



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

![image-20200608061501924](zhufeng.assets/image-20200608061501924.png)

4.网络层

  位于传输层和数据链路层之间,用于把数据从源主机经过若干个中间节点传送到目标主机,并向传输层提供最基础的数据传输服务,它要提供路由和选址的工作（ip地址有层次结构的，对应地方地址的）

 4.1 选址

   交换机是靠MAC来寻址的，而因为MAC地址是无层次的,所以要靠IP地址来确认计算机的位置,这就是选址

![image-20200608065949948](zhufeng.assets/image-20200608065949948.png)

![image-20200608070348139](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200608070348139.png)

ip地址就是省市区地址，申请上网的时候，电信服务商会给一个ip地址，姓名就是mac地址，先地位ip地址，再在局域网里面找mac地址

ip地址分为三类：

![image-20200609233621612](zhufeng.assets/image-20200609233621612.png)

私有IP

- A类私有IP：10.0.0.0 ~ 10.255.255.255
- B类私有IP：172.16.0.0 ~ 172.31.255.255
- C类私有IP：192.168.0.0 ~ 192.168.255.255

其他范围的IP均为公有IP地址

![image-20200610000143224](zhufeng.assets/image-20200610000143224.png)



局域网的ip地址和子网掩码 作运算（遇到1是原来的，遇到0就是0），如果得到的网络部分相同，就可以在局域网里面通信

4.2路由（选择最近的道路）

![image-20200611231334097](zhufeng.assets/image-20200611231334097.png)

2发出请求，路由器寻址，找到理1最近的路由器，最近的路由器再找到ip，找到mac地址，再在两个mac地址之间通讯





5.网络层

   网络层的目的是实现两个[端系统](https://baike.baidu.com/item/端系统)之间的数据透明传送，具体功能包括[寻址](https://baike.baidu.com/item/寻址)和[路由选择](https://baike.baidu.com/item/路由选择)、连接的建    立、保持和终止等。它提供的服务使[传输层](https://baike.baidu.com/item/传输层)不需要了解网络中的数据传输和[交换技术](https://baike.baidu.com/item/交换技术)。



5.1传输层

![image-20200618071649293](zhufeng.assets/image-20200618071649293.png)







5.2传输层级协议分类

- TCP(Transimision Control Protocal)

  - 传输控制协议
  - 可靠的、面向连接的协议
  - 传输效率低

- UDP(User Datagram Protocal)

  - 用户数据报协议

  - 不可靠的、无连接的服务

  - 传输效率高

    

5.3TCP功能

- 将数据进行分段打包传输

- 对每个数据包编号控制顺序

- 运输中丢失、重发和丢弃处理

- 流量控制避免拥塞

  

5.4TCP数据包封装



![image-20200618072117548](zhufeng.assets/image-20200618072117548.png)

5.4.1源端口号和目标端口号，计算机通过端口号识别访问哪个服务,比如http服务或ftp服务，发送方端口号是进行随机端口，目标端口号决定了接收方哪个程序来接收

5.4.2 32位序列号 TCP用序列号对数据包进行标记，以便在到达目的地后重新重装，假设当前的序列号为 s，发送数据长度为 l，则下次发送数据时的序列号为 s + l。在建立连接时通常由计算机生成一个随机数作为序列号的初始值

5.4.3 确认应答号 它等于下一次应该接收到的数据的序列号。假设发送端的序列号为 s，发送数据的长度为 l，那么接收端返回的确认应答号也是 s + l。发送端接收到这个确认应答后，可以认为这个位置以前所有的数据都已被正常接收(ack)

5.4.4 首部长度：TCP 首部的长度，单位为 4 字节。如果没有可选字段，那么这里的值就是 5。表示 TCP 首部的长度为 20 字节(每行2字节，32位)

5.4. 5 SYN(synchronous建立联机) 同步序号位 TCP建立连接时要将这个值设为1

5.4. 6 ACK(acknowledgement 确认)为1表示确认号

5.4.7 FIN发送端完成位，提出断开连接的一方把FIN置为1表示要断开连接 

###### 三次握手

- 第一次握手主机A通过一个标识为SYN标识位的数据段发送给主机B请求连接，通过该数据段告诉主机B希望建立连接，需要B应答，并告诉主机B传输的起始序列号

- 第二次握手是主机B用一个确认应答ACK和同步序列号SYNC标志位的数据段来响应主机A，一是发送ACK告诉主机A收到了数据段，二是通知主机A从哪个序列号做标记。

- 第三次握手是主机A确认收到了主机B的数据段并可以开始传输实际数据。

- ![image-20200621080257365](zhufeng.assets/image-20200621080257365.png)

  简单来说：

  1客户端第一次请求，发送一个seq=x，和ack确认位到服务器，

  2服务器接受到请求发送一个确认位置ack=x+1,标识x+1以上的位置都收到了，下次客户端seq从 x+1开始发把，同时发送一个服务端的seq位置，客户端下次发送的的ack=seq+1

  3.客户端发送seq=x+1，ack=服务端seq+1

###### 四次断开

- 主机A发送FIN控制位发出断开连接的请求
- 主机B进行响应，确认收到断开连接请求
- 主机B提出反方向的关闭要求
- 主机A确认收到的主机B的关闭连接请求
- ![image-20200621080308478](zhufeng.assets/image-20200621080308478.png)



![image-20200629071634387](zhufeng.assets/image-20200629071634387.png)

断开为什么是4次的呢

因为服务端收到客户端的断开请求，先给客户端通知收到，因为要处理数据，并不能马上断开，就先发一个消息通知到客户端，等数据处理完成之后，再发一个处理完成之后的一个消息

5.5.udp是一个不可靠的五连接的传输层的协议。也就是不关心到没有到目标主机



![image-20200806232441317](zhufeng.assets/image-20200806232441317.png)

一般用于qq，视频软件中

###### dns服务器的作用是根据域名找ip，找到ip返回给本机再连接主机

6.应用层常用的协议

 http ftp  smtp(发邮件) pop3(收邮件)

6.1数据封装过程

![image-20200807000308715](zhufeng.assets/image-20200807000308715.png)



6.2 nodejs 创建 tcp server

```javascript
// node 为了实现tcp 提供了一个模块 模块叫net模块
// 和http用法一致

let net = require('net');
// 创建一个tcp服务 里面放的是回调函数 监听函数，当连接到来时才会执行
// socket 套接字 是一个duplex 可以支持读操作和写操作
let server = net.createServer(function(socket){
    // 最大连接数2个
    // 希望每次请求到来时都一个提示 当前连接了多少个 一共连接多少个
    server.maxConnections = 2;
    server.getConnections(function(err,count){
        // socket每次连接时都会产生一个新的socket
        socket.write(`当前最大容纳${server.maxConnections},现在${count}人`)
    });
    socket.setEncoding('utf8');
    socket.on('data',function(data){
        console.log(data);
        // socket.end(); // 触发客户端的关闭事件
        // close事件表示服务端不在接收新的请求了，当前的还能继续使用，当客户端全部关闭后会执行close事件
        // server.close();
        // 如果所有客户端都关闭了，服务端就关闭，如果有人进来仍然可以
        server.unref();
    });
    socket.on('end',function(){
        console.log('客户端关闭');
    });
    // 请求到来时会触发这个函数
    // socket时一个可读可写
});
// backlog默认511
let port = 8080;
// 如果端口号被占用了怎么办
server.listen(port,'localhost',function(){
    console.log(`server start ${port}`)
});
// 当服务端发生错误时，close事件只有调用close方法才会触发
server.on('close',function(){
    console.log('服务端关闭');
})
server.on('error',function(err){
    if(err.code === 'EADDRINUSE'){
        server.listen(++port)
    }
});

socket.on('end') // 服务器收到客户端关闭的请求的时候会触发这个end事件
socket.on('close') // 服务器真正关闭的时候会触发这个事件，先end 后close

//server.close() //调用以后新的连接就连不上去了，但是以前的连接还是有效的
//server.unref(); //如果所有客户端都关闭了，服务端就关闭，如果有人进来仍然可以
```

6.3. 创建net服务器，通过客户端连接telnet  localhost 8080 到服务器输入文字，服务器写入文件

```
let net = require("net");
let path = require("path");
let ws = require("fs").createWriteStream(path.join(__dirname, "msg.txt"));
let server = net.createServer(function (socket) {
  //先暂停
  socket.pause();
  socket.setTimeout(3 * 1000);
  //3秒后再重新写入
  socket.on("timeout", function () {
    //通过socket.pipe，灌入写流，end: false代表写完后不关闭
    socket.pipe(ws, { end: false });
  });
});
server.listen(8080);
//node net.js 启动

```

6.4用nodejs实现客户端和服务器通讯

```
//client.js
let net = require("net");
let socket = new net.Socket();
socket.connect(8080, "localhost", function () {
  //连接后向服务器写数据
  socket.write("hello");
});
//防止乱码
socket.setEncoding("utf8");
//接受服务器过来的数据
socket.on("data", function (data) {
  console.log(data);
});



//server.js
let net = require("net");
let server = net.createServer((socker) => {
  socker.setEncoding("utf8");
  //接受客户端的数据
  socker.on("data", function (data) {
    socker.write("服务器回应：" + data);
  });
  socker.on("end", function () {});
  socker.on("close", function () {});
});
server.listen(8080, function () {
  console.log("listen in 8080");
});

```

6.5用nodejs实现聊天室

```
let net = require('net');
// 当客户端连接服务端时 会触发回调函数 默认提示 输入用户名,就可以通信了
// 自己的说的话 不应该通知自己 应该通知别人
let clients = {};
function broadcast(nickname,chunk){
    Object.keys(clients).forEach(key=>{
        if(key!=nickname){
            clients[key].write(`${nickname}:${chunk} \r\n`);
        }
    })
}
let server = net.createServer(function(socket){
    server.maxConnections = 3;
    server.getConnections((err,count)=>{
        socket.write(`欢迎来到聊天室 当前用户数${count}个,请输入用户名\r\n`);
    });
    let nickname;
    socket.setEncoding('utf8'); 
  
    socket.on('data',function(chunk){
        chunk = chunk.replace(/\r\n/,'')
        if(nickname){
            // 发言 broadcast
            broadcast(nickname,chunk);
        }else{
            nickname = chunk;
            clients[nickname] = socket;
            socket.write(`您的新用户名是${nickname} \r\n`);
        }
    });
     socket.on('end',function(){
        clients[nickname] &&clients[nickname].destroy();
        delete clients[nickname]; // 删除用户
    });
});

server.listen(8080);
```

6.6.udp服务器广播实现



```
1.服务器
let dgram = require('dgram');
let server = dgram.createSocket('udp4);
server.on('message',function(msg){
  let buf = new Bufffer('已经接收客户端发送的数据'+msg);
  server.setBroadcast(true);
  //向所有的广播
  server.send(buf,0,buf.length,41235,"192.168.1.255");
});
server.bind(41234,'192.168.1.100');

2.客户端
let dgram = require('dgram');
let client = dgram.createSocket('udp4);
client.bind(41235,'192.168.1.102);
let buf = new Buffer('hello');
client.send(buf,0,buf.length,41234,'192.168.1.100');
client.on('message',function(msg,rinfo){
  console.log('received : ',msg);
});
```

  8.0  udp组播

```
1.服务器
let dgram = require('dgram');
let server = dgram.createSocket('udp4');
server.on('listening',function(){
  server.MulticastTTL(128);
  server.setMulticastLoopback(true);
  server.addMembership('230.185.192.108');
});
setInterval(broadcast,1000);
function broadcast(){
  let buffer = Buffer.from(new Date().toLocaleString());
  server.send(buffer,0,buffer.length,8080,"230.185.192.108");//向主机广播
}

2.客户端
let dgram = require('dgram');
let client = dgram.createSocket('udp4');
client.on('listening',function(){
    client.addMembership('230.185.192.108');//加入组
});
client.on('message',function(message,remote){
  console.log(message.toString());
});
client.bind(8080,'192.168.1.103');





```



7.http请求的过程

  ![image-20200817233137945](zhufeng.assets/image-20200817233137945.png)

7.2.http**长连接**

  http.10以前的请求只能一个一个来，开销非常的大

   ![image-20200817233232501](zhufeng.assets/image-20200817233232501.png)

如果一个连接不断开的情况下就可以连续发送图片和资源了

![image-20200817233338276](zhufeng.assets/image-20200817233338276.png)

上面的这中情况其实还是不够因为每次发送一个才能再次发送

**管线化技术**：可以不用等待同时发送多个，注意每个浏览器支持的并发数是不固定的

![image-20200817233942067](zhufeng.assets/image-20200817233942067.png)

7.3url格式

![image-20200817234340592](zhufeng.assets/image-20200817234340592.png)

7.4http请求一般分为一下部分

  1.通用首部：请求和响应都有的字段

  2.请求首部：描述请求的情况的

  3.响应首部：描述响应首部

  4.实体首部：描述主体数据的类型长度等等信息的，一般以content开头的

以上4种类型既可以在请求报文上，也可以在响应报文上面

75.gzip，HTTP请求默认开启了gzip压缩，在服务器端先压缩，在网络中传输，然后在客户端解压

76.分割发送的分块传输编码，当文件比较大的时候可以通过分块传输，部分先显示的策略更快的显示界面

![image-20200818065738195](zhufeng.assets/image-20200818065738195.png)

7.7form表单上传

####  multiparty/form-data

![image-20200818070511515](zhufeng.assets/image-20200818070511515.png)

7.8内容协商

![image-20200818071606010](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200818071606010.png)

7.9创建http服务器

```
let http = require('http'); 
// 核心模块

// let server = http.createServer(function(req,res){

// });
// http是基于tcp的

// POST / HTTP/1.1
// > Host: www.baidu.com
// > User-Agent: curl/7.46.0
// > Accept: */*
// > Content-Length: 11
// > Content-Type: application/x-www-form-urlencoded

let server = http.createServer();
// curl 可以帮我们发http请求
// req是请求 是一个可读流 = socket
// res是响应 是一个可写流
server.on('request',function(req,res){
    let method = req.method;
    let httpVersion  = req.httpVersion;
    let url = req.url;
    let headers = req.headers; // 请求头的名字都是小写的
    console.log(method,httpVersion,url,headers);
    // 如果数据 大于64k data事件可能会触发多次
    let buffers = [];
    // 如果没有请求体 不会走on('data'),没有请求体也会触发end事件
    req.on('data',function(data){
        console.log(1)
        buffers.push(data);
    });

    req.on('end',function(){
        console.log(Buffer.concat(buffers).toString());
        // socket.write socket.end
        res.write('hello');
        res.end('world');
    });
});
// 监听请求的到来
server.on('connection',function(socket){
    console.log('建立连接');
});
server.on('close',function(){
    console.log('服务端关闭')
})
server.on('error',function(err){
    console.log(err);
});


server.listen(8080);
```

客户端可以通过git push的curl -v -data ‘name=hejiawei’ -x POST http://localhost:8008  模拟发送请求



8.0 nodejs的url模块



```
let url = require("url");
let str = "http://usr:pwd@localhost:8080/user?id=5#top";
//如果第二个参数为true，那么query就是一个对象了
let userObj = url.parse(str, true);
console.log(userObj);
console.log(url.format(userObj));
```

  ![image-20200822224445147](zhufeng.assets/image-20200822224445147.png)

8.1 服务器设置响应体



```
let http = reqiure('http')
let server = http.createServer(function(req,res){
   res.status = 200;//设置状态
   res.sendDate =false//设置日期
   res.setHeader("Content-Type","text/html;charset=utf8")//设置响应头、
   res.writeHead(200,{"Conten-Type":'text/html;charset=utf8'})
   //注意setheader和writeHead的区别，当调用writeHeader的时候会立刻调用响应头，而setheader是到第一次调用write的时候才会开始发送
   res.write('hello')//多次写入
   res.write('word')
   res.end()//发送流
});

//三次握手会触发这个，而require是长链接中都，每次请求都会触发的
server.on("connection",function(socker){
    

})

serer.listen(8080)




```

8.2.http和tcp的关系

 一般来说http是继承至tcp的，http只是tcp的一种固定文本格式，http中的req和res其实是解析至socker.on("data"),的data的值，先解析出req，通过req创建res

8.3.  通过tcp 写出http服务器

```js
let net = require("net");
let { StringDecoder } = require("string_decoder");
let { Readable } = require("stream");
class IncomingMessage extends Readable {
  _read() {}
}
function parser(socket, callback) {
  let buffers = []; // 每次读取的数据放到数组中
  let sd = new StringDecoder();
  let im = new IncomingMessage();
  function fn() {
    let res = {
      write: socket.write.bind(socket),
      end: socket.end.bind(socket),
    };
    let content = socket.read(); // 默认将请缓存区内容读干，读完后如果还有会触发readable事件
    buffers.push(content);
    let str = sd.write(Buffer.concat(buffers));
    if (str.match(/\r\n\r\n/)) {
      let result = str.split("\r\n\r\n");
      let head = parserHeader(result[0]);
      // im = {...im,...head}
      Object.assign(im, head);
      socket.removeListener("readable", fn); // 移除监听
      socket.unshift(Buffer.from(result[1])); // 将内容塞回流中
      if (result[1]) {
        // 有请求体
        socket.on("data", function (data) {
          im.push(data);
          im.push(null);
          callback(im, res);
        });
      } else {
        // 没请求体
        im.push(null);
        callback(im, res);
      }
      //callback(socket);
      // 先默认socket 是req对象 （内部又封装了一个可读流 IncomingMessage）
    }
  }
  socket.on("readable", fn);
}
function parserHeader(head) {
  let lines = head.split(/\r\n/);
  let start = lines.shift();
  let method = start.split(" ")[0];
  let url = start.split(" ")[1];
  let httpVersion = start.split(" ")[2].split("/")[1];
  let headers = {};
  lines.forEach((line) => {
    let row = line.split(": ");
    headers[row[0]] = row[1];
  });
  return { url, method, httpVersion, headers };
}
let server = net.createServer(function (socket) {
  parser(socket, function (req, res) {
    server.emit("request", req, res);
  });
});
server.on("request", function (req, res) {
  console.log(req.url);
  console.log(req.headers);
  console.log(req.httpVersion);
  console.log(req.method);

  req.on("data", function (data) {
    console.log("ok", data.toString());
  });
  req.on("end", function () {
    res.end(`
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 5

hello`);
  });
});
server.on("connection", function () {
  console.log("建立连接");
});
server.listen(3000);

```

8.4 通过node 模拟浏览器发送接口

```
let http = require('http');
// node可以做爬虫
let options = {
    hostname:'localhost',
    port:4000,
    path: '/',
    method:'get',
    // 告诉服务端我当前要给你发什么样的数据
    headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length':15
    }
}
let req = http.request(options);
// 前后端通信 靠的都是json字符串
req.on('response',function(res){
    res.on('data',function(chunk){
        console.log(chunk);
    });
});
req.end('name=zfpx&&age=9');
```



8.5 静态文件服务器   26-44

```js
let http = require("http");
let path = require("path");
let url = require("url");
let fs = require("fs");
let { promisify } = require("util");
let mime = require("mime");
let zlib = require("zlib");
//把一个异步的方法转换成一个promise方法
let stat = promisify(fs.stat);
//客户端发起请求的时候，会通过accept-encoding 告诉服务器我支持的解压格式
// 例如：accept-encodinh:gzip,deflate
http
  .createServer(async function (req, res) {
    let { pathname } = url.parse(req.url);
    if (pathname == "favicon.ico") {
      return;
    }
    let filepath = path.join(__dirname, pathname);
    try {
      let statObj = await stat(filepath);
      //根据文件名返回不同的content-type，设置响应头
      res.setHeader("Content-Type", mime.getType(pathname));
      //accept-encoding小写是为了兼容不同的浏览器
      let acceptEncodeing = req.headers["accept-encoding"];
      //内容压缩协商
      if (acceptEncodeing) {
        if (acceptEncodeing.match(/\bgzip\b/)) {
          res.setHeader("Content-Encoding", "gzip");
          fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res);
        } else if (acceptEncodeing.match(/\bdeflate\b/)) {
          res.setHeader("Content-Encoding", "deflat");
          fs.createReadStream(filepath).pipe(zlib.createDeflate()).pipe(res);
        } else {
          fs.createReadStream(filepath).pipe(res);
        }
      } else {
        fs.createReadStream(filepath).pipe(res);
      }
    } catch (e) {
      res.statueCode = 404;
      res.end();
    }
  })
  .listen(8081, function () {
    console.log("success");
  });






```

8.5 gzip 使用方法

let zlib = require('zilb')

let str = 'hello';

zlib.gzip(str,(err,buffer)=>{ //加压

​     zlib.unzip(buffer,(err,data)=>{ //解压

​        console.log(data.toString())

  })

})

8.5 取文件路径 中的文件名称和文件后缀

```
let path = require("path");
let str = "a/b/c/a.jpg";
//去连接中和文件名称，并且去掉后缀
console.log(path.basename(str, ".jpg"));
//取得后缀名称
console.log(path.extname(str));

```

8.6 node中的sha1加密

```
let crypto = require("crypto"); //加密库
let sha1 = crypto.createHash("sha1");//创建加密方法
sha1.update("hello");//指定加密值
sha1.update("world");
console.log(sha1.digest("hex"));//输出加密值

```



8.7 nodejs中的加盐，加密两端都同时加一个盐（私钥）就可以防止破解

```
let crypto = require('crypto');
let fs = require('fs');
let path = require('path');
let key = fs.readFileSync(path.join(__dirname,'./rsa_private.key')
let m = crypto.createHmac('sha1',key));
m.update('ok');
console.log(m.digest('hex'));

//生成秘钥，下载OpenSSL windows版本 
//输入：genrsa -out rsa_private.key 1024
```

8.8.nodejs 对称加密算法

```
// 对称加密  用一把要是可以 加密也可以解密
let crypto = require('crypto');
let path = require('path');
let fs = require('fs')
let name = 'zfpx';
let private = fs.readFileSync(path.join(__dirname,'./rsa_private.key'))
let m = crypto.createCipher('blowfish',private);
m.update(name,'utf8');
let result = m.final('hex');
console.log(result)
// 解密
let r = crypto.createDecipher('blowfish',private);
r.update(result,'hex');
console.log(r.final('utf8'));
//缺点，在网络传输和时候第一次没有办法传秘钥给解密方
```

8.9 在cmd上面执行命令，并且传递参数

```
1、建立一个bat 后缀的文件hello.bat
在里面写node hello.js %1 %2  //百分号代表的是可以传递的参数

2.在hello.js中 ，读取node hello.js 后面的参数
let yargs = require('yargs')
yargs.options('n',{
  alias:'name'//别名
  demand:true//必填
  default:'hejiawei',//默认值
  description:'描述'
})


console.log(yargs.argv)

3.在cmd中 输入hello --name hejiawei
就会输出 {name:hejiawei}






```

![image-20200910235651925](zhufeng.assets/image-20200910235651925.png)

输入--help





9.0在node中输出彩色文字：

```
let chalk = require('chalk');
console.log(chalk.green('hello'))
```

9.1.node中输出debug

```
let debug = require('debug')('static:app')
debug("error msg")

在cmd的命令中输出set DEBUG='static:app'
就会输出设置了static:app的debug的信息
注意mac 和 linux 下面设置环境变量是： export DEBUG=static:*
实际的上在nodejs是可以读取和设置环境变量的值的
console.log(process.env)
process.env.DUBUG = "static:*"

```

9.2 npm 软连接配置方式。简单的脚手架实现

```
1.在packjson里面配置bin

  "bin": {
    "zf-server2": "bin/www"
  }
 在cmd中运行：npm link
 成功之后就可以全局运行命令zf-server2
 运行命令会执行：bin/www：
 // -d --root 静态文件目录  -o --host 主机 -p --port 端口号
let yargs = require('yargs');
let Server = require('../src/app.js');
let argv = yargs.option('d', {
    alias: 'root',
    demand: 'false',
    type: 'string',
    default: process.cwd(),
    description: '静态文件根目录'
}).option('o', {
    alias: 'host',
    demand: 'false',
    default: 'localhost',
    type: 'string',
    description: '请配置监听的主机'
}).option('p', {
    alias: 'port',
    demand: 'false',
    type: 'number',
    default: 8080,
    description: '请配置端口号'
})
    .usage('zf-server2 [options]')
    .example(
    'zf-server2 -d / -p 9090 -o localhost', '在本机的9090端口上监听客户端的请求'
    ).help('h').argv;

// argv = {d,root,o,host,p,port}
let server = new Server(argv);
server.start();

//通过这个文件构建argv 参数传入server中


//服务器代码：
//要创建一个服务器
let config = require('./config');
let http = require('http');
let chalk = require('chalk');
let path = require('path');
let url = require('url');
let fs = require('fs');
let handlebars = require('handlebars');
let { promisify, inspect } = require('util');
let mime = require('mime');
let stat = promisify(fs.stat);
let readdir = promisify(fs.readdir);
//编译模板，得到一个渲染的方法,然后传入实际数据数据就可以得到渲染后的HTML了
function list() {
    let tmpl = fs.readFileSync(path.resolve(__dirname, 'template', 'list.html'), 'utf8');
    return handlebars.compile(tmpl);
}
//在代码内部是可以读到环境变量的值，当然也可以写入环境变量的值
//console.log(process.env);
//process.env.DEBUG = 'static:*';
//console.log(process.env);
//这是一个在控制台输出的模块,名称有特点有二部分组成，第一部分一般是项目名，第二模分是模块名
//每个debug实例都有一个名字，是否在控制台打印取决于环境变量中DEBUG的值是否等于static:app
let debug = require('debug')('static:app');
class Server {
    constructor(argv) {
        this.list = list();
        this.config = Object.assign({}, this.config, argv);
    }
    start() {
        let server = http.createServer();
        server.on('request', this.request.bind(this));
        server.listen(this.config.port, () => {
            let url = `http://${this.config.host}:${this.config.port}`;
            debug(`server started at ${chalk.green(url)}`);
        });
    }
    //静态文件服务器
    async request(req, res) {
        ///先取到客户端想说的文件或文件夹路径 
        // /images     my.jpg home
        let { pathname } = url.parse(req.url);
        if (pathname == '/favicon.ico') {
            return this.sendError(req, res);
        }
        let filepath = path.join(this.config.root, pathname);
        try {
            let statObj = await stat(filepath);
            if (statObj.isDirectory()) {//如果是目录的话，应该显示目录 下面的文件列表
                let files = await readdir(filepath);
                files = files.map(file => ({
                    name: file,
                    url: path.join(pathname, file)
                }));
                let html = this.list({
                    title: pathname,
                    files
                });
                res.setHeader('Content-Type', 'text/html');
                res.end(html);
            } else {
                this.sendFile(req, res, filepath, statObj);
            }
        } catch (e) {
            debug(inspect(e));//inspect把一个对象转成字符
            this.sendError(req, res);
        }
    }
    sendFile(req, res, filepath, statObj) {
        res.setHeader('Content-Type', mime.getType(filepath));// .jpg
        fs.createReadStream(filepath).pipe(res);
    }
    sendError(req, res) {
        res.statusCode = 500;
        res.end(`there is something wrong in the server! please try later!`);
    }
}
//let server = new Server();
//server.start();//启动服务
//npm i supervisor -g

module.exports = Server;

//config.js

let debug = require('debug')('static:config');
let path = require('path');
let config = {
    host: 'localhost',//监听的主机
    port: 8080,//监听的端口号
    root: path.resolve(__dirname, '..', 'public')//配置静态文件根目录
}
debug(config);
module.exports = config;

//template/list.html  文件
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
</head>
let data = {title:'zfpx',files:[{name:'1',url:'/1'}]};

<body>
    <ul>
        {{#each files}}
        <li>
            <a href={{url}}>{{name}}</a>
        </li>
        {{/each}}
    </ul>
</body>

</html>


 
 
 

```

9.3  用nodejs实现的对比环境机制（Last-Modified）：

```
let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let server = http.createServer(function (req, res) {
    let { pathname } = url.parse(req.url);
    let p = path.join(__dirname, 'public', '.' + pathname);
    fs.stat(p, function (err, stat) {
        // 第一次你来的时候给你一个表示 下次你在来的时候会带上这个表示
        // 这次你来的时候我用我的标识和你比如果有区别就返回新文件
        // 8:00 8：00 304
        // 9:00 8:00 这是就返回一个新文件
        // 根据修改时间判断
        // if-modified-since  Last-Modified
        if (!err) {
            //浏览器发过来的时间
            let since = req.headers['if-modified-since'];
            if(since){
                //与本地文件的创建时间对比，如果是一样的就返回304告诉浏览器用缓存
                if(since === stat.ctime.toUTCString()){
                    res.statusCode = 304;
                    res.end();
                }else{
                   //如果是修改过和就用新的文件，同时设置修改时间
                    sendFile(req,res,p,stat);
                }
            }else{
                sendFile(req,res,p,stat);
            }
        } else {
            sendError(res);
        }
    })
});
function sendError(res) {
    res.statusCode = 404;
    res.end();
}
function sendFile(req, res, p,stat) {
    res.setHeader('Cache-Control','no-cache')
    res.setHeader('Last-Modified',stat.ctime.toUTCString());
    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8')
    fs.createReadStream(p).pipe(res);
}
server.listen(8080);

//注意了，最后修改时间是会有一下几个方面问题的
1.有些服务器不能精确到文件的最后修改时间
2.Last-Modified 只能精确到秒
3.有时候覆盖内容了，内容没有更新，但是修改时间边了，我们希望他还是用缓存的
4.同一个文件位于多个cdn服务器，修改的时间可能就不统一了

```

9.4 用etag的形式 判断对比缓存

```
let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let crypto = require('crypto');
// 根据的是最新修改时间  这回根据的是文件的内容 111 111
// ETag:md5加密 / if-none-match
let server = http.createServer(function (req, res) {
    let { pathname } = url.parse(req.url);
    let p = path.join(__dirname, 'public', '.' + pathname);
    fs.stat(p, function (err, stat) {
        let md5 = crypto.createHash('md5');
        let rs = fs.createReadStream(p);
        rs.on('data',function(data){
            md5.update(data);
        });
        rs.on('end',function(){
            // stat.ctime+stat.size
            let r = md5.digest('hex'); // 当前文件的唯一标识
            // 下次再拿最新文件的加密值 和客户端请求来比较
            let ifNoneMatch = req.headers['if-none-match'];
            if(ifNoneMatch){
                if(ifNoneMatch === r){
                    res.statusCode = 304;
                    res.end();
                }else{
                    sendFile(req,res,p,r);
                }
            }else{
                sendFile(req,res,p,r);
            }
        });
    })
});
function sendError(res) {
    res.statusCode = 404;
    res.end();
}
function sendFile(req, res, p,r) {  
   //如果是index.html的话就会这样配置，'Cache-Control':'no-cache'不用客户端缓存，缓存由对比缓存控制
    res.setHeader('Cache-Control','no-cache')
    res.setHeader('Etag',r);
    res.setHeader('Content-Type', mime.getType(p) + ';charset=utf8')
    fs.createReadStream(p).pipe(res);
}
server.listen(8080);
//根本的原理的通过对文件的内容的摘要算法生成md5，形成etag，其实也可以是创建时间和文件大少形成etag
```

9.5nodejs的强缓存实现

```
let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime');
let server = http.createServer(function(req,res){
   let {pathname} =  url.parse(req.url);
   console.log(pathname);
   let p = path.join(__dirname,'public','.'+pathname);
   fs.stat(p,function(err,stat){
        if(!err){
            sendFile(req,res,p);
        }else{
            sendError(res);
        }
   })
});
function sendError(res){
    res.statusCode = 404;
    res.end();
}
function sendFile(req,res,p){
    //Expires是htp1.0里面的如果作用和Cache-Control一样，两个共存的话Cache-Control要高级一点
    let date = new Date(Date.now()+10*1000);
   // res.setHeader('Expires',date.toUTCString());
   //10秒里不在请求服务器
    res.setHeader('Cache-Control','max-age=10');
    res.setHeader('Content-Type',mime.getType(p)+';charset=utf8')
    fs.createReadStream(p).pipe(res);
}
server.listen(8080);
//注意Cache-Control还有一下几个参数可以选择
1.private客户端可以缓存
2.public 客户端和服务器都可以缓存
3.max-ago=60 客户端缓存60秒
4.no-cache强制使用对比缓存
5.no-store所有内容都不会缓存
```

9.6 进程

```
1.在Node.js中每个应用程序都是一个进程类的实例对象。
使用process对象代表应用程序,这是一个全局对象，可以通过它来获取Node.jsy应用程序以及运行该程序的用户、环境等各种信息的属性、方法和事件


```

9.7进程对象属性

- execPath 可执行文件的绝对路径,如 `/usr/local/bin/node`
- version 版本号
- versions 依赖库的版本号
- platform 运行平台。 如 darwin、freebsd、linux、sunos、win32
- stdin 标准输入流可读流，默认暂停状态
- stdout 标准输出可写流，同步操作
- stderr 错误输出可写流，同步操作
- argv 属性值为数组
- env 操作系统环境信息
- pid 应用程序进程ID
- title 窗口标题
- arch 处理器架构 arm ia32 x64

9.7.1 内存使用情况：

 console.log(process.memoryUsage())

- rss（resident set size）：所有内存占用，包括指令区和堆栈。
- heapTotal："堆"占用的内存，包括用到的和没用到的。
- heapUsed：用到的堆的部分。
- external： V8 引擎内部的 C++ 对象占用的内存

### 9.7.1.3 nextTick方法

nextTick方法用于将一个函数推迟到代码中所书写的下一个同步方法执行完毕或异步方法的回调函数开始执行前调用

### 9.7.1.4 chdir

chdir方法用于修改Node.js应用程序中使用的当前工作目录，使用方式如下

```javascript
process.chdir(directory);
```

### 9.7.1.5 cwd 方法

cwd方法用返回当前目录，不使用任何参数

```javascript
console.log(process.cwd());
```

### 9.7.1.6 chdir 方法

改变当前的工作目录

```javascript
console.log(`当前目录: ${process.cwd()}`);
process.chdir('..);
console.log(`上层目录: ${process.cwd()});
```

### 9.7.1.7 exit 方法

退出运行Node.js应用程序的进程

```javascript
process.exit(0);
```

### 9.7.1.8 kill方法

用于向进程发送一个信号

- SIGINT 程序终止(interrupt)信号, 在用户键入INTR字符(通常是Ctrl-C)时发出，用于通知前台进程组终止进程。
- SIGTERM 程序结束(terminate)信号, 该信号可以被阻塞和处理。通常用来要求程序自己正常退出，shell命令kill缺省产生这个信号

```javascript
process.kill(pid,[signal]);
```

- pid是一个整数，用于指定需要接收信号的进程ID
- signal 发送的信号，默认为 SIGTERM

### 9.7.1.9 uptime

返回当前程序的运行时间

```javascript
process.uptime()
```

### 1.10 hrtime

测试一个代码段的运行时间,返回两个时间，第一个单位是秒，第二个单位是纳秒

```javascript
let fs = require('fs);
let time = process.hrtime();
let data = fs.readFileSync('index.txt');
let diff = process.hrtime(time);
console.log(`读文件操作耗费的%d秒`,diff[0]);
```

### 9.7.1.11 exit事件

当运行Node.js应用程序进程退出时触发进程对象的exit事件。可以通过指定事件回调函数来指定进程退出时所执行的处理。

```javascript
process.on('exit',function(){
    console.log('Node.js进程被推出);
});
process.exit();
```

### 9.7.1.12 uncaughtException事件

当应用程序抛出一个未被捕获的异常时触发进程对象的uncaughtException事件

```javascript
process.on('uncaughtException',function(err){
  console.log('捕获到一个未被处理的错误:',err);
});
notExist();
```

### 9.7.1.13 信号事件

```javascript
process.stdin.resume();
process.on('SIGINT',function(){
    console.log('接收到SIGINT信号');
});
```

10.0 node下面的子进程：

  10.1 通过spawn创建子进程：

  

```
let {spawn} = require('child_process');
let path = require('path');
// process.cwd()
let child = spawn('node',['1.test.js','a','b','c'],{
    cwd:path.join(__dirname,'pro')
});

//1.test.js
process.argv.slice(2).forEach(function(arg){
    process.stdout.write(arg);
})  

```

10.2 node 中和fork.js

```
let {
    fork
} = require('child_process');
let path = require('path');
let child = fork(path.join(__dirname, 'fork.js'));
child.on('message', function (m) {
    console.log('父进程接收到消息:', m);
    process.exit();
});
child.send({
    name: 'zfpx'
});
child.on('error', function (err) {
    console.error(arguments);
});

//fork.js
process.on('message', function (m, setHandle) {
    console.log('子进程收到消息:', m);
    process.send({
        age: 9
    });
})
```

10.21 detached

- 在默认情况下，只有在子进程全部退出后，父进程才能退出。为了让父进程可以先退出，而让子进程继续进行I/O操作,可以在spawn方法中使用options参数，把detached属性值设置为true

- 默认情况下父进程会等待所有的子进程退出后才可以退出，使用subprocess.unref方法可以让父进程不用等待子进程退出就可以直接退出

  ```javascript
  let cp = require('child_process');
  let fs = require('fs');
  let path = require('path');
  let out = fs.openSync(path.join(__dirname, 'msg.txt'), 'w', 0o666);
  let sp = cp.spawn('node', ['4.detached.js'], {
    detached: true,
    stdio: ['ignore', out, 'ignore']
  });
  sp.unref();
  ```

```javascript
let count = 10;
let $timer = setInterval(() => {
    process.stdout.write(new Date().toString() + '\r\n');
    if (--count == 0) {
        clearInterval($timer);
    }
}, 500);
`
```

10.3共享net服务器：

```
let {fork} = require('child_process');
let path = require('path');
let child = fork('socket.js',{
    cwd:path.join(__dirname,'test')   //socket.js的目录
});
let net = require('net');

let server = net.createServer(function(socket){
    if(Math.random()>0.5){
        socket.write('father');
    }else{
        child.send('socket',socket);
    }
}).listen(3000);



//socket.js
process.on('message',function(msg,socket){
    if(msg === 'socket'){
        socket.write('child')
    }
})


```

10.4 nodejs 后端支持语言切换

```
// 多语言  vue-i18n 国际化 前端的
// 可以支持语言的切换

// 服务端如何支持多语言
let pack = {
    'zh-CN':{content:'你好'},
    'en':{content:'hello'},
    'fr-FR':{content:'Bonjour'}
};
let http = require('http');
let server = http.createServer();
server.on('request',function(req,res){
    let lan = 'en'; // 默认语言
    let language = req.headers['accept-language'];
    // Accept-Language: zh;q=0.9,en;q=0.7,fr-FR，浏览器设置的语言权重
    let arrs = [];
    if(language){
    //根据权重排序数组，倒叙排序
        arrs = language.split(',').map(l=>{
            l = l.split(';');
            return {
                name:l[0],
                q:l[1]?Number(l[1].split('=')[1]):1
            }
        }).sort((lang1,lang2)=>lang2.q-lang1.q);
        console.log(arrs);
    }
    
    res.setHeader('Content-Type','text/plain;charset=utf8');
    for(var i = 0;i<arrs.length;i++){
        // 去语言包里找对应的内容 看看有没有
        let name = arrs[i].name
        if(pack[name]){
            res.end(pack[name].content);
            break;
        }
    }
    res.end(pack[lan].content);
}).listen(8888);
```

10.5图片防盗连

```
let fs = require('fs');
let path = require('path');
let http = require('http');
let url = require('url');
let getHostName = (str) => {
    let {hostname} = url.parse(str,true);
    return hostname;
}
// 白名单  可以允许 某个域名访问这张图片
let whitList = ['www.zf2.cn']
let server = http.createServer(function (req, res) {
   //有refer代表是从其他的网页中引入的
    let refer = req.headers['referer'] || req.headers['referrer'];
    // 先看一下refer的值 ，还要看图片的请求路径
    // 要读取文件 返回给客户端
    let {pathname} = url.parse(req.url,true);
    let p = path.join(__dirname,'public','.'+pathname);
    // p代表我要找的文件
    fs.stat(p,function(err){ // 判断请求的文件到底有没有啊？
        if(!err){
            if(refer){
                let referHostName = getHostName(refer);
                let host = req.headers['host'].split(':')[0];
                if(referHostName!=host && !whitList.includes(referHostName)){
                    // 防盗链
                    fs.createReadStream(path.join(__dirname,'public','./2.jpg')).pipe(res);
                }else{
                    // 正常显示
                    fs.createReadStream(p).pipe(res);
                }
            }else{
                // 正常显示
                fs.createReadStream(p).pipe(res);
            }
        }else{
            res.end();
        }
    })
}).listen(9999);
```

10.6 nodejs创建代理服务器

```

// http-proxy;
let httpProxy = require('http-proxy');
let http = require('http');
// 创建代理服务器
let proxy = httpProxy.createProxyServer();
http.createServer(function(req,res){
    proxy.web(req,res,{
        target:'http://localhost:8000'
    });
}).listen(3000);

// 虚拟主机
```

10.7 同一台主机共享80端口

```
1.在服务器的host文件中指定域名
  127.0.0.1 baidu.com
  127.0.0.1 tengxun.com
2.创建代理服务器
let httpProxy = require('http-proxy');
let http = require('http');
// 创建代理服务器
let proxy = httpProxy.createProxyServer();
let hosts = {
    'www.zf1.cn':'http://localhost:5000',
    'www.zf2.cn':'http://localhost:8000',

}
//根据host来判断代理到哪里去
http.createServer(function(req,res){
   let host = req.headers['host'];
   proxy.web(req,res,{
       target:hosts[host]
   })
}).listen(80);

```

10.8 user-agent-parser

![image-20200927070846375](zhufeng.assets/image-20200927070846375.png)

11.express



   todo源码实现原理



 11.1 nodejs  模版引擎的实现原理

   

```
/**
<%if(user){%>
  hello <%=user.name%>
<%}else{%>
  hello guest
<%}%>
*/
/**
上面的代码最终会返回下面的with形式的代码
 let tpl = ``;
 with (obj) {
        tpl += ``;
        if (user) {
            tpl += `hello ${user.name}`;
        } else {
            tpl += `hello guest`;
        }
        tpl += ``;
    }
 return tpl;
 **/
源代码实现：
const fs = require('fs');
function render(filepath,options,callback){
  fs.readFile(filepath,'utf8',function(err,content){
      if(err) return callback(err);
      let head = "let tpl = ``;\n with(obj){\n tpl +=`";
      content = content.replace(/<%=([\s\S]+?)%>/g,function(){
          return "${"+arguments[1]+"}";
      });
      content = content.replace(/<%([\s\S]+?)%>/g,function(){
          return "`;\n"+arguments[1]+" tpl+=`";
      });
      let tail = "`\n}\nreturn tpl;";
      let html = head + content + tail;
      console.log(html);
      html = new Function('obj',html);
      html = html(options);
      return callback(null,html);
  })
}
module.exports = render;
```



11.2express.static 静态文件服务器：

```
let express = require("express")
let path = require("path")
let fs = require("fs")
let url = require("url")
let mime = require("getType")
let app = express()
app.use(express.static(path.join(__dirname,'pubilc')))
app.listen(8080)

具体实现的方法
function static(root,options={}){
   return function(){
     let {pathname} = url.parse(req.url,true);//得到文件路径
     let file = path.join(root,pathname);//得到文件绝对路径
     fs.stat(file,function(err,stat){
        if(err){
          next()
        }else{
          let contentType = mime.getType(pathname);
          res.setheader("Content-Type",contentType);
          fs.createReadStream(file).pipe(res)
        }
     })
   } 
}

```

12.1前端监控sdk

参考下面项目sdk https://github.com/geeknull/eagle-monitor.git

12.2 nodejs简单的set-cookie代码

```
let http = require('http');
let server = http.createServer(function (req, res) {
    if (req.url == '/write') {//向客户端写入cookie
        res.setHeader('Set-Cookie', "name=zfpx");
        res.end('write ok');
    } else if (req.url == '/read') {
        //客户端第二次请求的时候会向服务器发送   Cookie
        let cookie = req.headers['cookie'];
        res.end(cookie);
    } else {
        res.end('Not Found');
    }
}).listen(8080);
```

12.3 nodejs基于cookie的防止篡改

```
const express =require('express');
const cookieParser = reqiure("cookie-parser");
const app = express();
app.use(cookieParser('this is a key'))
app.get('/write',function(req,res){
   //signed=true 表示要加密
   res.cookie("name",'zfpx',{signed:true});
   res.cookie('age',"8")
   res.end("wrirte ok")
})
app.get("/read",function(req,res){
 //req.signedCookies 可以读取已经签名的cookie
 //req.cookies 读取没有签名的cookie
   res.end(req.signedCookies)
})
```

12.4 cookie 的各个参数意义:

```
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.listen(8080);
/**
 * Set-Cookie:name=zfpx; Domain=a.zfpx.cn; Path=/
 * domain 就是指定此cookie是属于哪些域名的
 */
app.get('/write', function (req, res) {
    res.cookie = function (key, val, options) {
        let { domain, path, maxAge, expires, httpOnly, secure } = options;
        let parts = [`${key}=${val}`];
        if (domain) {
            parts.push(`Domain=${domain}`);
        }
        if (path) {
            parts.push(`Path=${path}`);
        }
        if (maxAge) {
            parts.push(`Max-Age=${maxAge}`);
        }
        if (expires) {
            parts.push(`Expires=${expires.toUTCString()}`);
        }
        if (httpOnly) {
            parts.push(`httpOnly`);
        }
        if (secure) {
            parts.push(`Secure`);
        }
        let cookie = parts.join('; ');
        res.setHeader('Set-Cookie', cookie);
    }
    //Set-Cookie:name=zfpx; Domain=localhost; Path=/read2; Max-Age=10000; Expires=Wed, 07 M
    res.cookie('name', 'zfpx', {
        httpOnly: true, //不允许客户端通过浏览的cookie访问
        secure: true,//只能通过https访问
        maxAge: 10 * 1000,//最大存在时间
        path: '/read2',//规定那个路径下有用，注意http：localhost/read2/5 这样的路径下也有用的
        domain: 'localhost',//生效的域名
        expires: new Date(Date.now() + 10 * 1000)//过期时间
    });
    res.end('ok');
});
app.get('/read', function (req, res) {
    res.send(req.cookies);
});
app.get('/read1', function (req, res) {
    res.send(req.cookies);
});
app.get('/read1/1', function (req, res) {
    res.send(req.cookies);
});
```

12.5  express cookie 登录验证

```
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
//判断用户是否登录，如果登录的话可以继续访问，如果不登录，则跳到登录页
function checkLogin(req, res, next) {
    if (req.cookies.username) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/login', function (req, res) {
    res.render('login', { title: '登录' });
});
app.post('/login', function (req, res) {
    let user = req.body;
    if (user.username == '1' && user.password == "1") {
        res.cookie('username', user.username, {
            httpOnly: true
        });
        res.redirect('/user');
    } else {
        res.redirect('back');
    }
});
app.get('/user', checkLogin, function (req, res) {
    let { username } = req.cookies;
    res.render('user', { title: '登录', username });
});
app.listen(8080);
```

12.6 express session 原理

```
const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const app = express();
app.use(cookieParser());
//自己实现套session的原理
//这个key就是服务器向客户端写卡号时的name
const SESSION_KEY = 'connect.sid';
//记录每一个卡号和对应的数据的对应关系 
const sessions = {};
app.get('/', function (req, res) {
    let sessionId = req.cookies[SESSION_KEY];
    if (sessionId) {
        let sessionObj = sessions[sessionId];
        if (sessionObj) {
            sessionObj['balance'] -= 10;
            res.send(`你还剩${sessionObj['balance']}钱`);
        } else {
            banKa();
        }
    } else {
        banKa();
    }
    //1.卡号不能相同 2.最好不容易猜 出来
    function banKa() {
        let sessionId = uuid.v4();//编一个卡号
        //在服务器端记录此卡号对应的余额
        sessions[sessionId] = { balance: 100 };
        //把卡号发给客户端
        res.cookie(SESSION_KEY, sessionId);
        res.send(`欢迎新客户，送你一张会员卡，余额100`);
    }
});
app.listen(8080);
```

13.koa 上传文件代码

```
const Koa = require('koa');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const querystring = require('querystring');
const app = new Koa();
app.listen(3000);
Buffer.prototype.split = function (sep) {
    let pos = 0;//记录当前是从哪个索引开始查找分隔符
    let len = sep.length;//分隔符的字节长度 2
    let index = -1;//查找到的分隔子串所在的索引
    let parts = [];
    while (-1 != (index = this.indexOf(sep, pos))) {
        parts.push(this.slice(pos, index));
        pos = index + len;
    }
    parts.push(this.slice(pos))
    return parts;
}
//如果说要在表单里上传文件的话，就需要给表单增加一个enctype="multipart/form-data"
app.use(async function (ctx, next) {
    if (ctx.url == '/user' && ctx.method == 'GET') {
        ctx.set('Content-Type', 'text/html;charset=utf8');
        ctx.body = (
            `
             <form method="POST" enctype="multipart/form-data">
               <input type="text" name="username">
               <input type="file" name="avatar">
               <input type="submit">
             </form>
            `
        );
    } else {
        await next();
    }
});
app.use(async function (ctx, next) {
    if (ctx.url == '/user' && ctx.method == 'POST') {
        let contentType = ctx.headers['content-type'];
        console.log(contentType);
        if (contentType.includes('multipart')) {
            let matches = contentType.match(/\bboundary=(.+)/);
            let sep = '--' + matches[1];//------WebKitFormBoundaryTy7iIuU5OKqScnqj
            ctx.body = await getBody(ctx.req, sep);
        } else {
            next();
        }

    } else {
        await next();
    }
});
//返回了真正的请求体
function getBody(req, seq) {
    return new Promise(function (resolve, reject) {
        let buffers = [];
        req.on('data', function (data) {
            buffers.push(data);
        });
        req.on('end', function () {
            let all = Buffer.concat(buffers);
            let fields = {};
            let lines = all.split(seq);
            lines = lines.slice(1, -1);//2
            lines.forEach(function (line) {
                let [desc, val] = line.split('\r\n\r\n');
                desc = desc.toString();
                val = val.slice(0, -2);//去掉尾部的/r/n
                if (desc.includes('filename')) {//如果包含filename就认为它是一个文件
                    let [, line1, line2] = desc.split('\r\n');
                    let lineObj1 = querystring.parse(line1, '; ');
                    let lineObj2 = querystring.parse(line2, '; ');
                    let filepath = path.join(__dirname, 'uploads', uuid.v4());
                    fs.writeFileSync(filepath, val);
                    fields[lineObj1.name] = [
                        { ...lineObj1, ...lineObj2, filepath }
                    ]
                } else {//普通字段
                    let name = querystring.parse(desc, '; ').name.replace(/"/g, '');
                    fields[name] = val.toString();
                }

            })
            resolve(fields);
        });
    });
}
/**
 * 请求头中的内容类型
 * Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryTy7iIuU5OKqScnqj
 * 
 * 请求体
------WebKitFormBoundary2WK3bilBxisKdBXD
Content-Disposition: form-data; name="username"

123
------WebKitFormBoundary2WK3bilBxisKdBXD
Content-Disposition: form-data; name="avatar"; filename="msg.txt"
Content-Type: text/plain

abc
------WebKitFormBoundary2WK3bilBxisKdBXD--

 */


```

13.2 koa 源码

```
class Koa {
    constructor() {
        this.middleware = [];
    }
    use(fn) {
        this.middleware.push(fn);
    }
    listen(port) {
        let middleware = this.middleware;
        require('http').createServer((req, res) => {
            let ctx = { req, res };
            // koa2.0 3.0
            // dispatch(0);
            // function dispatch(idx) {
            //     middleware[idx](ctx, () => next(idx + 1));
            // }
            // [1,2,3]
            //是koa1.0原理
            (middleware.reduceRight((val, item) => {
                return item.bind(null, ctx, val);
            }, (function () { })))()
        }).listen(port);
    }
}
module.exports = Koa;
```

14.v8引擎原理：

  1.内存的分类，process.memoryUsage 打印出来的4个变量分代表的意思：

![image-20210109224023647](zhufeng.assets/image-20210109224023647.png)

   2.v8系统的；内存限制：64位系统的一般就为1.4g。为什么有这个限制呢？因为垃圾回收的超过1.4g就会超过1秒，垃圾回收的时间我们叫做Stop The World时间，期间程序不能做任何操作

 3.v8的垃圾回收机制



 v8是基于分代回收回收，分为新生代和老生代，不同的分代有不同的回收方式。

​    在新生代中：分为form--to两个区域 ，新生代的扫描一开始是从根元素，通过 广度优先算法，遍历根元素的每个节点，如果是活着的就会方法to区域，不是活着的就要销毁，完成遍历之后，就会交换to，和from两个区域，继续上次的操作，如果一个变量在to，from交换了5次以上，还是存活的话就会继续放到老生带里面（一开始大对象也有可能放到老生代里面，因为老生代的空间比较大）

   在老生代中：通过三种方式清除没有用的变量

   1.标记清除：遍历老生代的变量，没有存活的就标记下来。通过标记删除不存活的变量

   2.标记整理：通过交互存活和不存活的变量的位置，存活的向左，不存在的向又，最后清除右边不存活的变量

 3.增量标记：就是把标记过程，变成多次标记，垃圾回收和应用程序运行交替进行，停顿时间减少到1/6左右。

   

25.如何提高网页加载速度

 1.合并请求，nginx模块，spirte雪碧图

2.缓存：强缓存，协商缓存，localstorage，http头

3.tcp网络优化链接，tcp调优，http/2，keep-alive

4.硬件：加大宽带，使用cdn，

5.资源大少：gzip，webp，image压缩，cookie体积

6.预加载，多个cdn域名，dns预取，异步读取js

  

15.服务器部署与运维

   1.cmd登录服务器：ssh root@118.190.59.49  然后输入密码

   2.root用户的权限非常大，一般不用root登录的

   3.下载xshell软件，按新建连接按钮配置如下：

​    ![1613918073736](zhufeng.assets/1613918073736.png)

  登录成功界面：

![1613918102830](zhufeng.assets/1613918102830.png)

15.2 docker

  部署我们的应该越来越复杂，为了统一部署方便需要用到docker

 docker 常见的命令：

  1.拉取镜像：docker pull centos

  2.创建新的容器并运行：docker run --name mynginx -d  nginx:latest (-d 代表后天运行)

 3.启动容器：docker start container_name/id

 4.停止容器：docker stop container_name/id

 5.重启容器：docker restart container_name/id

 6.在容器中开始交互终端：docker exec -i -t container _id /bin/bash

 7.使用当前目录docker创建镜像，标签为xxx:v1：docker build -t xxx:v1 

16.持续部署和集成

  16.1.建立后端项目: 建立文件夹：vue-back-master，新建文件：server.js

 

```
let http = require('http');
let users = [
    {id:22,name:'zhufeng1'},
    {id:22,name:'zhufeng2'},
    {id:22,name:'zhufeng3'}
]
let server = http.createServer(function(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.url === '/api/users'){
      res.end(JSON.stringify(users));
  }else{
      res.end('Not Found');
  }
});
server.listen(3000,()=>{
    console.log('后端API接口服务器已经启动在3000端口！')
});


//在packaged.json 配置：
  "scripts": {
    "start": "node ./server.js"
  },
//启动 npm run start
```

   

16.2 用vue-cli新建前端项目：vue create vue-front-master

16.3 新建nodejs项目：新建文件夹 vue-webhook-master ，npm init -y，然后安装cnpm i nodemailer ，安装发邮件项目，配置webhook，编写webhook代码，上传代码到服务器并且启动：

```
let http = require('http');
let crypto = require('crypto');
let {spawn} = require('child_process');
let SECRET= '123456';
let sendMail = require('./sendMail');
function sign(body){
    return `sha1=`+crypto.createHmac('sha1',SECRET).update(body).digest('hex');
}
let server = http.createServer(function(req,res){
   console.log(req.method,req.url);
   if(req.method == 'POST' && req.url == '/webhook'){
       let buffers = [];
       req.on('data',function(buffer){
           buffers.push(buffer);
       });
       req.on('end',function(buffer){
           let body = Buffer.concat(buffers);
           let event = req.headers['x-github-event'];//event=push
           //github请求来的时候，要传递请求体body,另外还会传一个signature过来，你需要验证签名对不对
           let signature = req.headers['x-hub-signature'];
           if(signature  !== sign(body)){
             return res.end('Not Allowed');
           }
           res.setHeader('Content-Type','application/json');
           res.end(JSON.stringify({ok:true}));
           if(event == 'push'){//开始布署
                let payload = JSON.parse(body);
                let child = spawn('sh',[`./${payload.repository.name}.sh`]);
                let buffers = [];
                child.stdout.on('data',function(buffer){
                    buffers.push(buffer);
                });
                 child.stdout.on('end',function(buffer){
                    let logs = Buffer.concat(buffers).toString();
                    sendMail(`
                        <h1>部署日期: ${new Date()}</h1>
                        <h2>部署人: ${payload.pusher.name}</h2>
                        <h2>部署邮箱: ${payload.pusher.email}</h2>
                        <h2>提交信息: ${payload.head_commit&&payload.head_commit['message']}</h2>
                        <h2>布署日志: ${logs.replace("\r\n",'<br/>')}</h2>
                    `);
                });
           }
       });
      
   }else{
       res.end('Not Found');
   }
});
server.listen(4000,()=>{
    console.log('webhook服务已经在4000端口上启动')
});
```

16.4 把项目vue-front-master，vue-back-master 推送到git

16.5.安装git。如果是不想每次都填写密码，生成公钥

```
ssh-keygen -t rsa -b 4096 -C "499200621@qq.com"  //-t是加密的算法rsa，-b是生成的大少，-c就是邮箱
cat /root/.ssh/id_rsa.pub
然后看到公钥，把公钥复制到github上面
```

16.6安装node 以及nvm ,通过nvm来实现的

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash //安装nvm,nvm可以让电脑系统；里面同时安装多个node
. /root/.bashrc  //执行一个脚本
nvm install stable //有了nvm就可以安装node，和npm
npm i nrm -g  //nrm用来切换阿里云的
nrm use taobao
npm i pm2 -g
```

16.7安装docker

```
yum install -y yum-utils   device-mapper-persistent-data   lvm2
//为yum添加一个阿里安装源
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
// docker-ce 是免费的，docker-ee是企业版本，要收费的
yum install -y docker-ce docker-ce-cli containerd.io
```

16.8.docker阿里云加速

```
//创建一个文件夹
mkdir -p /etc/docker
//在文件夹中添加阿里云配置
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://fwvjnv59.mirror.aliyuncs.com"]
}
EOF
# 重载所有修改过的配置文件
systemctl daemon-reload
systemctl restart docker
```

16.9   vue-webhooks项目要常态化运行，不能关闭cmd就不能运行了，这个时候需要全局安装

pm2 进行维护：cnpm i pm2 -g，在项目中的packjson.json 中配置   

```
"scripts":{
       "start":"pm2  start  ./index.js  --name webhook --watch",
       "stop":"pm2 stop  webhook"
}

1.启动用npm start
2.看打印的日志pm2 logs
```

17.0webhook主要的流程：

​    1.github 或者gitee平台在收到用户的push请求的时候，会调用用户自己注册的webhook接口

​    2.然后接口在接受到请求之后就执行sh脚本：

​    let child = spawn('sh',[`./${payload.repository.name}.sh`]);  执行对应仓库的脚本

```
  if(event == 'push'){//开始布署
                let payload = JSON.parse(body);
                //如果是push执行创库的对应的脚步,例如vue-back.sh
                let child = spawn('sh',[`./${payload.repository.name}.sh`]);
                let buffers = [];
                child.stdout.on('data',function(buffer){
                    buffers.push(buffer);
                });
                 child.stdout.on('end',function(buffer){
                    let logs = Buffer.concat(buffers).toString();
                    sendMail(`
                        <h1>部署日期: ${new Date()}</h1>
                        <h2>部署人: ${payload.pusher.name}</h2>
                        <h2>部署邮箱: ${payload.pusher.email}</h2>
                        <h2>提交信息: ${payload.head_commit&&payload.head_commit['message']}</h2>
                        <h2>布署日志: ${logs.replace("\r\n",'<br/>')}</h2>
                    `);
                });
           }
```

 3.以下以前端和后端的脚本说明，具体说明构建流程：前端



```
#!/bin/bash
WORK_PATH='/usr/projects/vue-front'  // 进入前端项目所在的目录
cd $WORK_PATH                        // 进入前端项目所在的目录
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "编译"
npm run build
echo "开始执行构建

//表示在当前目录下面找docker-file文件，构建名为 vue-front的镜像，-t表示名字
docker build -t vue-front:1.0 .  


echo "停止旧容器并删除旧容器"
docker stop vue-front-container
docker rm vue-front-container
echo "启动新容器"

//用镜像vue-front:1.0启动容器
docker container run -p 80:80 --name vue-front-container -d vue-front:1.0


//当前项目的docker-file
FROM nginx
LABEL name="vue-front"
LABEL version="1.0"
COPY ./dist /usr/share/nginx/html        //复制主机的./dist到/html下面
COPY ./vue-front.conf  /etc/nginx/conf.d  //复制ng配置到conf.d下面
EXPOSE 80                                 //向外暴露80端口

//ng的vue-front.conf配置:
server {
    listen 80;
    server_name 47.105.129.109;
    location / {
    //root静态根路径跟目录设置为/usr/share/nginx/html
        root /usr/share/nginx/html;    
        index index.html index.htm;    //用index.html index.htm 作为启动文件
        try_files $uri $uri/ /index.html;//前端如果用history模式就要这样配置
    }
    location /api {                      //接口代理配置
        proxy_pass http://47.105.129.109:3000;
    }
}

//到此为止整个前端项目就起来了

```

后端脚本：跟前端差不多

```


#!/bin/bash
WORK_PATH='/usr/projects/vue-back'
cd $WORK_PATH
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "开始执行构建"
docker build -t vue-back:1.0 .   
echo "停止旧容器并删除旧容器"
docker stop vue-back-container
docker rm vue-back-container
echo "启动新容器"
docker container run -p 3000:3000 --name vue-back-container -d vue-back:1.0


//docker-file配置：
FROM node              //从node拉取镜像
LABEL name="vue-back"  //
LABEL version="1.0"
COPY . /app            //复制当前文件夹的代码到容器的app目录下面
WORKDIR /app           //进入app目录下面
RUN npm install        //安装依赖
EXPOSE 3000           //导出端口
CMD npm start         //启动项目

```

