//转换年月
function formatYearMonthList (dateList,keyName) {
  let arr = [];
  dateList.forEach((item)=>{
    var _time = new Date(item[keyName]);
    var year = _time.getYear();
    var month = _time.getMonth() + 1;
    item[keyName] = "20" + year + "年" + month + "月";
    arr.push(item);
  });
  return arr;
}
module.exports = {
  formatYearMonthList
}