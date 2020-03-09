import React, { Component } from 'react'
import { Modal, Select, message, Button, Tooltip } from 'antd'
import { pageOption } from '../../utils/utils'
import { hotHouseService } from '../../services'
import HouseList from './houselist'
import './index.less'

const Option = Select.Option
const MAX_ADD_COUNT = 18
const MIN_COUNT = 6

class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            editModalVisible: true,
            editType: null,
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            searchFields: {},
            selectHouse: [],
            loading: false,
            hotHouseCount: null
        }
    }
    componentDidMount () {
        this.setState({
            editType: this.props.editType
        })
        this.getHotHouseCount()
    }
    getHotHouseCount = () => {
        this.setState({loading: true})
        let params = {
            pageNum: 1,
            pageSize: 3000,
            cityCode: this.props._data.cityCode,
            //houseStatus: 2, // 房源状态为已审核
            onlyHotHouseSource: true
        }
        hotHouseService.hotManage(params).then((data) => {
            this.setState({
                hotHouseCount: Number(data.total),
                loading: false
            })
        }).catch(() => {
            this.setState({loading: false})
            message.warning('无法获取热门房源数量')
        })
    }
    addAlertModal = (callback, count = 0) => {
        let { hotHouseCount } = this.state
        Modal.confirm({
            title: '添加热门房源',
            content: `已有${hotHouseCount}条，你选择了${count}条，推荐选择${MAX_ADD_COUNT}条热门房源！`,
            onOk () {
                callback.call()
            }
        })
    }
    deleteAlertModal = (callback, count = 0) => {
        let { hotHouseCount } = this.state
        Modal.confirm({
            title: '删除热门房源',
            content: `你删除${count}条，剩余${hotHouseCount - count}条，当少于${MIN_COUNT}条热门房源，会影响展示效果！`,
            onOk () {
                callback.call()
            }
        })
    }
    onModalOk = () => {
        let { editType, selectHouse } = this.state
        if (selectHouse && selectHouse.length === 0) {
            message.warning('没有选择房源')
            return
        }
        let params = []
        if (editType === 'add') {
            this.addAlertModal(() => {
                selectHouse.forEach(v => {
                    params.push({houseSourceId: v.id})
                })
                this.setState({loading: true})
                hotHouseService.postHouseHeat(params).then(res => {
                    message.success(`已新增${selectHouse.length}条`)
                    this.handleCancel()
                }).catch(e => {
                    message.warning('请求失败')
                })
            }, selectHouse.length)
        } else if (editType === 'delete') {
            this.deleteAlertModal(() => {
                selectHouse.forEach(v => {
                    params.push(v.id)
                })
                this.setState({loading: true})
                hotHouseService.deleteHouseHeat(JSON.stringify(params)).then(res => {
                    message.success(`已删除${selectHouse.length}条`)
                    this.handleCancel()
                }).catch(e => {
                    message.warning('请求失败')
                })
            }, selectHouse.length)
        }
    }
    setSelect = (list) => {
        this.setState({
            selectHouse: list
        })
    }
    handleCancel = () => {
        this.setState({
            editModalVisible: false
        }, ()=>{
            this.props.stateChange({editModalVisible: false})
        })
    }
    renderOption = () => {
        if (this.props.cityList) {
            return this.props.cityList.map((v, i) => {
                return <Option key={i} value={v.id}>{v.name}</Option>
            })
        } else {
            return null
        }
    }
    immediateEffect = () => {
        this.setState({loading: true})
        let params = {
            "delHotCache": true
        }
        hotHouseService.immediateEffect(params).then(res => {
            message.success('立即生效')
            this.setState({loading: false})
        }).catch(e => {
            message.warning('操作失败')
            this.setState({loading: false})
        })
    }
    nextGroup = () => {
        this.setState({loading: true})
        let params = {
            "delHotCache": true,
            "forcePollHot": true
        }
        hotHouseService.immediateEffect(params).then(res => {
            message.success('操作成功')
            this.setState({loading: false})
        }).catch(e => {
            message.warning('操作失败')
            this.setState({loading: false})
        })
    }
    render () {
        let _state = this.state
        let { cityName } = this.props._data
        return (
            <Modal
                destroyOnClose
                visible={_state.editModalVisible}
                title={_state.editType === 'add' ? `【${cityName}】新增热门房源` : `【${cityName}】查看/删除热门房源`}
                onCancel={this.handleCancel}
                width="100%"
                style={{top: 20}}
                footer={[
                    <Button
                        key="immediateEffect"
                        type="primary"
                        onClick={this.immediateEffect}
                    >
                        <Tooltip title="让热门房源配置立即生效">立即生效</Tooltip>
                    </Button>,
                    /*<Button
                        key="nextGroup"
                        type="primary"
                        onClick={this.nextGroup}
                    >
                        <Tooltip title="强制滚动到下一组热门">下一组热门</Tooltip>
                    </Button>,*/
                    <Button key="back" onClick={this.handleCancel}>关闭</Button>,
                    <Button key="submit" type="primary" loading={this.state.loading} onClick={this.onModalOk}>
                        {_state.editType === 'add' ? '确定新增' : '确定删除'}
                    </Button>
                ]}
            >
                <HouseList setSelect={this.setSelect} editType={_state.editType} _data={this.props._data} />
            </Modal>
        )
    }
}

export default EditModal
