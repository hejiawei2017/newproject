//目的是获取圆周率前100位
function BigNum(str, n, b) {
  /*
   BigNum -- 大数类
   私有成员：
     data -- 119 位数字，放在长度为 17 的数组里，每个数组元素存放 7 位数字。
     decimal_place -- 小数点的位置，从最左位开始算。data数组的索引
     positive -- 是否是正数。
     recalc() -- 为了尽可能存放最多的有效数位，去除前缀的 0，并重新计算小数点位置。
     init() -- 部分初始化工作。
   公有成员：
     BigNum( String str, INT n, BOOL b) --构造函数。
       参数：
         str -- 字符串，各个有效数位；
         n -- 整数，小数点位置，从最左位开始算，比如 BigNum("123", 2) = 12.3; BigNum("123", 0) = 0.123;
              BigNum("123", -2) = 0.00123；
         b -- 布尔值，是否是正数。
     Add( BigNum num ) -- 加法。
     Subtract( BigNum num ) -- 减法。
     Multiply( BigNum num ) -- 乘法。
     Divide( BigNum num ) -- 除法。
     SquareRoot() -- 平方根。
     toString() -- 转换为字符串（包括小数点），以便以文本形式输出计算结果。
     Clone() -- 复制。
  */
  /* 去除前缀的 0，并重新计算小数点位置 */
  this.recalc = function () {
    for (var i = 0; i < 17; i++) {
      if (this.data[0] != 0) break;
      this.data.shift();
      this.data.push(0);
      this.decimal_place--;
    }
  }
  /* 部分初始化工作 */
  this.init = function () {
    this.decimal_place = Math.ceil(n / 7); //小数点位置
    this.data = new Array(17); //保存有效数位的数组
    if (n % 7 > 0) {
      var arr = new Array(8 - n % 7);
    } else {
      var arr = new Array(1 - n % 7);
    }
    str = arr.join("0") + str;
    if (str.length > 119) {
      str = str.substr(0, 119);
    } else if (str.length < 119) {
      var arr = new Array(120 - str.length);
      str += arr.join("0");
    }
    //str长度为119
    for (var i = 0; i < 17; i++) {
      this.data[i] = parseInt(str.substr(i * 7, 7), 10);
    }
  }
  /* 初始化开始 */
  this.positive = b;
  if (!/^0*$/.test(str)) {
    //不是0开头
    this.init();
    this.recalc();
  } else {
    //0开头
    this.data = new Array(17);
    for (var i = 0; i < 17; i++) {
      this.data[i] = 0;
    }
    this.decimal_place = 0;
  }
  /* 初始化结束 */
  /* 加法 */
  this.Add = function (num) {
    if (this.positive && !num.positive) {
      num.positive = true;
      var result = this.Subtract(num);
      num.positive = false;
      return result;
    }
    else if (num.positive && !this.positive) {
      this.positive = true;
      var result = num.Subtract(this);
      this.positive = false;
      return result;
    }
    var result = new BigNum("", 0, this.positive);
    var num1, num2;
    if (this.decimal_place >= num.decimal_place) {
      num1 = this;
      num2 = num;
    } else {
      num1 = num;
      num2 = this;
    }
    result.decimal_place = num1.decimal_place;
    if (num1.decimal_place - num2.decimal_place >= 17) {
      //这种情况已经超出精度范围
      for (var i = 0; i < 17; i++) {
        result.data[i] = num1.data[i];
      }
      return result;
    }
    var nOffDec = num1.decimal_place - num2.decimal_place;
    var nTmp = 0;
    for (var i = 16; i >= 0; i--) {
      var nTmp1 = i - nOffDec;
      var nTmp2 = 0;
      if (nTmp1 >= 0) {
        nTmp2 = num1.data[i] + num2.data[nTmp1];
      } else {
        nTmp2 = num1.data[i];
      }
      nTmp2 += nTmp;
      nTmp = Math.floor(nTmp2 / 10000000);
      result.data[i] = nTmp2 % 10000000;
    }
    if (nTmp > 0) {
      result.data.unshift(nTmp);
      result.decimal_place++;
    }
    return result;
  }
  /* 减法 */
  this.Subtract = function (num) {
    if (this.positive && !num.positive) {
      num.positive = true;
      var result = this.Add(num);
      num.positive = false;
      return result;
    }
    else if (!this.positive && num.positive) {
      this.positive = true;
      var result = this.Add(num);
      result.positive = false;
      this.positive = false;
      return result;
    }
    else {
      var num1 = num2 = null;
      var bPositive;
      if (this.decimal_place > num.decimal_place) {
        num1 = this;
        num2 = num;
        bPositive = this.positive;
      }
      else if (this.decimal_place < num.decimal_place) {
        num1 = num;
        num2 = this;
        bPositive = !this.positive;
      }
      else {
        for (var i = 0; i < 17; i++) {
          if (this.data[i] > num.data[i]) {
            num1 = this;
            num2 = num;
            bPositive = this.positive;
            break;
          }
          else if (this.data[i] < num.data[i]) {
            num1 = num;
            num2 = this;
            bPositive = !this.positive;
            break;
          }
        }
      }
      if (num1 == null) {
        return new BigNum("", 0, true);
      }
      else {
        if (num1.decimal_place - num2.decimal_place >= 17) {
          var result = new BigNum("", 0, bPositive);
          for (var i = 0; i < 17; i++) {
            result.data[i] = num1.data[i];
          }
          result.decimal_place = num1.decimal_place;
          return result;
        }
        var result = new BigNum("", 0, bPositive);
        result.decimal_place = num1.decimal_place;
        var nOffDec = num1.decimal_place - num2.decimal_place;
        var nTmp = 0;
        for (var i = 16; i >= 0; i--) {
          var nTmp1 = i - nOffDec;
          var nTmp2 = 0;
          if (nTmp1 >= 0) {
            nTmp2 = 10000000 + nTmp + num1.data[i] - num2.data[nTmp1];
          }
          else {
            nTmp2 = 10000000 + nTmp + num1.data[i];
          }
          if (nTmp2 >= 10000000) {
            result.data[i] = nTmp2 - 10000000;
            nTmp = 0;
          }
          else {
            result.data[i] = nTmp2;
            nTmp = -1;
          }
        }
        result.recalc();
        return result;
      }
    }
  }
  /* 乘法 */
  this.Multiply = function (num) {
    var bPositive;
    var nDecimalPlace = this.decimal_place + num.decimal_place - 1;
    if (this.positive == num.positive) {
      bPositive = true;
    }
    else {
      bPositive = false;
    }
    var result = new BigNum("", 0, bPositive);
    var nTmpData = 0;
    for (var i = 16; i >= 0; i--) {
      for (var j = 16; j >= 0; j--) {
        if (isNaN(result.data[j + i]))
          result.data[j + i] = 0;
        result.data[j + i] += this.data[j] * num.data[i];
        if (result.data[j + i] >= 10000000) {
          if (j + i - 1 >= 0) {
            result.data[j + i - 1] += Math.floor(result.data[j + i] / 10000000);
          }
          else {
            nTmpData += Math.floor(result.data[j + i] / 10000000);
          }
          result.data[j + i] = result.data[j + i] % 10000000;
        }
      }
    }
    if (nTmpData > 0) {
      result.data.unshift(nTmpData);
      result.data.pop();
      nDecimalPlace++;
    }
    result.decimal_place += nDecimalPlace;
    return result;
  }
  /* 除法 */
  this.Divide = function (num) {
    var bPositive;
    var nDecimalPlace = this.decimal_place - num.decimal_place + 1;
    if (this.positive == num.positive) {
      bPositive = true;
    }
    else {
      bPositive = false;
    }
    var result = new BigNum("", 0, bPositive);
    var arrTemp = new Array(17);
    for (var i = 0; i < 17; i++) {
      arrTemp[i] = this.data[i];
    }
    var bTest = true;
    var nTest = 0;
    for (var i = 0; i < 17; i++) {
      if (bTest) {
        nTest = Math.floor((arrTemp[0] * 10000000 + arrTemp[1]) / (num.data[0] * 10000000 + num.data[1]));
      }
      else {
        bTest = true;
      }
      if (nTest == 0) {
        result.data[i] = 0;
        arrTemp[1] += arrTemp[0] * 10000000;
        arrTemp.shift();
        arrTemp.push(0);
        continue;
      }
      var arrTemp1 = new Array(17);
      for (var j = 0; j < 17; j++) {
        arrTemp1[j] = 0;
      }
      for (var j = 16; j >= 0; j--) {
        arrTemp1[j] += nTest * num.data[j];
        if (arrTemp1[j] >= 10000000) {
          if (j != 0) {
            arrTemp1[j - 1] += Math.floor(arrTemp1[j] / 10000000);
            arrTemp1[j] = arrTemp1[j] % 10000000;
          }
        }
      }
      for (var j = 0; j < 17; j++) {
        if (arrTemp[j] < arrTemp1[j]) {
          bTest = false;
          break;
        }
        else if (arrTemp[j] > arrTemp1[j]) {
          break;
        }
      }
      if (bTest) {
        result.data[i] = nTest;
        for (var j = 16; j >= 0; j--) {
          if (arrTemp[j] >= arrTemp1[j]) {
            arrTemp[j] -= arrTemp1[j];
          }
          else {
            arrTemp[j] = 10000000 + arrTemp[j] - arrTemp1[j];
            arrTemp[j - 1]--;
          }
        }
      }
      else {
        nTest--;
        i--;
        continue;
      }
      arrTemp[1] += arrTemp[0] * 10000000;
      arrTemp.shift();
      arrTemp.push(0);
    }
    result.decimal_place = nDecimalPlace;
    result.recalc();
    return result;
  }
  /* 平方根 */
  this.SquareRoot = function () {
    var result = new BigNum("", 0, true);
    nDecimalPlace = Math.ceil(this.decimal_place / 2);
    var arrTemp = new Array(17);
    for (var i = 0; i < 17; i++) {
      arrTemp[i] = this.data[i];
    }
    var bTest = true;
    for (var i = 0; i < 17; i++) {
      if (i == 0) {
        if (this.decimal_place % 2 == 0) {
          var nTemp = arrTemp[0] * 10000000 + arrTemp[1];
          var nTemp1 = Math.floor(Math.sqrt(nTemp));
          var nTemp2 = nTemp - nTemp1 * nTemp1;
          arrTemp[0] = 0;
          arrTemp[1] = nTemp2;
          arrTemp.shift();
          arrTemp.push(0);
        }
        else {
          var nTemp1 = Math.floor(Math.sqrt(arrTemp[0]));
          var nTemp2 = arrTemp[0] - nTemp1 * nTemp1;
          arrTemp[0] = nTemp2;
        }
      }
      else {
        if (bTest) {
          if (i == 1) {
            nTemp1 = Math.sqrt((arrTemp[0] * 10000000 + arrTemp[1]) + 100000000000000 * Math.pow(result.data[0], 2)) - 10000000 * result.data[0];
            nTemp1 = Math.floor(nTemp1);
          }
          else {
            nTemp = result.data[0] * 10000000 + result.data[1];
            nTemp1 = Math.floor((arrTemp[0] * 10000000 + arrTemp[1]) / (2 * nTemp));
          }
        }
        else {
          bTest = true;
        }
        var arrTemp1 = new Array(17);
        var nTemp3 = 0
        for (var j = i - 1; j >= 0; j--) {
          arrTemp1[j] = result.data[j] * 2 + nTemp3;
          if (arrTemp1[j] >= 10000000 && j > 0) {
            nTemp3 = 1;
            arrTemp1[j] = arrTemp1[j] % 10000000;
          }
          else {
            nTemp3 = 0;
          }
        }
        arrTemp1[i] = nTemp1;
        nTemp3 = 0;
        for (var j = i; j >= 0; j--) {
          arrTemp1[j] = arrTemp1[j] * nTemp1 + nTemp3;
          if (arrTemp1[j] >= 10000000 && j > 0) {
            nTemp3 = Math.floor(arrTemp1[j] / 10000000);
            arrTemp1[j] = arrTemp1[j] % 10000000;
          }
          else {
            nTemp3 = 0;
          }
        }
        var arrTemp2 = new Array(17);
        for (var j = 0; j < 17; j++) {
          arrTemp2[j] = arrTemp[j];
        }
        for (var j = i; j >= 0; j--) {
          if (arrTemp2[j] >= arrTemp1[j]) {
            arrTemp2[j] -= arrTemp1[j];
          }
          else {
            if (j > 0) {
              arrTemp2[j] = arrTemp2[j] + 10000000 - arrTemp1[j];
              arrTemp2[j - 1]--;
            }
            else {
              bTest = false;
              break;
            }
          }
        }
        if (bTest) {
          arrTemp = arrTemp2;
        }
        else {
          nTemp1--;
          i--;
          continue;
        }
      }
      result.data[i] = nTemp1;
      arrTemp[1] += arrTemp[0] * 10000000;
      arrTemp.shift();
      arrTemp.push(0);
    }
    result.decimal_place = nDecimalPlace;
    result.recalc();
    return result;
  }
  /* 转换为字符串（包括小数点），以便以文本形式输出计算结果 */
  this.toString = function () {
    var szData = "";
    var szOutPut = "";
    this.recalc();
    for (var i = 0; i < 17; i++) {
      var szTmpData = this.data[i].toString()
      var arr = new Array(8 - szTmpData.length);
      szData += arr.join("0") + szTmpData;
    }
    if (/^0*$/.test(szData)) {
      return "0";
    }
    var n = this.decimal_place * 7;
    for (var i = 0; i < 7; i++) {
      if (szData.substr(i, 1) != 0) break;
      n--;
    }
    szData = szData.replace(/^0+/g, "");
    szData = szData.substr(0, 101);
    szData = szData.replace(/0+$/g, "");
    if (n < 1) {
      szOutPut = szData.substr(0, 1) +
        ((szData.length > 1) ? "." : "") +
        szData.substr(1) + "e" + (n - 1).toString();
    }
    else if (n == szData.length) {
      szOutPut = szData;
    }
    else if (n > szData.length) {
      szOutPut = szData.substr(0, 1) + "." + szData.substr(1) + "e+" + (n - 1).toString();
    }
    else {
      szOutPut = szData.substr(0, n) + "." + szData.substr(n);
    }
    return (this.positive ? "" : "-") + szOutPut;
  }
  /* 复制 */
  this.Clone = function () {
    var result = new BigNum("", 0, true);
    for (var i = 0; i < 17; i++) {
      result.data[i] = this.data[i];
    }
    result.decimal_place = this.decimal_place;
    result.positive = this.positive;
    return result;
  }
}

var a = new BigNum("1", 1, true)//假设半径为1
var count = 168;
var nTwo = new BigNum("2", 1, true);

/**
 *intTmpvar 上一次分割的边长(正多边形边长)
 */
function loop(intTmpvar, intCount) {
  if (intCount == 0) return intTmpvar;
  var v1 = intTmpvar.Divide(nTwo);
  var v11 = v1.Clone();
  var nTemp = v1.Multiply(v11);
  var a1 = a.Clone();
  a1 = a.Multiply(a1);
  var nTemp1 = a1.Subtract(nTemp)
  v2 = nTemp1.SquareRoot();
  v3 = a.Subtract(v2);
  var v31 = v3.Clone();
  var nTemp2 = v3.Multiply(v31);
  var nTemp3 = nTemp2.Add(nTemp);
  v4 = nTemp3.SquareRoot();
  return loop(v4, --intCount)
}

var a1 = a.Clone();
nTemp = loop(a1, count);//分割count次后的正多边行边长
nTemp1 = new BigNum("6", 1, true);//初始状态是正6边行
var nTemp2 = new BigNum("2", 1, true);
//分割count次后有多少条边
for (var i = 0; i < count; i++) {
  nTemp1 = nTemp1.Multiply(nTemp2);
}
//计算圆周率，周长除以2r
nTemp = nTemp.Multiply(nTemp1);//周长
nTemp = nTemp.Divide(nTwo);
nTemp = nTemp.Divide(a);
console.log(nTemp.toString());