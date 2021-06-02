import { createApp } from "./main";

export default (context) => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    // 设置服务器端 router 的位置
    router.push(context.url);
    // 监听路由跳转完成  异步钩子  路由初始化相关异步组件加载完成
    router.onReady(() => {
      // 获取匹配到的组件
      const matchComponents = router.matcher.getRoutes();
      if (matchComponents.length) {
        // 匹配到路由了
        let getAllAsyncDataFn = function (components) {
          let innerArr = [];
          Object.keys(components).forEach((compkey) => {
            let comp = components[compkey];
            if (comp.asyncData) {
              if (typeof comp.asyncData == "object") {
                Object.keys(comp.asyncData).forEach((key) => {
                  innerArr.push(comp.asyncData[key](store));
                });
              } else {
                innerArr.push(comp.asyncData(store));
              }
            }
            if (comp.components) {
              let comchildren = [];
              if (comp.components.default) {
                comchildren.push(comp.components.default);
              } else {
                Object.keys(comp.components).forEach((key) => {
                  comchildren.push(comp.components[key]);
                });
              }
              let childcomp = getAllAsyncDataFn(comchildren);
              innerArr = innerArr.concat(childcomp);
            }
          });
          return innerArr;
        };
        let allasyncDatas = getAllAsyncDataFn(matchComponents);
        console.log("allasyncDatas", allasyncDatas.length);

        // let matchs = matchComponents.map((component) => {
        //   if (component.asyncData) {
        //     //console.log("typeof component.asyncData", typeof component.asyncData)
        //     if (typeof component.asyncData == "object") {
        //       Object.keys(component.asyncData).forEach((key) => {
        //         //console.log(key)
        //         arr.push(component.asyncData[key](store));
        //       });
        //       return Promise.resolve();
        //     }
        //     if (typeof component.asyncData == "function") {
        //       return component.asyncData(store);
        //     }
        //     return Promise.resolve();
        //   }
        // });
        Promise.all([...allasyncDatas]).then(() => {
          // 服务端执行完毕后 渲染的是正常的   但是前段的store是旧的数据
          // 需要将后端的数据同步到vux中
          // 会自动注入到window上  vue-server-renderer注入的
          //console.log("store.state", store.state)
          context.state = store.state; // 将store放到上下文中
          resolve(app); // 路由跳转完成
        });
      } else {
        // 未匹配到路由
        reject({ code: 404 });
      }
    }, reject);
  });
};
