import axios from './axios';
export default {
    // 操作记录埋点
    test(params) {
        return axios.get('/loadData', params);
    }

};
