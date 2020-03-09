# 路客活动后端服务


## 目录

* [快速入门](#快速入门)
  * [controller](#controller)
  * [service](#service)
  * [model](#model)
    * [migration](#migration)
  * [core](#core)
  * [constants](#constants)
  * [错误码](#错误码)
  * [路由](#路由)
  * [启动脚本](#启动脚本)
* [目录结构](#目录结构)
* [本地开发](#本地开发)
* [部署](#部署)
* [单元测试](#单元测试)
* [内置指令](#内置指令)


### 快速入门

<!-- 在此次添加使用文档 -->
请务必先了解 [egg 文档][egg]。  
本项目按照 egg 官方约定搭建基础项目结构，根据 egg 提供的功能扩展出 `apis`、`constants`、`model`、`utils` 目录, 这些目录均已不同形式的方式挂载在 `app/ctx` 上。  
我们所有的活动接口均放在这一个服务下，在不新增服务的情况下，在 `controller` `service` 下通过目录区分各个模块, 每个模块的功能应该尽可能满足**某一类业务**。

#### controller

**Controller 负责解析用户的输入，处理后返回相应的结果**, 在 `controller` 中，应该只负责处理请求数据的校验、转换，与响应在 `service` 中处理的结果,  
请求数据的校验与转换依赖官方的 `egg-validate`, 所以可以通过 `this.ctx.validate(rule, this.request.body)` 的形式调用，因为对于校验失败的处理方式基本一致，所以封装了 `this.ctx.filter` 方法, 该方法如果失败， 则响应`参数异常`消息体，并返回空， 否则则返回过滤后的请求体  
在 `service` 中处理完数据后， 会返回一个带状态码的结果（这是经过反复推敲后决定 service 中应该不只返回数据）， 这个结果可以使用 `this.response.auto` 响应。  
`controller` 可能还会处理一些其他事就而不经过 `service` 就返回了， 对此可以使用 `this.response.success` 与 `this.response.fail` 进行响应, 这三个方法均通过 egg 的 extend 约定挂载在 response 上。

#### service
**Service 就是在复杂业务场景下用于做业务逻辑封装的一个抽象层**， 在 service 中，推荐处理所有的业务逻辑， 包括与 model 的交互、请求转发等等，对此，在 service 中新增了一些快捷方式用于访问 `model`, `请求数据`等，  
`service` 是最贴近异常的一层，但是它不应该直接响应数据给客户端（存在多处响应会导致问题排查增加难度）， 所以他需要返回带有状态码的信息给 `controller`, 再通过 `controller` 进行响应。

#### model
**Model 负责处理持久层的逻辑**， `model` 依赖第三方 `egg-sequelize` 与 `sequelize`， 能够避免手写 SQL 语句与避免 SQL 注入，解放双手，让开发者更专注写业务逻辑, 在 `启动脚本` 中会自动生成 `model` 的定义文件， 会自动输出到 `model-define` 中，如果需要使用， 还需要在 `model` 中引入对应的 `model-define` 文件，`egg-sequelize` 会自动将 `model` 下的文件挂载到 `app` 上。  

##### migration
对于 sql 表新增、删除、字段修改等操作均统一利用 `migration` 执行， `migration` 的命名规则为 `操作类型_表_时间`, 在 `migrations` 目录下的文件会在`启动脚本`执行的时候自动运行。  
开发者可通过 [migrations 文档](migrations) 查阅相关 API

#### 路由
路由提供了分组功能, 每一个组通过 `router.group` 进行分组， 利用 `{}` 进行划分只是让模块显得有隔离并非强制

#### 启动脚本
启动脚本负责启动前的一些操作， 如：探测 mysql、redis 是否连通，生成 model define 文件，执行 migration 操作等, 脚本中通过 `LOCALS_ENV` 进行环境判断。

### 目录结构
|目录名称|作用|备注|
|:--|--|--:|
|apis|封装所有请求接口，不应该在业务中直接调用接口，避免后期接口修改而增加维护成本|this.app.api[模块][方法]|
|constants|存放所有常量，各种状态码，魔数等|this.app.const[模块][变量]|
|controller|egg 约定, 控制器|app.controller|
|core|基础类||
|extend|egg 约定, 扩展的到各个属性的方法||
|midlleware|egg 约定, 中间件|app.midlleware|
|model|egg 约定, model|app.model_hd|
|model-define|model 定义文件, 自动生成的文件，不应该修改||
|service|egg 约定 service|this.service|
|utils|工具类|app.util|
|cli|存放启动脚本等||
|config|全局配置文件|app.config|
|lib|一些第三方依赖的配置文件||
|migrations| migrations sql 升级目录||
|models| migrations 所依赖的目录||
|app.js| 入口文件||
|database.js| migrations 所依赖的文件||

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

### 单元测试

- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [egg 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[egg]: https://eggjs.org
[migrations]: https://sequelize.readthedocs.io/en/v3/docs/migrations/
