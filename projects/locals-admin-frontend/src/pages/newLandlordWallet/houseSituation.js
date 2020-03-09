import React, { Component } from 'react'
import { Row, Col } from 'antd'
import './index.less'
class houseSituation extends Component {
    constructor (props) {
        super (props)
        this.state = {}
    }
    componentDidMount () { }
    render () {
        let { houseSourceSumList } = this.props
        return (
            <div className="house">
                <p className="house-num">房源收支<span>（房源数 x {houseSourceSumList ? houseSourceSumList.length : 0}）</span></p>
                <div className="house-list">
                    <Row gutter={24} type="flex" justify="space-between">
                        {houseSourceSumList ? houseSourceSumList.map(function (item,index){
                            //if(item.houseNo === '')return null
                            return <Col span={11} className="item" key={"houseSourceSumList-list-" + index}>
                                <p className="list">
                                    <span className="list-right">房源编码：{item.houseNo}</span>
                                    <span>{item.houseWorkflowStatus === -1 ? '(历史房源)' : ''} {`房源地址：${item.address === null ? '' : item.address }`}</span>
                                </p>
                                <p className="list">
                                    <span className="list-right">收入：&yen; {item.sumIn}</span>
                                    <span className="list-right">支出：&yen; {item.sumOut}</span>
                                    <span>盈亏：&yen; {item.sumEarn}</span>
                                </p>
                            </Col>
                           })
                           : null
                        }
                    </Row>
                </div>
            </div>
        )
    }
}
export default houseSituation
