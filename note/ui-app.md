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

app.vue :全局样式



4.尺寸和单位

  unapp 支持的长度单位是px和%，默认宽度为750px，如果设计稿是750px，直接按设计稿来就行

如果设计搞是375px，那么实际填写的px是 =  750px * 设计稿上面的px  / 350px

5.样式

 如果想样式全局生效的话，就在app.vue上面的style标签里面填写

引入外部样式的话可以通过@import  '../common.css'

内联样式:<view style="color:{{color}}"></view>

目前支持的选择器：class选择器，id选择器，类名选择器，伪类选择器



6.uni-app 配置项目中的page.json

{

//每个页面样式

"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		}
	],

//全局样式，主要是导航条

​	"globalStyle": {
​		"navigationBarTextStyle": "black",
​		"navigationBarTitleText": "uni-app",
​		"navigationBarBackgroundColor": "#F8F8F8",
​		"backgroundColor": "#F8F8F8"
​	},}

![image-20200710070843121](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200710070843121.png)

放在pages第一个对应就是首页

![image-20200710071739356](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200710071739356.png)

![image-20200710071958927](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200710071958927.png)



7.新建的图片可以放大static文件夹中

8.tabar 下面的list最多可以放5个导航项

9.condition可以模拟参数导入，方便调试

![image-20200712180727725](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200712180727725.png)

10.page.json主要是为了兼容小程序的，mainfest.json是app总体配置

11.数据绑定：直接在data上面定义，然后在模版中{{}}绑定

12.for循环

   

```
<view v-for="(item,index) in students" >{{index}}-{{item.name}}</view>
```

13.条件渲染 v-if="show"   :hidden="true"



14.样式

​    14.1.styles

```html
<view :style="{color:colorValue,fontSize:value}"></view>
<view :style="[color:colorValue,fontSize:value]"></view>
```

​    14.2.class一共有一下几种的方式绑定class

```html

 <view :class="{active:true}"></view>
 <view  :class="[classname1,classname2]"></view>
 <view :class="[isActive?'classname1':'']"></view>
 <view :class="[{active:true},classname]"></view>
```

  15.事件

  uni-app的事件和web是一样的

   ![image-20200716063955761](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200716063955761.png)

```
<view  @click="clicktest" @longtap="longtap"></vievw>

 methods:{
     clicktest(e){},
     longtap(e){}
 }


```

注意除了id属性通过e.target.id 可以取得以外，其他的不是标准的属性都不能取得

e.currentTarget.id 是事件被注册的元素

e.target.id 是实际被点击的元素

冒泡顺序是从body往上冒泡的



16.组件：https://uniapp.dcloud.io/component/README

  16.1 scroll-view

​      

```
  <scroll-view  scroll-x="true"></scroll-view>
  如果是scroll-y="true" 组件可以自动滚动
  如果是scroll-x=“true” 组件要display：flex布局，flex-wrap:nowrap;white-space:nowrap 不换行
  
```



17.swiper

   

```
<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="100" :duration="300">
    <swiper-item>
    <view class="swiper-item uni-bg-red">A</view>
    </swiper-item>
    <swiper-item>
    <view class="swiper-item uni-bg-green">B</view>
    </swiper-item>
    <swiper-item>
    <view class="swiper-item uni-bg-blue">C</view>
    </swiper-item>
</swiper>
```

18.text

  和view的区别是这个text是可以被复制的

19.checkbox

```
<checkbox-group name="test" @change="change">
 <label>
 <checkbox name="man" value="1" /><text>旅游</text>
 </label>
 <label>
 <checkbox  name="lady"  value="2" /><text>读书</text>
 </label>
</checkbox-group>
```



20.picker   

  现在支持5种属性

  普通选择器，多列选择器，时间选择器，日期选择器，省市区选择器

​     mode =  selector  // 普通选择器

​    mode = multiSelector  //多列选择器

​    mode = time  //时间选择器

​    mode = date //日期选择器

​    mode = region //省市区选择器

```
<picker :range="datalist" @change="pickerChange">
			<view>请选择年份:{{pickerValue}}</view>
</picker>

methods:{
   pickerChange(e){
	  this.pickerValue = this.datalist[e.detail.value]
				
	},
}
```

 

21.slider

```
 <slider style="width: 80%;" value="50" @change="sliderChange" show-value />    </slider>
```

22.navigator

   主要有以下几种跳转：

​    navigateTo //保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面

​    redirect //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面

​     reLaunch // 关闭所有页面，打开到应用内的某个页面

​    switchTab //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

   navigateBack //关闭当前页面，返回上一页面或多级页面。可通过 [getCurrentPages](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html) 获取当前的页面栈，决定需要返回几层

```
<navigator url="../about/about" open-type="switchTab">
			<button type="default">跳转到新页面</button>
</navigator>


<button @click="skip"></button>
{
   methods:{
     skip(){
        uni.navigateTo({
           url:'pages/test'
        })
     }
   }
}


//传参  url:'pages/test?name=***'
onLoad(options){
    console.log(options)
}

```

23.audio 

 

```
<audio style="text-align: left" :src="current.src" :poster="current.poster" :name="current.name" :author="current.author"
:action="audioAction" controls></audio>
{
  data(){
     return{
         current: {
					poster: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg',
					name: 'happyMusic',
					author: '何家伟',
					src: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
				},
     }
  }
  
}
```

24.image

```
   <image style="width: 200px; height: 200px; background-color: #eeeeee;" :mode="widthFix" :src="src"
                        @error="imageError"></image>
```

25.网络请求

​    

```
uni.request({
     url:'',
     method:"GET",
     data:{},
     success(){
     
     }
})
```



26.上传文件

```
	uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success(res) {
						var img = res.tempFilePaths[0]
						let uper = uni.uploadFile({
							 url:"https://demo.hcoder.net/index.php?c=uperTest",
							 filePath:img,
							 name:"file",
							 success(res1) {
								 console.log(res1)
							 	
							 }
						})
						uper.onProgressUpdate((e)=>{
							  this.percent = e.progress
						})
					}
				})

```

27.setStorage

```
//异步存储
uni.setStorage({
    key:'name',
    data:'value',
    success(){
       
    }
})
uni.getStorage({
    key:'name',
    success(){
    }
})


//同步存储 注意要用try catch 包裹
uni.setStorageSync(key,value)
uni.getStorageSync(key)

//获取store对象
uni.getStorageInfo({
  success(){
  
  }
})
uni.getStorageInfoSync({
  success(){
  
  }
})
//删除
uni.removeStorage({
   key:"",
   success(){
     
   }
})
uni.removeStorageSync(key)


```

28.getsystemInfo

  读取系统信息，目前只支持小程序

29.getNetworkType  获取网络状态，是否是wifth或者4g

  

```
//支持h5
uni.getNetworkType({
    success(res) {
    console.log(res.networkType)
    alert(JSON.stringify(res))
    }
 })
 //切换网络的时候，res.isConnected 是否连接，networkType：4g/wifi
 uni.onNetworkStatusChange(function(res){
   alert(JSON.stringify(res))
 })
 

```

30.三轴的移动坐标,统计移动距离的时候会用到

```
uni.onAccelerometerChange(function(res){
  console.log((JSON.stringify(res)))
})
```

31.调用起打电话功能,微信小程序，和h5均可以

```
uni.makePhoneCall({
  phoneNumber:"13570270022"  
})
```

32.扫二维码,小程序可以，其他不行

```setClipboardData
 uni.scanCode({
     scanType:"qrCode",
     success(res){
     console.log(res)
     }
  })
```

33. setClipboardData剪切板  小程序可以，h5不行

    ```
    uni.setClipboardData({
        data:"hello",
        success(res) {
        console.log(res)
        }
        })
    ```

34.调整屏幕亮度

```
uni.setScreenBrightness({
  value:0.1,
  success(res) {

  }
})
```

35.设置屏幕长期亮

```
uni.setKeepScreenOn({ keepScreenOn:true })
```

36.设置标题，小程序h5有效

```
uni.setNavigationBarTitle({
    title: '新的标题'
});
```

37.设置页面标题加载样式

```
uni.showNavigationBarLoading()
uni.hideNavigationBarLoading()
```

38.下拉刷新

```
//配置enablePullDownRefresh
{
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app",
				 "enablePullDownRefresh":true
			}
}
//在onLoad 同级函数配置 可以设置page=1
onPullDownRefresh(){
    //加载数据
    //加载完成数据执行  uni.stopPullDownRefresh()//停止loading   page++
}


```

39.上拉加载

```
//页面到了底部
onReachBottom(){
	 //请求加载更多接口 完成后page++，判断是不是没有数据了，证明加载完成了，完成之后就不要再次请求数据了
},
```

40.条件编译

1.如果是在模版上面可以用一下方式区别每个平台

#####   模版：

<!-- #ifdef MP-WEIXIN --> //小程序
   <view>weixin</view>
<!-- #endif -->

<!-- #ifdef H5 -->   //h5
 <view>h5</view>
<!-- #endif -->

<!-- #ifdef APP-PLUS --> //5+app  现在暂时不能区分ios和android，要区分需要用uni.getSystemInfo()
<!-- #endif -->

#### css：

<!-- #ifdef MP-WEIXIN --> //小程序
  .wx-color{
     color:#ffff
  }
<!-- #endif -->

##### pages.json

// #ifdef APP_PLUS
{
   "path":'page/api/speech',
   style:{
     
   }

}


//#endif



条件的取值：
APP-PLUS	App
APP-PLUS-NVUE	App nvue
H5	H5
MP-WEIXIN	微信小程序
MP-ALIPAY	支付宝小程序
MP-BAIDU	百度小程序
MP-TOUTIAO	字节跳动小程序
MP-QQ	QQ小程序
MP-360	360小程序
MP	微信小程序/支付宝小程序/百度小程序/字节跳动小程序/QQ小程序/360小程序
quickapp-webview	快应用通用(包含联盟、华为)
quickapp-webview-union	快应用联盟
quickapp-webview-huawei	快应用华为



静态文件：在static文件夹下面放置转有的文件夹

![image-20200728073416220](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200728073416220.png)

![image-20200728073751919](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200728073751919.png)

条件编译快捷键：

#####  在 HBuilderX 中，ctrl+alt+/ 即可生成正确注释（js：`// 注释`、css：`/* 注释 */`、vue/nvue模板： ``）。

参考文档：

[https://uniapp.dcloud.io/platform?id=static-%e7%9b%ae%e5%bd%95%e7%9a%84%e6%9d%a1%e4%bb%b6%e7%bc%96%e8%af%91](https://uniapp.dcloud.io/platform?id=static-目录的条件编译)

41.提示

  uni.showToast({

​      title:'test',

​      icon:'success'

  })

![image-20200729064432841](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200729064432841.png)

uni.showLoading({

   title:"加载中"，

   mask：true,//透明的蒙层 

})

![image-20200729065122703](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200729065122703.png)

uni.showModal({
			title: "提示",
			content: "这是一个弹窗",
			success(res) {
					console.log(res.confirm)

​                     console.log(res.cancel)

​			}
​	})

![image-20200729070444935](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200729070444935.png)

uni.showActionSheet({

​    itemList:['item1','item2'],

​     success(res){

​       console.log(actions[res.tapIndex])

​    },

   fail:function(res){

   }

})





42.登录跨端支持

 1.小程序上要在mainfest.json加上appid，去掉https验证

  "mp-weixin" : {
        "appid" : "wx22ab021e0b5b17c9",
        "setting" : {
            "urlCheck" : false,
            "postcss" : true,
            "minified" : true
        },
        "usingComponents" : true
    },

2.app 微信登录授权

![image-20200729233127258](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200729233127258.png)

2.2app sdk配置，appid和appsecret  开发的时候可以乱填，但是正式上线的时候要填写回来

![image-20200729233301170](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200729233301170.png)

2.3 openid和unioid的区别，如果应用只在一个端上运行的话可以用openid  如果想要在多个端同一个标识的话就要用到unioid



3.uni-app的全局对象，可以用来放置全局方法和属性

![image-20200729235402570](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200729235402570.png)

 ![image-20200729235452521](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200729235452521.png)

强烈建议先去微信开方平台注册一个联合的帐号，每年300元

4.本地判断用户登录方法：

```
global.isLogin = function(){
     try{
        var suid = uni.getStorageSync('suid');
        var srand = uni.getStorageSync('srand');
      }catch(e){}
     if(suis==""||srand==""){
      return false
     }esle{
      return [suid,srand]
     }

}
//用法
var res = global.isLogin()
if(!res){
    uni.showModal({
       title:"提醒",
       content:"请登录",
       success(){
            uni.navigateTo({
              url:'/pages/login'
            })
       }
    })
}


```

5.跳转到登录页面后，点击登录按钮登录

	<!-- #ifdef MP-WEIXIN -->
		<button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
		<button open-type="getPhoneNumber" bindgephonenumber="getUserInfo">微信登录-获取手机号</button>
		<!-- #endif -->


​		
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" @click="applogin">app微信登录</button>
	
		<!-- #endif -->


​	
			methods: {
			   applogin(){
			     uni.getProvider({//获取手机上安装了那些第三方授权app
			       service:'oauth',
			       success：function(){
			           if(~res.provider.indexOf('weixin')){
			              uni.login({
			                 provider:'weixin',
			                 success:function(reslogin){
			                      //这里面就有openid或者unionid，昵称等等
			                 }
			              })
			           }
			       }
			     })
			   },
				getUserInfo(res) {
					if (!res.detail.iv) {
						uni.showToast({
							title: "你取消了授权登录",
							icon: 'none'
						})
					} else {
						//用微信授权登录
						uni.login({
							provider: "weixin",
							success(res1) {
								//关键是这个code
								let code = res1.code;
								//获取sessionkey和openid
								//后端创建一个接口给前端调用test.com， 后端调用接口https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=code&grant_type=authorization_code
								//这个接口返回就有openid，
								uni.request({
									url: "test.com",
									success(res) {
										//
										let openid = res.data.openid;
										let session_key  = res.data.session_key
										//如果符合的话还会返回unionid,（注册了企业的）
										let unionid  = res.data.unionid
										//最后获取明文数据，包含手机号码
										// 后端下载demo生成一个接口test2.com 下载地址https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html
										
										uni.request({
											url:'test2.com',
											method:"post",
											header:{"content-type":"application/x-www-form-urlencoded"},
											data:{
												appid:"your app id",
												sessionKey:session_key,
												iv:res.detail.iv,
												encryptedData:res.detail.encryptedData
											},
											success(lastres) {
												//这里就是最后的数据了,包含手机号的
												
											}
										})
									}
								})
	
							},
							fail() {


​	
							}
						})
					}
	
				}
			}


​		
43.分享接口

  1.小程序的分享方式在uni-app上面只有两种形式， 

```
<button open-type="share">分享</button> 点击按钮就会触发onShareAppMessage
或者点击右上角的分享也会触发到onShareAppMessage
```

 2.h5的分享是浏览器本身，或者调用js-sdk进行分享

  参考连接：https://ask.dcloud.net.cn/article/35380

3.app端的分享可以调用uni.share

```
//分享图文
uni.share({
    provider: "weixin",  //分享到微信
    scene: "WXSceneSession",//分享到聊天界面，WXSenceTimeline为朋友圈
    type: 0,//0为图文，1纯文字，2纯图片，3音乐，4视频，5小程序
    href: "http://uniapp.dcloud.io/",
    title: "uni-app分享",
    summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
    imageUrl: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png",
    success: function (res) {
        console.log("success:" + JSON.stringify(res));
    },
    fail: function (err) {
        console.log("fail:" + JSON.stringify(err));
    }
});

//app分享到小程序
uni.share({
    provider: 'weixin', //分享到微信
    scene: "WXSceneSession",
    type: 5,//5代表小程序
    imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/share-logo@3.png',
    title: '欢迎体验uniapp',
    miniProgram: {
        id: 'gh_abcdefg',//小程序的id
        path: 'pages/index/index',//小程序的路径
        type: 0,
        webUrl: 'http://uniapp.dcloud.io'
    },
    success: ret => {
        console.log(JSON.stringify(ret));
    }
});



```

分享的配置如下：

![image-20200801173017827](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200801173017827.png)

45.iconfont

 在iconfont官网下载鲜明的图标，要inconfont.css的内容，copy到app.vue的style标签下面， 字体url只留下base64类型的

![image-20200801173909757](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200801173909757.png)

  ![image-20200801174302492](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200801174302492.png)

调用：<view class="iconfont icon-name"></view>

46.打包发布

  1.小程序直接配置mainfest.json 的appid就可发布了

  2.android和ios打包请参考：

https://ask.dcloud.net.cn/article/89

https://ask.dcloud.net.cn/article/1232

47.mvc 和mvvm 

​    mvc是后端开发模式，mvc分为三层：m----模型层，v---试图层级，c----控制层

​     整体处理过程：

![image-20200804072804964](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200804072804964.png)

mvvm：第一个model是单页的静态数据，第一个v是页面html，后面的vm就是viewmodel是核心调度者，负责数据model到view的渲染，和从view操作到model的改变

![image-20200804073539617](C:\Users\acert\AppData\Roaming\Typora\typora-user-images\image-20200804073539617.png)





