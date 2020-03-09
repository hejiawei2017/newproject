import React, {Component} from 'react'
import { Row, Col, DatePicker, Button, Select } from 'antd'

import {buManageService} from '../../services'
import {message} from "antd/lib/index"
const { MonthPicker } = DatePicker
const Option = Select.Option

class ReportDboExcel extends Component {

    constructor () {
        super()
        this.state = {
            date: '',
            isRepeat: false,
            isCache: ''
        }
    }
    onChangeMonthDate = (date, dateString) => {
        this.setState({
            date: dateString || ''
        })
    }
    onChangeCache = (value) => {
        this.setState({
            isCache: value
        })
    }
    handleSubmit = () => {
        if(this.state.date === '') {
            message.warning('请选择日期')
            return
        }

        if(this.state.isCache === '') {
            message.warning('请选择文件类型')
            return
        }

        if(this.state.isRepeat) {
            message.warning('正在导出，请稍后')
            return
        }
        this.setState({isRepeat: true})
        buManageService.reportDboExcel(`date=${this.state.date}&cache=${this.state.isCache}`,`${this.state.date}.xls`).then(() => {
            this.setState({isRepeat: false})
        }).catch(err => {
            this.setState({isRepeat: false})
        })
    }
    render () {
        return (
            <Row gutter={16}>
                <Col span={8}>
                    <MonthPicker style={{width: '100%'}} className="ant-form-item-children" onChange={this.onChangeMonthDate} placeholder="选择日期" />
                </Col>
                <Col span={8}>
                    <Select placeholder="选择文件" style={{width: '100%'}} onChange={this.onChangeCache}>
                        <Option value="true">缓存文件</Option>
                        <Option value="false">非缓存文件</Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <Button loading={this.state.isRepeat} type="primary" icon="download" onClick={this.handleSubmit}>导出</Button>
                </Col>
            </Row>
        )
    }

}
export default ReportDboExcel
