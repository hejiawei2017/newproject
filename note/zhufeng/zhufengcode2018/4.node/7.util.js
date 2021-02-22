let util = require('util');
let obj = {
  name: 'zfpx', home: {
    city: { name: 'beijing' }
  }
};
console.log(obj);
console.log(util.inspect(obj, { depth: 2 }));//检查输出对象信息，depth为检查的深度
