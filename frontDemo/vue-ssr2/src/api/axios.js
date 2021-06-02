import axios from 'axios';
const config = require('@/p.config.js');


const isServer = process.env.WEBPACK_TARGET === 'node'
// console.log("isServer", isServer)
// console.log("isServer", process.env.SYSTEM_TYPE)

if (isServer) {
    //let host = global.ctx.request.header.host;
    //console.log("global.contextUrl", global.ctx.req)
}
export default {
    get(url, param = {}, headers = {}) {
        if (url.substring(0, 1) != '/') {
            url = '/' + url;
        }
        let curl = config.apphead + url;
        if (isServer) {
            curl = config.apphost + curl
        }
        console.log("curl", curl)
        return axios.get(curl, { param, headers });
    },
    post(url, data, headers = {}) {
        if (url.substring(0, 1) != '/') {
            url = '/' + url;
        }
        let curl = config.apphead + url;
        if (isServer) {
            curl = config.apphost + curl
        }
        return axios.post(curl, { ...data }, { headers });
    }
};