import React, { Component } from 'react'
import { Row, Col, Tabs, Badge, DatePicker, Button, Input } from 'antd'
import SessionList from './sessionList'
import ChatContent from './chatContent'
import moment from 'moment'
import { checkType } from '../../utils/utils'
import './index.less'

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker

class ImMessage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            timeStart: moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00',
            timeEnd: moment().format('YYYY-MM-DD') + ' 23:59:59',
            counts: {},
            searchVal: '',
            listSource: '0',
            solveType: '0'
        }
        this.getCounts = this.getCounts.bind(this)
    }
    componentDidMount () {

    }
    onTRef = (ref) => {
        this.method = ref
    }
    onARef = (ref) => {
        this.assiatant = ref
    }
    onHRef = (ref) => {
        this.housing = ref
    }
    changeListSource = (listSource) => {
        const { solveType } = this.state;
        if(checkType.isString(listSource)){
            this.setState({
                listSource: listSource
            }, () => {
                this.changeSolveType(solveType)
            })
        }else{
            this.changeSolveType(solveType)
        }
    }
    handleRangeDateChange = (value, dateString) => {
        this.setState({
            timeStart: value.length > 0 ? dateString[0] : '',
            timeEnd: value.length > 0 ? dateString[1] : ''
        })
    }
    changeSolveType = (solveType, searchVal) =>{
        const { listSource, counts } = this.state
        const { readOnly, assistantAuth } = this.props
        counts.total = ''
        this.setState({
            counts,
            solveType,
            searchVal
        })
        let params = {
            pageNum: 1,
            pageSize: 50,
            createTimeGreaterThanEqual: this.state.timeStart,
            createTimeLessThanEqual: this.state.timeEnd
        }
        if(readOnly){
            params.sourcePage = 1
            if(assistantAuth){
                params.sourcePage = 3
            }
            if(listSource === '0') {
                if(solveType === '0'){
                    params.hasFirstReplyTime = false
                }else if(solveType === '2'){
                    params.hasFirstReplyTime = true
                }
            }else if(listSource === '1') {
                params.assistName = searchVal
            }else if(listSource === '2') {
                let reg = /^[0-9]+.?[0-9]*$/
                let isHouseNo = reg.test(searchVal)
                if(isHouseNo){
                    params.houseNo = searchVal
                }else{
                    params.houseTitle = searchVal
                }
            }else if(listSource === '3') {
                params.keyword = searchVal
            }
        }else{
            params.replyTimeoutCount = true
            params.sourcePage = 2
            if(listSource === '0' && solveType) {
                params.customerServiceSolved = solveType
            }else if(listSource === '1') {
                params.assistName = searchVal
            }else if(listSource === '2') {
                let reg = /^[0-9]+.?[0-9]*$/
                let isHouseNo = reg.test(searchVal)
                if(isHouseNo){
                    params.houseNo = searchVal
                }else{
                    params.houseTitle = searchVal
                }
            }else if(listSource === '3') {
                params.keyword = searchVal
            }
        }
        this.method.refreshPage(() => {
            this.method.getTable(params)
        })
    }
    searchList = (val) =>{
        this.setState({
            searchVal: val
        })
        this.changeSolveType(this.state.solveType, val)
    }
    getCounts = (counts) => {
        this.setState({
            counts: counts
        })
    }
    render () {
        let _this = this
        let dateRangeArr = []
        const startDate = moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'
        const endDate = moment().format('YYYY-MM-DD') + ' 23:59:59'
        dateRangeArr.push(moment(startDate,'YYYY-MM-DD HH:mm:ss'))
        dateRangeArr.push(moment(endDate,'YYYY-MM-DD HH:mm:ss'))
        return (
            <div className="message-im">
                <div className="date-box">
                    日期：
                    <RangePicker
                        onChange={this.handleRangeDateChange}
                        defaultValue={dateRangeArr}
                        showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                    <Button type="primary" className="date-save" onClick={this.changeListSource}>确定</Button>
                </div>
                <Row>
                    <Col span={8} className="col-left">
                        <Tabs type="card" onChange={this.changeListSource}>
                            {/*<TabPane tab={<Badge count={this.state.counts.replyTimeoutCount || '0'} showZero>超时未回复</Badge>} key="0"></TabPane>*/}
                            <TabPane tab="超时未回复" key="0"></TabPane>
                            <TabPane tab="管家" key="1"></TabPane>
                            <TabPane tab="房源" key="2"></TabPane>
                            {
                                this.props.readOnly && <TabPane tab="全部" key="3"></TabPane>
                            }
                        </Tabs>
                        {
                            this.state.listSource === '0' && <div className="solve">
                                <Tabs onChange={this.changeSolveType} activeKey={this.state.solveType}>
                                    <TabPane tab={`未解决${this.state.solveType === '0' && this.state.counts.total ? '(' + this.state.counts.total + ')' : ''}`} key="0"></TabPane>
                                    {
                                        !this.props.readOnly && <TabPane tab={'解决中(' + (this.state.counts.solutionCount || '0') + ')'} key="1"></TabPane>
                                    }
                                    <TabPane tab={`已解决${this.state.solveType === '2' && this.state.counts.total ? '(' + this.state.counts.total + ')' : ''}`} key="2"></TabPane>
                                </Tabs>
                            </div>
                        }
                        {
                            this.state.listSource === '1' &&
                            <div className="search-im-content">
                                <div className="search-im">
                                    <Search
                                        placeholder="请输入搜索条件"
                                        enterButton="搜索"
                                        onSearch={this.searchList}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.listSource === '2' &&
                            <div className="search-im-content">
                                <div className="search-im">
                                    <Search
                                        placeholder="请输入搜索条件"
                                        enterButton="搜索"
                                        onSearch={this.searchList}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.listSource === '3' &&
                            <div className="search-im-content">
                                <div className="search-im">
                                    <Search
                                        placeholder="请输入关键字"
                                        enterButton="搜索"
                                        onSearch={this.searchList}
                                    />
                                </div>
                            </div>
                        }
                        <SessionList
                            readOnly={this.props.readOnly}
                            assistantAuth={this.props.assistantAuth}
                            solveType={this.state.solveType}
                            listSource={this.state.listSource}
                            searchVal={this.state.searchVal}
                            editFrom={this.state}
                            onTRef={this.onTRef}
                            getCounts={function (counts) { _this.getCounts(counts) }}
                            changeSolveType={function (solveType) { _this.changeSolveType(solveType) }}
                        />
                    </Col>
                    <Col span={16} className="col-right">
                        <ChatContent readOnly={this.props.readOnly} assistantAuth={this.props.assistantAuth} solveType={this.state.solveType}/>
                    </Col>
                </Row>

            </div>
        )
    }
}
export default ImMessage
