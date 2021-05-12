import axios from 'axios';
const config = require('@/p.config.js');

const isServer = process.env.VUE_ENV == "server"
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