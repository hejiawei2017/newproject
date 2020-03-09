import React, { Component } from 'react'
import IMComponent from '../customerService/index'
import '../customerService/index.less'
class AssistantIM extends Component {
    render () {
        return (
            <IMComponent readOnly assistantAuth/>
        )
    }
}
export default AssistantIM
