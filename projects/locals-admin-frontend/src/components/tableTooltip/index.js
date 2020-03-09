import React, { Component } from 'react'
import {Tooltip} from 'antd'

/*
table提示框 不换行
接收参数：
content 内容 必填
width 宽度 非必填
*/

class TableTooltip extends Component {
    render () {
        let _width = this.props.width || 100
        let _content = this.props.content
        if (!_content) return null
        const output = <div style={{width:_width}}>{_content}</div>
        return (
            <Tooltip title={output}>
                <div className="ellipsis" style={{width:_width}}>{_content}</div>
            </Tooltip>
        )
    }
}

export default TableTooltip
