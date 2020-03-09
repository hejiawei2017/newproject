/*
 * @Author: terenyeung
 * @Date: 2018-09-17 14:25:47
 * @Last Modified by: terenyeung
 * @Last Modified time: 2018-09-17 14:53:50
 */

const { exec } = require('child_process');
const request = require('request');
const conf = require('./conf')

class WorkWeChatRobot {
    /**
     * @param {Object} opts 企业微信机器人配置参数
     * opts 参数包括：
     * JENKINS_BUILD_URL: 对应项目下的 jenkins 最后一次构建信息接口
     * AUTH: 访问 jenkins 的用户名和密码
     * WORK_WECHAT_GET_TOKEN_URL: 企业微信基于 corpid 和 corpsecret 获取 token 接口
     * CORP_ID: 企业 ID，从企业微信后台获取
     * CORP_SECRET: 企业秘钥，从企业微信后台自定义应用处获取
     * AGENT_ID：自定义应用 ID，从企业微信后台自定义应用处获取
     * WORK_WECHAT_SEND_MSG_URL: 发送应用消息接口，详见：https://work.weixin.qq.com/api/doc#10167
     */
    constructor(opts) {
        this.__OPTS__ = opts
        this.init(opts)
    }

    // 获取本次 jenkins 的构建信息
    static _getBuildMsg(url, auth) {
        return new Promise((resolve, reject) => {
            exec(`curl ${url} --user ${auth}`, (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(stdout)
                }
            })
        })
    }

    // 格式化预警信息
    static _formatAlertMsg(msg) {
        let {
            changeSet: {
                items
            }
        } = JSON.parse(msg)
        let detail = items[0] || {}
        let text = `
            [status]: ${JSON.parse(msg).result};
            [project]: ${JSON.parse(msg).fullDisplayName.split(' ')[0]};
            [author]: <a href="${detail.authorEmail || ''}">${(detail.author && detail.author.fullName) || ''}</a>;
            [commit_id]: ${(detail.commitId && (detail.commitId.slice(0, 7))) || ''};
            [commit_date]: ${new Date(detail.timestamp || Date.now())};
            [commit_msg]: ${detail.comment || ''}
        `
        let formatText = text.split(';').map(item => item.trim()).join('\n')
        return formatText
    }

    // 获取企业微信 token
    static _getWorkWechatToken(URL, corpid, corpsecret) {
        return new Promise((resolve, reject) => {
            request(`${URL}?corpid=${corpid}&corpsecret=${corpsecret}`, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    let data = JSON.parse(body)
                    if (data.errcode !== 0) {
                        reject(data.errmsg)
                    } else {
                        resolve(data.access_token)
                    }
                }
            })
        })
    }

    static _sendAlertMsg (URL, ACCESS_TOKEN, opts) {
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: `${URL}${ACCESS_TOKEN}`,
                json: opts,
            }, (err, res, body) => {
                if (err) {
                    reject(err)
                } else {
                    if (body.errcode !== 0) {
                        reject(body.errmsg)
                    } else {
                        resolve()
                    }
                }
            })
        })
    }

    // 对外暴露的实例化对象接口
    static run(opts) {
        return new WorkWeChatRobot(opts)
    }

    // 主代码逻辑
    init(opts) {
        const {
            JENKINS_BUILD_URL,
            AUTH,
            WORK_WECHAT_GET_TOKEN_URL,
            CORP_ID,
            CORP_SECRET,
            AGENT_ID,
            WORK_WECHAT_SEND_MSG_URL
        } = opts

        WorkWeChatRobot._getBuildMsg(
            JENKINS_BUILD_URL,
            AUTH,
        )
            .then(res => {
                let formatText = WorkWeChatRobot._formatAlertMsg(res)

                WorkWeChatRobot._getWorkWechatToken(WORK_WECHAT_GET_TOKEN_URL, CORP_ID, CORP_SECRET)
                    .then(token => {
                        let opts = {
                            msgtype: "text",
                            agentid: conf.AGENT_ID,
                            text: {
                                content: formatText,
                            },
                            touser: '@all',
                            safe: 0
                        }

                        WorkWeChatRobot._sendAlertMsg(WORK_WECHAT_SEND_MSG_URL, token, opts)
                            .then(() => {
                                console.log('CI Msg has already sent.')
                            })
                            .catch(err => {
                                console.error(`error from sendAlertMsg: ${err}`)
                            })
                    })
                    .catch(err => {
                        console.error(`error from getWorkWechatToken: ${err}`)
                    })
            })
            .catch(err => {
                console.error(`error from getBuildMsg: ${err}`)
            })
    }
}

let COMMON_OPTS = {
    AUTH: conf.AUTH,
    WORK_WECHAT_GET_TOKEN_URL: conf.WORK_WECHAT_GET_TOKEN_URL,
    WORK_WECHAT_SEND_MSG_URL: conf.WORK_WECHAT_SEND_MSG_URL,
    CORP_ID: conf.CORP_ID,
    CORP_SECRET: conf.CORP_SECRET,
    AGENT_ID: conf.AGENT_ID,
}

const OPTSLIST = conf.PROJECTS.map(proj => {
    return {
        ...COMMON_OPTS,
        JENKINS_BUILD_URL: conf.getJenkinsBuildUrl(proj)
    }
})

OPTSLIST.forEach(opts => {
    WorkWeChatRobot.run(opts)
})
