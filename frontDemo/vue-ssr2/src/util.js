
let utils = {
    getQueryVariable(variable) {
        var query = window.location.href.split('?');
        if (query.length > 2) {
            let queryConnect = [];
            for (let i = 1, l = query.length; i < l; i++) {
                queryConnect.push(query[i]);
            }
            query = queryConnect.join('&');
        } else {
            query = query[1];
        }
        if (!query) {
            return false;
        }
        query = query.replace('==', '**');
        if (query) {
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                let value = pair[1];
                if (pair.length > 2) {
                    //一个等号的情况
                    value = value + '=';
                }
                if (pair[0] == variable) {
                    value = value.replace('**', '==');
                    return decodeURIComponent(value);
                }
            }
        }
        return false;
    },
    setSysTemTypeByParam() {

        let systemType = utils.getQueryVariable("systemType");
        if (systemType && process.env.SYSTEM_TYPE) {
            //process.env.SYSTEM_TYPE = systemType
        }
    }
}
export default utils