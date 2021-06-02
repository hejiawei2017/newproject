import axios from './axios';
export default {
    // 操作记录埋点
    getUserName(params) {
        //
        return axios.get('/getUserName', params);
    }
};
