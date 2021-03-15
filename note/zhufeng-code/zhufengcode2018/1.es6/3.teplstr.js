let name = 'zfpx', age = 9;
//1.字符串里可以嵌套变量，模板语言很多就是这样的原理
function desc(strings,...values){
  console.log(strings);
  console.log(values);
  let result='';
  for(let i=0;i<values.length;i++){
    result += (strings[i]+values[i]);
  }
  result += strings[strings.length-1];
  return result.toUpperCase();
}
//带标签的模板字符串就像一个函数调用,参数1是文本的数组，参数2是变量的数组
let str = desc`${name} 今年${age} 岁了`;
console.log(str);
