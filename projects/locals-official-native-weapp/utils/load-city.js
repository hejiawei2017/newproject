const regeneratorRuntime = require('../libs/regenerator-runtime.js');
const { getLocationInfo } = require('../server/map');
const app = getApp();

// 城市定位
const loadCity = async (longitude, latitude, successCallback, failCallback) => {
  try {
    const { data } = await getLocationInfo(`${longitude},${latitude}`);
    const { regeocode } = data;
    let { province, city, streetNumber } = data.regeocode.addressComponent;

    city = typeof city === 'string' ? city : '';
    province = typeof province === 'string' ? province : '';
    city = city ? city : province;

    // 设置用户当前的城市
    if (city) {
      app.globalData.defaultCity = city;
    }
    successCallback && successCallback({ city, streetNumber, regeocode });
  } catch(e) {
    failCallback && failCallback(e);
  }
}

/**
 * 
 * @param {function} success 
 * @param {function} fail 
 */
const getCity = async (successCallback, failCallback) => {
  try {
    let { longitude, latitude } = await app.wechat.getLocation('wgs84')
    await loadCity(longitude, latitude, successCallback, failCallback)
  } catch(e) {
    failCallback && failCallback(e)
  }
}

module.exports = {
  getCity
}