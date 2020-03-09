import React, { Component } from 'react'
import { Table, Row, Col } from 'antd'
import { aummerActivityService } from '../../services'
import {dataFormat,dateDiff} from '../../utils/utils.js'
import './index.less'
class equityTimelineModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            conform: null,
            dateString: null,
            dataList:[]
        }
    }
    componentDidMount () {
        const {editFrom} = this.props
        const {
            userId
        } = editFrom
        console.log(userId)
        this.getTable(userId)
    }
    getTable = (id) =>{
        aummerActivityService.getTimeLine(id).then((res)=>{
            console.log(res)
            this.setState({
                dataList: [...res.list]
            })
        })
    }
    render () {
        const {editFrom} = this.props
        const {
            userId,
            vipValidTimeEnd,
            vipValidTimeStart
        } = editFrom
        const labelSpan = {
            first: 3,
            last: 9
        }
        const columns = [{
            title: 'equityName',
            dataIndex: 'equityName'
        }, {
            title: 'equityDescription',
            dataIndex: 'equityDescription'
        }, {
            title: 'timeVersion',
            dataIndex: 'timeVersion',
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }];
        return (
            <div className="equity">
                <div className="equityTime">
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            累计获得资格：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {dateDiff(vipValidTimeStart,vipValidTimeEnd)}天
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            已享受资格：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            {(dateDiff(vipValidTimeStart,new Date()) > dateDiff(vipValidTimeStart,vipValidTimeEnd)) ? dateDiff(vipValidTimeStart,vipValidTimeEnd) : dateDiff(vipValidTimeStart,new Date()) }天
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            剩余资格天数：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            { dateDiff(new Date(),vipValidTimeEnd) > 0 ? dateDiff(new Date(),vipValidTimeEnd) : '0'}天
                        </Col>
                        <Col className="gutter-row text-right" span={labelSpan.first}>
                            结束日期：
                        </Col>
                        <Col className="gutter-row" span={labelSpan.last}>
                            { vipValidTimeEnd ? dataFormat(vipValidTimeEnd) : null}
                        </Col>
                    </Row>
                </div>
                <div className="equityCont">
                    <Table showHeader={false} pagination={false} columns={columns} dataSource={this.state.dataList} size="middle" />
                </div>
            </div>
        )
    }
}
export default equityTimelineModal