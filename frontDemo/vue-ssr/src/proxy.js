
const config = require('./p.config.js');
const proxy_url = config.proxy_url;
const base_image_url = config.base_image_url;
const download_url = config.download_url;
const apphead = config.apphead;

let backendProxyUrl = apphead + '/access';
module.exports = {
    '/api': {
        target: proxy_url,
        changOrigin: true
    },
    '/gtcommtoo': {
        target: proxy_url,
        changOrigin: true,
        cookieDomainRewrite: 'localhost'
    },

    [backendProxyUrl]: {
        target: proxy_url,
        changOrigin: true,
        cookieDomainRewrite: 'localhost'
    },
    '/do': {
        target: proxy_url,
        changOrigin: true,
        cookieDomainRewrite: 'localhost'
    },

    [base_image_url]: {
        pathRewrite: {
            ['^' + base_image_url]: '' //一般不会重写
        },
        target: proxy_url + apphead + '/',
        changOrigin: true,
        cookieDomainRewrite: 'localhost'
    },
    [download_url]: {
        pathRewrite: {
            ['^' + download_url]: '' //一般不会重写
        },
        target: proxy_url + '/mgr/',
        changOrigin: true,
        cookieDomainRewrite: 'localhost'
    },
    '/uploadfromfront': {
        target: 'http://14.23.157.98:8090',
        changOrigin: true
    }
}