import React, {Component} from 'react'
import LoginFrom from './login.js'
import './login.less'
export default class Login extends Component {
    render () {
        return (
            <div className="login-page">
                <div className="login-content">
                    <div className="ivu-card">
                        <div className="ivu-card-head">
                            <p>
                                <i className="iconfont icon-login" />
                                欢迎登录Locals管理后台
                            </p>
                        </div>
                        <div className="ivu-card-body">
                            <LoginFrom />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
