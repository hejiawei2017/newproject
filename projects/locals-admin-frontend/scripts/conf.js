const CI_HOST = 'http://39.108.138.206:7680'
const conf = {
    PROJECTS: [
        'locals-admin-frontend'
    ],
    CI_HOST,
    AUTH: '13726775514:darkangel',
    getJenkinsBuildUrl: project => `${CI_HOST}/job/${project}/lastBuild/api/json`,
    WORK_WECHAT_GET_TOKEN_URL: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
    WORK_WECHAT_SEND_MSG_URL: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=',
    CORP_ID: 'wxe089f629682a30f0',
    CORP_SECRET: 'AqchU3XhCoIOoXkfPkXC3byZ9YesgnD9BIuJIZdD8GM',
    AGENT_ID: 1000015
}

module.exports = conf