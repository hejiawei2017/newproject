// new KVue({data:{...}})

class KVue {
  constructor(options) {
    this.$options = options;

    // 数据响应化
    this.$data = options.data;
    this.observe(this.$data);

    // 模拟一下watcher创建
    // new Watcher();
    // // 通过访问test属性触发get函数，添加依赖
    // this.$data.test;
    // new Watcher();
    // this.$data.foo.bar;

    //在真实的vue的Compile中，字符串模版会先生成ast树，
    //根据ast树上不同的节点，属性，事件，生成不同update函数，最终生成render调用字符串
    //new Function 得到真正的渲染函数。数据发现变化后，会执行 Watcher 中的 _update 函数,
    //_update 函数会执行这个渲染函数，输出一个新的 VNode 树形结构的数据。
    //然后在调用 patch 函数，拿这个新的 VNode 与旧的 VNode 进行对比，
    //只有发生了变化的节点才会被更新到真实 DOM 树上



    new Compile(options.el, this);

    // created执行
    if (options.created) {
        options.created.call(this);
    }
  }

  observe(value) {
    if (!value || typeof value !== "object") {
      return;
    }

    // 遍历该对象
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key]);
    //   代理data中的属性到vue实例上
      this.proxyData(key);
    });
  }

  // 数据响应化
  defineReactive(obj, key, val) {
    this.observe(val); // 递归解决数据嵌套

    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        // console.log(`${key}属性更新了：${val}`);
        dep.notify();
      }
    });
  }

  proxyData(key) {
      Object.defineProperty(this, key, {
          get(){
            return this.$data[key]
          },
          set(newVal){
            this.$data[key] = newVal;
          }
      })
  }

}

// Dep：用来管理Watcher
class Dep {
  constructor() {
    // 这里存放若干依赖（watcher）
    this.deps = [];
  }

  addDep(dep) {
    this.deps.push(dep);
  }

  notify() {
    this.deps.forEach(dep => dep.update());
  }
}

// Watcher
class Watcher {
  constructor(vm, key, cb) {
      this.vm = vm;
      this.key = key;
      this.cb = cb;

    // 将当前watcher实例指定到Dep静态属性target
    Dep.target = this;
    this.vm[this.key]; // 触发getter，添加依赖
    Dep.target = null;
  }

  update() {
    // console.log("属性更新了");
    this.cb.call(this.vm, this.vm[this.key]);
  }
}
