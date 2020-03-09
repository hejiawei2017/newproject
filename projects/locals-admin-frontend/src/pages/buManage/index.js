import React, { Component } from 'react'
import { buManageService } from '../../services'
import { Table, Button, message, Modal, notification } from 'antd'
import Search from '../../components/search'
import UploadDownloadBtns from '../../components/uploadDownloadBtns'
import { pageOption, checkKey } from '../../utils/utils'
import EditModal from './editModal'
import BuLogModal from './buLogModal'
const confirm = Modal.confirm

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '房源编号',
            key: 'houseSourceNo',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入房源编号'
        }, {
            type: 'text',
            name: 'BUID',
            key: 'buId',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入BUID'
        }
    ]
}

const uploadDownloadBtnsConfig = {
    download: {
        url : 'http://f.localhome.cn/static/bu_template_import.xlsx'
    },
    upload: {
        url : '/old/bu/batch-import',
        type: 'obj',
        needMsg: true,
        postData : [{
            name: 'sheet1s',
            '项目编码' : 'houseNo',
            '更新后的BU' : 'buName',
            'bu code': 'buCode'
        }, {
            name: 'sheet2s',
            'BU名称' : 'buName',
            'bu code' : 'buCode',
            'opsid': 'opsid'
        }]
    }
}

class BuManage extends Component {
    constructor () {
        super()
        this.state = {
            tableDate: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            editType: 'add',
            editModalVisible: false,
            editFrom: {},
            searchFields: {},
            loading: false,
            isShowDetail:false,
            modalData:[],
            modalPageNum: pageOption.pageNum,
            modalPageSize: pageOption.pageSize
        }
        this.onSearch = this.onSearch.bind(this)
        this.renderTable = this.renderTable.bind(this)
        this.stateChange = this.stateChange.bind(this)
        this.labelModalSave = this.labelModalSave.bind(this)
    }
    componentDidMount () {
        this.renderTable()
    }
    onSearch (val) {
        this.setState({
            pageNum: 1,
            searchFields: {
                buId: val.buId.value,
                houseSourceNo: val.houseSourceNo.value
            }
        }, this.renderTable)
    }
    renderTable () {
        const params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        const searchFields = this.state.searchFields
        this.setState({loading: true})
        searchFields.buId && (params.buId = searchFields.buId)
        searchFields.houseSourceNo && (params.houseSourceNo = searchFields.houseSourceNo)
        buManageService.getBuList(params).then((data) => {
            // checkKey(data.list).each(val=>{console.log(val)});
            this.setState({
                tableDate: checkKey(data.list).map(val=>{
                    val.buidIfo = `${val.buid || ''}${val.buid ? `(${val.buName})` : ''}`;
                    val.memberName = `${val.memberName || ''}${val.memberid ? `(${val.memberid})` : ''}`;
                    return val
                }),
                totalCount: Number(data.total),
                loading: false
            })
        }).catch((e) => {
            this.setState({loading: false})
        })
    }
    stateChange (obj, fn) {
        this.setState(obj, () => fn && fn())
    }
    labelModalSave (data) {
        const {editType} = this.state
        // console.log(data)
        // return
        if (editType === 'add') {
            buManageService.addBu(data).then((e) => {
                message.success('添加成功！')
                this.setState({
                    editModalVisible: false
                }, () => {
                    this.renderTable()
                })
            })
        } else {
            buManageService.editBu(data).then((e)=> {
                message.success('修改成功！')
                this.setState({
                    editModalVisible: false
                }, () => {
                    this.renderTable()
                })
            })
        }
    }
    delectItem (id) {
        buManageService.deleteBu(id).then((data) => {
            notification.success({
                message: '删除成功！'
            })
            this.renderTable()
        }).catch((e) => {})
    }
    showDetailModal = (id) => {
        this.setState({
            loading: true,
            houseNo: id
        },this.renderModal)

    }
    closeModal = () => {
        this.setState({
            isShowDetail: false,
            modalPageNum:1
        })
    }
    renderModal = () =>{
        const params = {
            pageNum: this.state.modalPageNum,
            pageSize: this.state.modalPageSize,
            houseNo: this.state.houseNo
        }
        buManageService.getBuChangeLog(params).then((data) => {
            console.log('__debug',data)
            this.setState({
                modalData: checkKey(data.list),
                totalCount: Number(data.total),
                loading: false,
                isShowDetail: true
            })
        }).catch(e => {
            this.setState({loading: false})
            message.error('请求失败')
        })
    }
    onModalShowSizeChange = ({urrent, pageSize},cb) => {
        this.setState({ modalPageNum: 1, modalPageSize: pageSize }, cb)
    }
    onModalChange = ({ pageNum: value, pageSize }, cb) => {
        this.setState({ modalPageNum: value, modalPageSize: pageSize }, cb)
    }
    render () {
        const that = this
        const columns = [{
            title: '房源编码',
            dataIndex: 'housesourceid'
        }, {
            title: 'BUID',
            dataIndex: 'buidIfo'
        }, {
            title: '人员',
            dataIndex: 'memberName'
        }, {
            title: '操作',
            dataIndex: '',
            render: (text, record) => (
                <span>
                    <Button size="small" className="" type="primary" onClick={function () {
                        // console.log('record-->', record)
                        that.stateChange({
                            editType: 'edit',
                            editModalVisible: true,
                            editFrom: {
                                houseNo: record.housesourceid,
                                buId: record.buid
                            }
                        })}}
                    >编辑</Button>
                    <Button size="small" className="ml10" type="danger" onClick={function () {
                        confirm({
                            title: '删除提示',
                            okText: '确认',
                            cancelText: '取消',
                            content: '是否确定删除该记录？',
                            onOk () {
                                that.delectItem(record.housesourceid)
                            },
                            onCancel () {
                            }
                        })}}
                    >删除</Button>
                    <Button size="small" className="ml10" type="primary" onClick={function () {
                        that.showDetailModal(record.housesourceid)
                    }}
                    >查看日志</Button>
                </span>
            )
        }]
        const _state = this.state
        const pageObj = {
            total: _state.totalCount,
            pageSize: _state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: _state.pageSizeOptions,
            current: _state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {this.setState({'pageNum': 1, pageSize}, this.renderTable)
            },
            onChange: (value, pageSize) => {
                this.setState({
                    'pageNum': value,
                    pageSize
                }, this.renderTable)
            }
        }
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="pt10 mb10 text-right">
                    <UploadDownloadBtns config={uploadDownloadBtnsConfig} onUpload={this.renderTable} />
                    <Button className="ml10" type="primary" onClick={function () {that.stateChange({editType: 'add', editModalVisible: true, editFrom: {buId: null, houseNo: null, workBookName: null, memberCode: null}})}}>新增BU</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={_state.tableDate}
                    rowKey="key"
                    pagination={pageObj}
                    loading={this.state.loading}
                />
                {
                    _state.editModalVisible ? <EditModal _data={_state.editFrom} editType={_state.editType} stateChange={that.stateChange} renderTable={that.renderTable} labelModalSave={that.labelModalSave} /> : null
                }
                <BuLogModal
                    title="详情"
                    visible={this.state.isShowDetail}
                    closeModal={this.closeModal}
                    modalData={this.state.modalData}
                    totalCount={this.state.totalCount}
                    renderTable={this.renderModal}
                    pageSize={this.state.modalPageSize}
                    pageSizeOptions={this.state.pageSizeOptions}
                    pageNum={this.state.modalPageNum}
                    loading={this.state.loading}
                    onShowSizeChange={this.onModalShowSizeChange}
                    onChange={this.onModalChange}
                />
            </div>
        )
    }
}

export default BuManage