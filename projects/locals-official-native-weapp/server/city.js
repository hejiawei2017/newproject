const request = require('../utils/request.js')

function getCityList (data) {
    return request.get('base/china-areas', data)
}

function fetchForeignCity() {
    return request.get('weapp/forgein-city NODE');
}

module.exports = {
    getCityList,
    fetchForeignCity,
}