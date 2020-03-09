'use strict';

/**
 * 序列化数组
 * @param { Array<Object> } array 源数组
 * @param { String } flag 数组中作为对象的 key 的属性
 * @return { Object } 返回处理后的对象
 *
 * [{ a: 1, b: 2 }, { a: 2, b: 2 }] => normalize(array, 'a') => { 1: {a: 1, b: 2}, 2: {a: 2, b:2} }
 */
exports.normalize = function(array = [], flag = 'id') {
  if (!array || !array.length) {
    return {};
  }

  return array.reduce(
    (newData, currentData) => ({ [currentData[flag]]: currentData, ...newData }),
    {}
  );
};
