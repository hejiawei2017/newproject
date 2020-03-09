import React, { Component } from 'react'
import { connect } from 'react-redux'
import { message, Spin, Button, notification, Modal, Tag } from 'antd'
import SelectList from '../../components/selectList'
import { pageOption, envConfig } from '../../utils/utils.js'
import { hotHouseService, houseListService } from '../../services'
import Search from '../../components/search'

const mapStateToProps = (state, action) => {
    return {
        imageListM: state.imageListM
    }
}

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '房源编码',
            key: 'houseNo',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '房源编码'
        },
        {
            type: 'text',
            name: '关键字',
            key: 'keyword',
            placeholder: '标题或城市【广州市】'
        }
    ]
}

class HouseList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            selectData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            uploading: false,
            loading: true,
            searchloading: true,
            searchData: [],
            searchList: '',
            data: null,
            searchFields: null,
            imageVisible: false
        }
    }
    componentDidMount () {
        this.getHouse()
    }
    // 点击图片
    onImage = (record) => () => {
        this.setState({
            imageVisible: true
        })
        houseListService.houseImage(record.id).then((data) => {
            this.props.dispatch({
                type: 'GET_IMAGE_SUCCESS',
                payload: data
            })
        })
    }
    // 关闭弹出框
    handleCancel = (e) => {
        this.setState({
            visible: false,
            imageVisible: false,
            editVisible: false
        })
        notification.destroy()
    }
    showHeatHouse = (record) => () => {
        let { houseSourceHotId, id, show } = record
        if (!houseSourceHotId) {
            message.warning('此房源不是热门房源!')
            return false
        }
        this.setState({loading: true})
        let params = {
            "id": houseSourceHotId,
            "houseSourceId": id,
            "show": Number(show) === 1 ? 0 : 1
        }
        hotHouseService.updateHeatHouse(params).then(res => {
            message.success('修改成功')
            this.setState({loading: false}, this.getHouse)
        }).catch(e => {
            message.warning('修改失败')
            this.setState({loading: false})
        })
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                houseNo: searchFields.houseNo.value,
                keyword: searchFields.keyword.value
            }
        }, this.getHouse)
    }
    setSelect = (list) => {
        this.setState({
            selectData: list
        })
        this.props.setSelect(list)
    }
    setPageNum = (pageNum, pageSize) => {
        this.setState({
            pageNum: pageNum,
            pageSize: pageSize
        }, this.getHouse)
    }
    getHouse = (sortData) => {
        const isDelete = this.props.editType === 'delete'
        this.setState({loading: true})
        let params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            cityCode: this.props._data.cityCode,
            //houseStatus: 2, // 房源状态为已审核
            ...this.state.searchFields,
            ...sortData
        }
        // 删除房源只获取热门房源
        if (isDelete) {
            params = {...params, onlyHotHouseSource: true}
        }
        hotHouseService.hotManage(params).then((data) => {
            // 将热门房源的选择按钮隐藏
            if (!isDelete) {
                data.list.forEach((v, i) => {
                    if (v.houseSourceHotId) {
                        data.list[i]['disabled'] = true
                    }
                })
            }
            this.setState({
                data: data,
                loading: false
            })
        }).catch(() => {
            this.setState({loading: false})
            message.warning('无法获取热门房源')
        })
    }
    renderSelectList = () => {
        const selectListConfig = {
            equalId: "id",
            showPage: true,
            isShowSelectAll: true,
            isFixedSelect: false,
            leftColumns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    width: 150
                },
                {
                    title: '房源编码',
                    dataIndex: 'houseNo',
                    width: 100
                },
                {
                    title: '是否显示',
                    dataIndex: 'show',
                    width: 100,
                    render: (show, record) => {
                        if (Number(show) === 1) {
                            return <Tag color="#f50" onClick={this.showHeatHouse(record)}>是</Tag>
                        } else {
                            return <Tag onClick={this.showHeatHouse(record)}>否</Tag>
                        }
                    }
                },
                {
                    title: '是否热门',
                    dataIndex: 'houseSourceHotId',
                    width: 100,
                    render: val => {
                        if (!!val) {
                            return <span>是</span>
                        } else {
                            return <span>否</span>
                        }
                    }
                },
                {
                    title: '查看图片',
                    dataIndex: 'action',
                    key: 'action',
                    width: 140,
                    render: (text, record, index) => {
                        return (
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                className="mr-sm"
                                onClick={this.onImage(record)}
                            >查看图片</Button>
                        )
                    }
                }
            ],
            rightColumns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    width: 150
                },
                {
                    title: '房源编码',
                    dataIndex: 'houseNo',
                    width: 100
                },
                {
                    title: '是否热门',
                    dataIndex: 'houseSourceHotId',
                    width: 100,
                    render: val => {
                        if (!!val) {
                            return <span>是</span>
                        } else {
                            return <span>否</span>
                        }
                    }
                },
                {
                    title: '查看图片',
                    dataIndex: 'action',
                    key: 'action',
                    width:'140px',
                    render: (text, record, index) => {
                        return (
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                className="mr-sm"
                                onClick={this.onImage(record)}
                            >查看图片</Button>
                        )
                    }
                }
            ]
        }
        return this.state.data ? (
            <SelectList
                setSelect={this.setSelect}
                setPageNum={this.setPageNum}
                selectData={this.state || []}
                initData={this.state.data}
                config={selectListConfig}
                loading={this.state.loading}
            />
        ) : <Spin />
    }
    //图片弹窗
    renderImageModal = () => {
        return (
            <Modal title="房源图片" width="800px" visible={this.state.imageVisible } bodyStyle={{padding:"10px"}} onCancel={this.handleCancel} footer={[<span key="cancel" className="click-link" onClick={this.handleCancel}>关闭</span>]}>
                <div className="ant-masonry">
                    { this.props.imageListM.length > 0 ? this.props.imageListM.map(function (item,index) {
                        return <div className="ant-masonry-item" key={index}>
                            <img className="wsm-full ant-masonry-cell" style={{width:'100%',height:'100%'}} src={envConfig.imgPrefix + item.imgPath} alt="加载失败..." />
                        </div>
                    }) : <div style={{padding:"20px"}}>暂无房源图片</div>
                    }
                </div>
            </Modal>
        )
    }
    render () {
        return (
            <div>
                <Search
                    onSubmit={this.onSearch}
                    config={searchConfig}
                />
                <div className="text-center">
                    {this.renderSelectList()}
                </div>
                {this.renderImageModal()}
            </div>
        )
    }
}

export default connect(mapStateToProps)(HouseList)
