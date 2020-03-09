import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './style.less'

class Login404 extends Component {
    render () {
        return (
            <div className="main">
                <div className="text">
                    <div className="left">
                        <h2>404</h2>
                    </div>
                    <div className="right">
                        <h4>请重新登录</h4>
                        <Link to="/login">Go Login</Link>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="footer">
                </div>
            </div>
        )
    }
}
export default Login404