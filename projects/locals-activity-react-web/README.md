# locals 构建活动页脚手架(React)

## 开发流程:

```
// 创建活动目录
npm run new <activity>

npm run start <activity>
```

## 打包部署到 oss:

### 1. 设置部署文件可访问

```
chmod +x ./cli/deploy.sh
```

### 2. 执行

```
./cli/deploy.sh
```

### 3. 根据活动来输入即可

0. 确保活动项目中的 deploy.json 中 activity_id 的值存在
1. 活动项目名(文件夹名)
2. 是否覆盖线上版本？是则覆盖，否则不覆盖此时发布的版本只能用版本号访问
3. end

## 获取活动 ID：

接口： https://i.localhome.cn/api/activity_admin/activity

参数：

|字段        |说明                                   |类型        |默认值|是否必填|
|:------    |-------                                |-------    |-------|--------| 
|name       |活动名                                  |string     |无|必填|
|start_time |活动开始时间                             |number     |无|必填|
|end_time   |活动结束时间                             |number     |无|必填|
|state      |是否强制发布,不受开始结束时间限制            |number     |0|选填|
|formal     |活动类型，区分品牌活动(1)和非品牌活动(其他)   |number     |1|选填|


```
{
    "name": "abc",
    "start_time": 1557072000000,
    "end_time": 1557244800000,
    "state": 0,
    "formal": 1
}
```

举个栗子：
window.fetch('https://i.localhome.cn/api/activity_admin/activity',{
	body:JSON.stringify({
	    'name': '暑期助力活动测试 2019',
	    'start_time': new Date('2019-07-08 00:00:00:000').getTime(),
	    'end_time': new Date('2099-12-30 00:00:00:000').getTime(),
	    'state': 0,
	    'formal': 1
	}),
	headers: {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json; charset=UTF-8'
	},
	method:'post'
}).then(res=>res.json())
.then(res=>console.log(`活动ID为：${res.data}`))
