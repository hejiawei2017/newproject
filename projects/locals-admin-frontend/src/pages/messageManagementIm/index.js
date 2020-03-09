import React, { Component } from 'react'
import IMComponent from '../customerService/index'
import '../customerService/index.less'
class ImMessage extends Component {
    render () {
        return (
            <IMComponent readOnly/>
        )
    }
}
export default ImMessage
