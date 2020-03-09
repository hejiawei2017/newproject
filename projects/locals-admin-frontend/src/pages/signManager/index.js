import React, { Component } from 'react'
import { Form, message} from 'antd'
import SubTable from '../../components/subTable'
import { signManager } from '../../services'
import EditModal from './editModal'
import Search from '../../components/search'
import TableTooltip from '../../components/tableTooltip'
import moment from 'moment'

const STATUS_DICTIONARY = [
    { value: '-1', text: '不通过' },
    { value: '0', text: '待审' },
    { value: '1', text: '通过' }
];

class SignManager extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields:{
                orderBy: 'create_time DESC'
            },
            modalVisable:false,
            editType: 'add',
            editModalVisible: false,

            hasConfig: false,
            configs: {
                signCity: {},//接单城市对应配置
                contractType: {},//签约类型对应配置
                signType: {},//签约方式对应配置
                workStatus: {},//工作状态对应配置
                workAge: {},//工作年限对应配置
                orderStatus: {}//接单状态对应配置
            }
        }
        this.stateChange = this.stateChange.bind(this)
        this.labelModalSave = this.labelModalSave.bind(this);
    }
    computeHasConfig () {
        let { configs } = this.state;
        return Object.values(configs).every(i => JSON.stringify(i) !== '{}')
    }
    getConfig () {
        //获取合同配置编码如下 城市编号：02 签约类型：24 签约方式：25 工作状态：26 工作年限：27 接单状态：28
        signManager.getConfig({ categoryCode: "02", pageSize: '80', pageNum: '1'}).then(res =>{
            this.setConfig('signCity', res.list);
        })
        signManager.getConfig({ categoryCode: "24" }).then(res => {
            this.setConfig('contractType', res.list);
        })
        signManager.getConfig({ categoryCode: "25" }).then(res => {
            this.setConfig('signType', res.list);
        })
        signManager.getConfig({ categoryCode: "26" }).then(res => {
            this.setConfig('workStatus', res.list);
        })
        signManager.getConfig({ categoryCode: "27" }).then(res => {
            this.setConfig('workAge', res.list);
        })
        signManager.getConfig({ categoryCode: "28" }).then(res => {
            this.setConfig('orderStatus', res.list);
        })
        // hardcode
        this.setState({
            configs: {
                ...this.state.configs,
                hasStrategy: {k1: '否', k2: '是'},
                hasEdge: {k1: '否', k2: '是'},
                hasSpeed: {k1: '否', k2: '是'},
                hasDesign: {k1: '否', k2: '是'}
            }
        })
    }
    filterEmpty (arr) {
        return arr.filter((i) => Boolean(i.code) && Boolean(i.name))
    }
    formatConfig (arr) {
        let config = {};
        arr.forEach(i => {
            let key = i.code ? i.code : i.otherValue;
            return config[key] = i.name
        })
        return config;
    }
    setConfig (key, arr) {
        let middle = {};
        middle[key] = this.formatConfig(this.filterEmpty(arr));
        return this.setState({ configs: Object.assign({}, this.state.configs, middle)});
    }
    labelModalSave (data,type) {
        let that = this
        if (type === 'add' || type === undefined) {
            // jurisdictionService.add(data).then((e) => {
            signManager.add(data).then((e) => {
                message.success('添加成功！')
                that.setState({
                    editModalVisible: false
                }, () => {
                    that.renderTable()
                })
            })
        } else {
            //临时hack：部分场景下缺少字段无法过后逻辑
            data = Object.assign({}, this.state.editFrom, data);
            delete data.agreement;
            data.recentOrderTime = +data.recentOrderTime
            data.recentTrainingTime = +data.recentTrainingTime

            signManager.update(data).then((e)=> {
                message.success('修改成功！')
                that.setState({
                    editModalVisible: false
                }, () => {
                    that.renderTable()
                })
            })
        }
    }
    renderTable = ()=> {
        this.tableThis.renderTable()
    }
    getTime = (time) => {
        return `${moment(time).format("YYYY-MM-DD")}`
    }
    parseStartTime = (time) => {
        let date = this.getTime(time)
        let startDate = date + ' 00:00:00'
        return +moment(startDate)
    }
    parseEndTime = (time) => {
        let date = this.getTime(time)
        let EndDate = date + ' 23:59:59'
        return +moment(EndDate)
    }
    onSearch = (searchFields) => {
        let createTimeLessThanEqual, createTimeGreaterThanEqual
        if (searchFields.rangeDate.value && searchFields.rangeDate.value.length > 0) {
            createTimeGreaterThanEqual = this.parseStartTime(searchFields.rangeDate.value[0])
            createTimeLessThanEqual = this.parseEndTime(searchFields.rangeDate.value[1])
        }
        this.setState({
            searchFields:{
                ...this.state.searchFields,
                nameLike: searchFields.name.value,
                contractType: searchFields.contractType.value,
                status: searchFields.status.value,
                createTimeLessThanEqual,
                createTimeGreaterThanEqual
            }
        }, this.renderTable)
    }
    stateChange (obj, fn) {
        this.setState(obj, () => fn && fn())
    }
    render () {
        let _this = this
        let searchConfig = {
            items: [
                {
                    type: 'text',
                    name: '姓名',
                    key: 'name',
                    searchFilterType: 'string',
                    placeholder: '请输入姓名'
                },
                {
                    type: 'select',
                    name: '签约类型',
                    key: 'contractType',
                    selectData: [
                        { value: '签约设计师', text: '签约设计师' },
                        { value: '签约摄影师', text: '签约摄影师' },
                        { value: '签约项目经理', text: '签约项目经理' },
                        { value: '全职保洁', text: '全职保洁' },
                        { value: '兼职保洁', text: '兼职保洁'},
                        { value: '签约助理房东', text: '签约助理房东' }
                    ],
                    searchFilterType: 'select',
                    defaultValue: '',
                    placeholder: ''
                },
                {
                    type: 'rangepicker',
                    name: '签约时间',
                    key: 'rangeDate',
                    defaultValue: '',
                    placeholder: ['开始', '结束']
                },
                {
                    type: 'select',
                    name: '状态',
                    key: 'status',
                    selectData: STATUS_DICTIONARY,
                    searchFilterType: 'select',
                    defaultValue: '',
                    placeholder: ''
                }
            ],
            exportBlob: {
                name: '人才管理合同',
                extend: 'xls',
                url: `/contract/talents/export-talen-excel`,
                params: _this.state.searchFields
            }
        }

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            width: 140,
            render: v => {
                return <TableTooltip content={v} width={100}/>
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: function (v,o) {
                if(v === null) return;
                let res;
                STATUS_DICTIONARY.forEach(i => {
                    if(String(v) === i.value){
                        return res = i.text;
                    }
                })
                return (
                    <div>{res}</div>
                )
            }
        }, {
            title: '人员编码',
            dataIndex: 'memberId',
            width: 100
        }, {
            title: '城市',
            dataIndex: 'signCity',
            width: 100
        }, {
            title: '姓名',
            dataIndex: 'name',
            width: 100
        }, {
            title: '签约类型',
            dataIndex: 'contractType',
            width: 100
        },{
            title: '身份证',
            dataIndex: 'idCard',
            width: 200
        }, {
            title: '微信',
            dataIndex: 'wechat',
            width: 150
        }, {
            title: '电话',
            dataIndex: 'phone',
            width: 150
        }, {
            title: '邮箱',
            dataIndex: 'email',
            width: 150
        }, {
            title: '地址',
            dataIndex: 'address',
            width: 150
        }, {
            title: '收款人',
            dataIndex: 'accountName',
            width: 100
        }, {
            title: '开户行',
            dataIndex: 'openBank',
            width: 100
        }, {
            title: '收款账号',
            dataIndex: 'accountNumber',
            width: 200
        }, {
            title: '签约时间',
            dataIndex: 'createTime',
            width: 180,
            render: val => val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'
        }]
        searchConfig.columns = columns
        const subTableItem = {
            getTableService: signManager.getTable,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            rowKey: "id",
            searchFields: this.state.searchFields,
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mr10',
                type: "primary",
                onClick: function (record) {
                    !_this.computeHasConfig() && _this.getConfig();
                    return _this.setState({
                        editModalVisible: true,
                        modalType: 'delete',
                        editFrom: record,
                        editType: 'edit'
                    })
                },
                text: '编辑'
            }],
            operatBtnWidth: 100,
            sorterKeys: [{
                key: 'createTime', // 触发columns key
                str: 'create_time' // 转换的 key
            }],
            operatBtnFixed: 'right',
            antdTableProps: {
                bordered: true,
                scroll: {
                    x: 2150
                }
            }
        }
        return (
            <div>

                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable
                    {...subTableItem}
                />
                {
                    _this.state.editModalVisible ?
                        <EditModal
                            _data={_this.state.editFrom}
                            configs={_this.state.configs}
                            editType={_this.state.editType}
                            stateChange={_this.stateChange}
                            renderTable={_this.renderTable}
                            labelModalSave={_this.labelModalSave}
                        />
                    : null
                }
            </div>
        )
    }
}

export default Form.create()(SignManager)

