// 返回一个有效的值
export const getValidValue = (object = {}) => {
  if (typeof object !== 'object') { 
    console.warn('args must be Object');
    return false; 
  }
  let result = {};
  Object
    .keys(object)
    .some(key => {
      // 过滤 undefined 和 null
      if (object[key] != null) {
        result[key] = object[key];
        return true;
      }
      return false;
    })
  return result;
}

export const setObjectValue = (property = {}, obj = {}) => {
  if (typeof property !== 'object' || typeof obj !== 'object') { 
    console.warn('args must be Object');
    return false; 
  }
  Object
    .keys(obj)
    .forEach(key => {
      if (!(key in property)) {
        console.warn(`params中没有${key}属性`);
      } else {
        property[key] = obj[key];
      }
    })
}

export const setAllPropertyUndefined = (obj = {}, ignorePreporty = []) => {
  if (!Array.isArray(ignorePreporty)) {
    console.error('ignorePreporty 必须是数组!');
  }
  Object.keys(obj).forEach(key => {
    if (!ignorePreporty.includes(key)) {
      obj[key] = undefined
    }
  })
}

export const setOnlyProperty = (property, obj = {}) => {
  if (typeof property !== 'object' || typeof obj !== 'object') { 
    console.warn('args must be Object');
    return false; 
  }
  const keys = Object.keys(obj);
  if (keys.length > 1) {
    console.warn('obj length must be 1');
  }
  // 只存在一个字段
  Object
    .keys(property)
    .forEach(k => {
      property[k] = undefined;
    })
  const resultObj = {
    [keys[0]]: obj[keys[0]],
  }
  setObjectValue(property, resultObj)
}