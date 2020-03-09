import React, { Component } from 'react'
import {landlordService} from '../../services'
import Search from '../../components/search'
import {Table, Button, message} from 'antd'
import { pageOption } from '../../utils/utils.js'
import moment from 'moment'
import ConfigModal from './configModal'
import DetailModal from './detailModal'

const searchConfig = {
    items: [
        {
            type: 'monthpicker',
            name: '月份',
            key: 'pickMonth',
            defaultValue: moment()
        },
        {
            type: 'text',
            name: '管家姓名/电话',
            key: 'assistantInfo',
            searchFilterType: 'string',
            placeholder: '请输入管家姓名/电话'
        },
        {
            type: 'text',
            name: '房东姓名/电话',
            key: 'landlordInfo',
            searchFilterType: 'string',
            placeholder: '请输入房东姓名/电话'
        }
    ]
}
class LandlordSatisfaction extends Component {
    constructor (props) {
        super(props)
        this.state = {
            tableData: [],
            checkItem: null,
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            total: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            month: '',
            assistantInfo: '',
            landlordInfo: ''
        }
    }
    componentDidMount (){
        this.setState({
            month: moment().format('YYYY-MM')
        }, this.getSatisfaction)
    }
    getSatisfaction = () => {
        const {pageNum, pageSize, month, assistantInfo, landlordInfo} = this.state;
        const startDate = moment(month).startOf('month').valueOf();
        const endDate = moment(month).endOf('month').valueOf();
        let params = {
            examId: '1118763773129330690',
            pageNum: pageNum,
            pageSize: pageSize,
            beginTimeGreaterThanEqual: startDate,
            beginTimeLessThanEqual: endDate
        }
        assistantInfo && (params.assistantInfo = assistantInfo)
        landlordInfo && (params.landlordInfo = landlordInfo)
        this.setState({
            loading: true
        })
        landlordService.getSatisfaction(params).then((data) =>{
            this.setState({
                pageNum:data.pageNum,
                tableData:data.list,
                total:data.total,
                loading:false
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })

    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum: 1,
            month: searchFields.pickMonth.value,
            assistantInfo: searchFields.assistantInfo.value,
            landlordInfo: searchFields.landlordInfo.value

        },()=>{ this.getSatisfaction()})
    }
    detailOperate = (record) => {
        this.setState({
            detailVisible: true,
            checkItem: record
        })
    }
    configOperate = () => {
        this.setState({
            configVisible: true
        })
    }
    handleCancelConfig = () => {
        this.setState({
            configVisible: false
        })
    }
    handleCancelDetail = () => {
        this.setState({
            detailVisible: false,
            checkItem: null
        })
    }
    configSave = (values) => {
        landlordService.setExamConfig(values).then((data) =>{
            this.setState({
                configVisible: false
            })
            message.success('配置成功')
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    modalEditSave = (values) => {
        console.log(values, "editvalues")
    }
    modalAddSave = (values) => {
        console.log(values, "addvalues")
    }
    render () {
        const _this = this
        const _state = this.state
        const { pageSize, pageSizeOptions, pageNum , total, checkItem, configVisible, month, detailVisible, loading} = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.getSatisfaction()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.getSatisfaction()})
            }
        }
        const columns = [{
            title: '月份',
            dataIndex: 'beginTime',
            render: function (text, record) {
                return moment(record.examAnswer.beginTime).format('YYYY-MM')
            },
            width: 120
        }, {
            title: '管家',
            dataIndex: 'assistantInfo',
            render: function (text, record) {
                return record.info && (record.info.assistantName + record.info.assistantMobile)
            },
            width: 200
        }, {
            title: '房东',
            dataIndex: 'landlordInfo',
            render: function (text, record) {
                return record.examAnswer.realName + record.examAnswer.mobile
            },
            width: 200
        }, {
            title: 'BU',
            dataIndex: 'buName',
            render: function (text, record) {
                return record.info.buName
            },
            width: 100
        }, {
            title: '管理房源数',
            dataIndex: 'houseTotal',
            render: function (text, record) {
                return record.info && record.info.houseTotal
            },
            width: 150
        },{
            title: '日常沟通回复的及时性',
            dataIndex: 'dailyResponse',
            render: function (text, record) {
                return record.examItemAnswers.length ? record.examItemAnswers[0].desc : ''
            },
            width: 150
        },{
            title: '解决房东诉求的高效性',
            dataIndex: 'feedback',
            render: function (text, record) {
                return record.examItemAnswers.length ? record.examItemAnswers[1].desc : ''
            },
            width: 150
        },{
            title: '房源日常管理敬业度',
            dataIndex: 'dailyManage',
            render: function (text, record) {
                return record.examItemAnswers.length ? record.examItemAnswers[2].desc : ''
            },
            width: 150
        },{
            title: '房源收益管理专业度',
            dataIndex: 'earning',
            render: function (text, record) {
                return record.examItemAnswers.length ? record.examItemAnswers[3].desc : ''
            },
            width: 150
        },{
            title: '定期反馈房源经营情况',
            dataIndex: 'busSituation',
            render: function (text, record) {
                return record.examItemAnswers.length ? record.examItemAnswers[4].desc : ''
            },
            width: 150
        },{
            title: '总分',
            dataIndex: 'totalScore',
            render: function (text, record) {
                return record.examAnswer.totalScore
            },
            width: 100
        },{
            title: '评分状态',
            dataIndex: 'scoreState',
            render: function (text, record) {
                switch (record.examAnswer.state) {
                    case 1: return '未完成'
                    case 2: return '已完成'
                    case 3: return '已追评'
                    default: return ''
                }
            },
            width: 100
        },{
            title: '是否追加评分',
            dataIndex: 'addScore',
            render: function (text, record) {
                return record.examAnswer.state === 3 ? '是' : '否'
            },
            width: 100
        },{
            title: '更新时间',
            dataIndex: 'commitTime',
            render: function (text, record) {
                return record.examAnswer.commitTime && moment(record.examAnswer.commitTime).format('YYYY-MM-DD HH:mm:ss')
            },
            width: 100
        },{
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            render:  (text, record) => <Button size="small" type="primary" onClick={ function () { _this.detailOperate(record) } }>{'详情'}</Button>
        }]
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="mb10 text-right">
                    <Button type="primary" onClick={_this.configOperate}>配置</Button>
                </div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={_state.tableData}
                    pagination={pagination}
                    rowKey={function (record) {
                        return record.examAnswer.id
                    }}
                />
                <ConfigModal
                    configVisible={configVisible}
                    month={month}
                    handleCancel={this.handleCancelConfig}
                    onSubmit={this.configSave}
                />
                {
                    checkItem &&
                    <DetailModal
                        detailVisible={detailVisible}
                        month={month}
                        checkItem={checkItem}
                        handleCancel={this.handleCancelDetail}

                    />
                }
            </div>
        )
    }
}

export default LandlordSatisfaction
