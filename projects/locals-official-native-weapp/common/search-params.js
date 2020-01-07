const { cityCodeList } = require('../utils/dictionary');
const { isEmptyObj } = require('../utils/util');
const { getValidValue, setObjectValue, setAllPropertyUndefined, setOnlyProperty } = require('./search-utils');
const moment = require('../utils/dayjs.min.js');
const { FOREIGN_NAME } = require('./const');

const _tagParams = Symbol('tagParams');
const _dateParams = Symbol('dateParams');
const _sortParams = Symbol('sortParams');
const _roomParams = Symbol('roomParams');
const _cityParams = Symbol('cityParams');
const _keywordParams = Symbol('keywordParams');
const _locationParams = Symbol('locationParams');


// 维护房源列表搜索的请求参数 
class SearchParams {
  constructor(stableData) {
    // 稳定的请求参数,不拷贝undefined和Symbol类型的值
    this.stableData = {
      // 范围
      distance: 6,
      ...JSON.parse(JSON.stringify(stableData))
    };
    this[_dateParams] = {
      endDate: undefined,
      beginDate: undefined,
    };
    // 非稳定的请求参数会被清空
    this[_keywordParams] = {
      // 模糊搜索标题, 存在经纬度时keyword不能传，但需要显示keyword的内容时输出keywordDummy
      keyword: undefined,
      keywordDummy: undefined,
    };
    this[_tagParams] = {
      customTagIds: undefined,
      bizTagIds: undefined,
      poiTagIds: undefined,
      allTagIds: undefined,
    };
    this[_roomParams] = {
      // 相等的床位数
      bedNumberGreaterThanEqual: undefined,
      // 相等的房间数
      roomNumberGreaterThanEqual: undefined,
      // 相等的可住人
      tenantNumberGreaterThanEqual: undefined,
      // 最低价
      priceGreaterThanEqual: undefined,
      // 最高价
      priceLessThanEqual: undefined,
      // 设施
      facilities: undefined,
      // 多选相等的床位数
      bedNumbers: undefined,
      // 多选相等的房间数
      roomNumbers: undefined,
      // 多选相等的可住人数
      tenantNumbers: undefined,
      tenantNumber: undefined,
    };
    this[_sortParams] = {
      // 好评优先: 0, 
      starsSort: undefined,
      // 金额低到高: 1, 金额高到低: 0
      priceSort: undefined,
      // 推荐排序 降序: 0
      rankingSort: undefined,
      distanceSort: undefined,
    };
    this[_locationParams] = {
      poiName: undefined,
      // 经
      longitude: undefined,
      secondLongitude: undefined,
      // 纬
      latitude: undefined,
      secondLatitude: undefined,
    };
    this[_cityParams] = {
      cityName: undefined,
      areaCode: undefined,
      provinceName: undefined,
    }
  }

  getParams = () => {
    const combineParams = {
      ...this.tagParams,
      ...this.dateParams,
      ...this.roomParams,
      ...this.cityParams,
      ...this.sortParams,
      ...this.stableData,
      ...this.keywordParams,
      ...this.locationParams,
    };
    if (
      Reflect.get(combineParams, 'longitude') === undefined 
      && Reflect.get(combineParams, 'latitude') === undefined
    ) {
      Reflect.deleteProperty(combineParams, 'distance');
    }

    // if (this.isForeignCity) {
    //   Reflect.deleteProperty(combineParams, 'beginDate');
    //   Reflect.deleteProperty(combineParams, 'endDate');
    // }

    return combineParams;
  }

  cleanAll = (ignorePreporty = []) => {
    let handleArray = [
      this[_keywordParams], 
      this[_tagParams],
      this[_roomParams], 
      this[_sortParams], 
      this[_locationParams], 
      this[_cityParams]
    ];
    handleArray.forEach(item => {
      setAllPropertyUndefined(item, ignorePreporty);
    })
    handleArray = null;
  }

  /**
   * @param key: 对应Symbol的描述
   * @param ignorePreporty: 忽略数组中的属性
   */
  cleanParams = (key, ignorePreporty = []) => {
    const reg = new RegExp(`${key}`);
    const symbolArray = Reflect.ownKeys(this).filter(item => reg.test(item.toString()));
    if (symbolArray && symbolArray.length > 0) {
      setAllPropertyUndefined(this[symbolArray[0]], ignorePreporty);
      return true;
    } else {
      console.error(`cleanParams方法: ${key} 必须是类中Symbol对应的字符串`);
    }
    return false;
  }

  set keywordParams(obj) {
    setOnlyProperty(this[_keywordParams], obj);
  }

  get keywordParams() {
    return { ...this[_keywordParams] };
  }

  getKeyword = () => {
    const key = getValidValue(this[_keywordParams]);
    return !isEmptyObj(key) ? key[Object.keys(key)[0]] : '';
  }
  
  set tagParams(obj = {}) {
    setObjectValue(this[_tagParams], obj);
  }

  get tagParams() {
    return { ...this[_tagParams] };
  }

  set roomParams(obj = {}) {
    setObjectValue(this[_roomParams], obj);
  }

  get roomParams() {
    return { ...this[_roomParams] };
  }

  get roomParamsChangeTimes() {
    let count = 0;
    const { 
      priceGreaterThanEqual, priceLessThanEqual, facilities,
      bedNumbers, roomNumbers, tenantNumbers
    } = this[_roomParams];
    // 不为undefined则count加1
    const notForUndefinedAddCount = ['priceGreaterThanEqual', 'priceLessThanEqual'];
    // split一下的字符串判断数组长度
    let splitStringToArray = ['facilities', 'bedNumbers', 'roomNumbers', 'tenantNumbers'];
    // 集合
    let paramsSet = {
      ...this[_roomParams],
    }
    if (!this.isForeignCity) {
      splitStringToArray.push('allTagIds');
      paramsSet = {
        ...paramsSet,
        ...this[_tagParams],
      }
    }
    Object
      .keys(paramsSet)
      .forEach(key => {
        if (notForUndefinedAddCount.includes(key) && paramsSet[key] !== undefined) {
          count++;
        }
        if (splitStringToArray.includes(key) && typeof paramsSet[key] === 'string') {
          const arrayTemp = (paramsSet[key] || '').split(',');
          let { length } = arrayTemp;
          // 可入住人数的多项是: [1, 2], [3, 4]为一个值，需要特定处理
          if (key === 'tenantNumbers') {
            // 如果是偶数则是除以2为选择了多少个，奇数则+1，因为最大是一个值
            length = length % 2 === 0 ? length / 2 : (length + 1) / 2; 
          }
          count += length;
        }
      });
    return count;
  }

  set dateParams({ beginDate, endDate }) {
    if (!endDate || !beginDate) {
      console.error('dateParams请设置两个属性endDate,beginDate'); 
      return false;
    }
    const beginDateDummy = moment(moment(beginDate).format('YYYY-MM-DD')).valueOf();
    const endDateDummy = moment(moment(endDate).format('YYYY-MM-DD')).valueOf();
    this[_dateParams] = {
      endDate: endDateDummy,
      beginDate: beginDateDummy,
    }
  }

  get dateParams() {
    const todayTimestamp = moment(moment().format('YYYY-MM-DD')).valueOf();
    const tomorrowTimestamp = moment(moment().add(1, 'day').format('YYYY-MM-DD')).valueOf();
    const { beginDate = todayTimestamp, endDate = tomorrowTimestamp } = this[_dateParams];
    return {
      endDate,
      beginDate,
    }
  }

  set cityParams(obj = {}) {
    setObjectValue(this[_cityParams], obj);
  }

  get cityParams() {
    const { cityName } = this[_cityParams];
    let params = {
      ...this[_cityParams],
    };
    if (cityName) {
      params = {
        ...params,
        cityCode: cityCodeList[cityName],
      }
    }
    // 设置默认城市
    if (
      Reflect.get(params, 'cityName') === undefined
    ) {
      const defaultCity = getApp().globalData.defaultCity;
      Reflect.set(params, 'cityName', defaultCity);
      Reflect.set(params, 'cityCode', cityCodeList[defaultCity]);
    }
    return params;
  }

  // 判断是否国外城市
  get isForeignCity() {
    const { cityName } = this.cityParams;
    if (cityName === FOREIGN_NAME) {
      return true;
    }
    const foreignCity = wx.getStorageSync('foreignCity');
    if (Array.isArray(foreignCity) && foreignCity.length > 0) {
      return foreignCity.some(item => item.name === cityName);
    }
    return false;
  }

  set locationParams(obj = {}) {
    setObjectValue(this[_locationParams], obj);
  }

  get locationParams() {
    return { ...this[_locationParams] };
  }
  
  set sortParams(obj = {}) {
    setOnlyProperty(this[_sortParams], obj);
  }

  get sortParams() {
    let result = getValidValue(this[_sortParams]);
    if (isEmptyObj(result) && this.locationParams.latitude && this.locationParams.longitude) {
      // 选择经纬度时默认选择距离优先
      result = {
        distanceSort: 0,
      }
    }
    if (isEmptyObj(result)) {
      // 默认rankingSort：0
      result = {
        rankingSort: 0
      }
    }
    return result;
  }
}

module.exports = SearchParams;