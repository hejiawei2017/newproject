import React from 'react'
import { Skeleton } from 'antd'

export default function LoadingComponent ({ error, pastDelay }) {
    let reg = /login/
    if (error) {
        console.log(error)
        return <div>网络问题，请刷新浏览器，重新加载。</div>
    } else if (pastDelay) {
        if (reg.test(window.location.href)) {
            return <div className="login-loading">Loading...</div>
        } else {
            return <Skeleton avatar paragraph={{ rows: 12 }} />
        }
    } else {
        return null
    }
}
