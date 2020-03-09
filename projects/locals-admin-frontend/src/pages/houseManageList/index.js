import React, {Component} from 'react'
import RoomStatusList from './roomStatusList'
import {houseManageListService, cleanKeepingService, couponService} from '../../services'
import {Tabs, Table, Button, Modal, Checkbox, Select, Form, Row, Col, Input} from 'antd'
import {pageOption, searchObjectSwitchArray} from "../../utils/utils"
import {houseManageSearch} from "../../utils/dictionary"
import {tagManageService} from '../../services'
import LayerPhotos from '../../components/layerPhotos'
import Global from '../../utils/Global'
import {equalsUserExistSuperAuth} from "../../utils/getUserRole";
import Search from '../../components/search'
import HouseManageDetail from './detail'
import TagManageModal from './tagManageModal'
import './index.less'
import {message} from "antd/lib/index";
const TabPane = Tabs.TabPane
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const FormItem = Form.Item
const ButtonGroup = Button.Group

class HouseManageList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: {},
            houseIds: '',
            tableLoading: false,
            checkVisibleModal: false,
            showCleanTable: false,
            isShowPhotos: false,
            showCleanSetting: false,
            cleanFeeInfo: {},
            houseInfo: {},
            cleanFeeLise: [],
            ruleTypeList: [],
            activeKeyTabs: '1',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOpts,
            selectedRowKeys: [],
            prodCustomTagList: [], //销售标签信息
            settingType: 'sales',
            cleanOperateDes: 'add', //操作说明
            cacheSalesList: [],
            houseImages: [],
            searchConfig: {
                items: [
                    {
                        type: 'text',
                        name: '房源编码',
                        key: 'houseNo',
                        searchFilterType: 'string',
                        placeholder: '请输入房源编码'
                    },
                    {
                        type: 'text',
                        name: '关键字',
                        key: 'keyword',
                        searchFilterType: 'string',
                        placeholder: '请输入房源地址、标题'
                    },
                    {
                        type: 'multiple-select',
                        name: '上线状态',
                        key: 'houseStatusIn',
                        selectData: searchObjectSwitchArray(houseManageSearch.houseStatus),
                        renderSelectData: houseManageSearch.houseStatus,
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择上线状态'
                    },
                    {
                        type: 'selectAreaBu',
                        name: '大区/BU',
                        key: 'buArea',
                        searchFilterType: 'string',
                        placeholder: '请选择大区/BU'
                    },
                    {
                        type: 'text',
                        name: 'BU姓名/电话',
                        key: 'bu',
                        searchFilterType: 'string',
                        placeholder: '请输入BU姓名/电话'
                    },
                    {
                        type: 'text',
                        name: '助理姓名/电话',
                        key: 'assist',
                        searchFilterType: 'string',
                        placeholder: '请输入助理姓名/电话'
                    },
                    {
                        type: 'text',
                        name: '房东姓名/电话',
                        key: 'landlord',
                        searchFilterType: 'string',
                        placeholder: '请输入房东姓名/电话'
                    },
                    {
                        type: 'multiple-select',
                        name: '房源类型标签',
                        key: 'labelType',
                        selectData: [],
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择房源类型标签'
                    },
                    // {
                    //     type: 'select',
                    //     name: '销售标签',
                    //     key: 'tagId',
                    //     selectData: [],
                    //     searchFilterType: 'select',
                    //     placeholder: '请选择销售标签'
                    // },
                    {
                        type: 'select',
                        name: '管理状态',
                        key: 'houseSourceStatus',
                        selectData: searchObjectSwitchArray(houseManageSearch.houseManageTag),
                        searchFilterType: 'select',
                        placeholder: '请选择管理状态'
                    },
                    {
                        type: 'select',
                        name: '卧室',
                        key: 'roomNumber',
                        selectData: searchObjectSwitchArray(houseManageSearch.roomType),
                        searchFilterType: 'select',
                        placeholder: '请选择卧室数'
                    },
                    {
                        type: 'select',
                        name: '床位',
                        key: 'bedNumber',
                        selectData: searchObjectSwitchArray(houseManageSearch.bedNum),
                        searchFilterType: 'select',
                        placeholder: '请选择床位'
                    },
                    {
                        type: 'select',
                        name: '卫生间',
                        key: 'toiletNumber',
                        searchFilterType: 'select',
                        selectData: searchObjectSwitchArray(houseManageSearch.roomType),
                        placeholder: '请选择卫生间数'
                    },
                    {
                        type: 'select',
                        name: '阳台',
                        key: 'balconyNumber',
                        searchFilterType: 'select',
                        selectData: searchObjectSwitchArray(houseManageSearch.roomType),
                        placeholder: '请选择阳台数'
                    },
                    {
                        type: 'select',
                        name: '人数',
                        key: 'tenantNumber',
                        selectData: searchObjectSwitchArray(houseManageSearch.quorumsNum),
                        searchFilterType: 'select',
                        placeholder: '请选择居住人数'
                    },
                    {
                        type: 'checkbox',
                        name: '设施',
                        key: 'facility',
                        checkboxData: houseManageSearch.houseFacility,
                        searchFilterType: 'select',
                        defaultValue: []
                    },
                    {
                        type: 'select',
                        name: '城市',
                        key: 'city',
                        selectData: [],
                        searchFilterType: 'select',
                        placeholder: '请选择房源类型标签'
                    },
                    {
                        type: 'multiple-select',
                        name: '房源活动标签',
                        key: 'labelActivity',
                        selectData: [],
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择房源类型标签'
                    },
                    {
                        type: 'multiple-select',
                        name: '风格标签',
                        key: 'labelStyle',
                        selectData: [],
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择房源类型标签'
                    },
                    {
                        type: 'multiple-select',
                        name: '优惠券标签',
                        key: 'labelOffer',
                        selectData: [],
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择房源类型标签'
                    },
                    {
                        type: 'multiple-select',
                        name: '功能标签',
                        key: 'labelFun',
                        selectData: [],
                        searchFilterType: 'multiple-select',
                        placeholder: '请选择房源类型标签'
                    }
                ]
            },
            searchFields: {}
        }
    }
    componentWillMount () {
        this.init();
    }
    componentDidMount () {
        // this.renderTable()
    }
    getCityList = () => { //获取城市列表并渲染标签数据
        const params = {
            existCity: true,
            pageNum: 1,
            pageSize: 10000,
            areaLevel: 3
        }
        houseManageListService.getCityList(params).then((data) => {
            let searchConfig = this.state.searchConfig
            let searchConfigItems = searchConfig.items;
            const list = []
            if(data && data.list instanceof Array) {
                data.list.forEach((item,index) => {
                    list.push({
                        text: item.name,
                        value: item.code,
                        key: index
                    })
                })
            }
            searchConfigItems.forEach((item,index)=>{
                if(item.key === "city") {
                    item.selectData = list
                }
            })
            searchConfig.items = searchConfigItems;
            this.setState({
                searchConfig
            }, ()=>{
                this.getCityData(); //获取全部数据
            })
        })
    }
    getCityData = () => { //获取标签数据
        let searchConfig = this.state.searchConfig
        let searchConfigItems = searchConfig.items;
        // 获取标签
        couponService.getHouseTagList().then((data) => {
            const list = this.classifyData(data);
            searchConfigItems.forEach(item => {
                if(item.key === 'tagId') {
                    let arr = []
                    data && data.forEach(tagItem => {
                        let arr = []
                        arr.push({
                            text: tagItem.name,
                            value: tagItem.id,
                            label: tagItem.name
                        })
                    })
                    item.selectData.push({
                        text: '不限',
                        value: ''
                    })
                    item.selectData = item.selectData.concat(arr)
                }
            });
            this.setState({
                prodCustomTagList: list,
                cacheSalesList: data,
                searchConfig
            });
        }).catch(e => {
            message.error(e.errorDetail)
        })
    }
    formatList = (data) => { //渲染多个选项
        let searchConfig = this.state.searchConfig;
        let searchConfigItems = searchConfig.items;
        let labelType = [],
        labelActivity = [],
        labelStyle = [],
        labelOffer = [],
        labelFun = [];
        data.forEach((item, index)=>{
            let obj = {
                value: item.id,
                text: item.name
            }
            if(item.categoryName.includes("房源类型")) {
                labelType.push(obj)
            } else if(item.categoryName.includes("房源活动")) {
                labelActivity.push(obj)
            } else if(item.categoryName.includes("风格")) {
                labelStyle.push(obj)
            } else if(item.categoryName.includes("优惠券")) {
                labelOffer.push(obj)
            } else if(item.categoryName.includes("房源功能")) {
                labelFun.push(obj)
            } else {
            }
        })
        searchConfigItems.forEach((item,index)=>{
            if(item.key === "labelType") {
                item.selectData = labelType
            } else if(item.key === "labelActivity") {
                item.selectData = labelActivity
            } else if(item.key === "labelStyle") {
                item.selectData = labelStyle
            } else if(item.key === "labelOffer") {
                item.selectData = labelOffer
            } else if(item.key === "labelFun") {
                item.selectData = labelFun
            } else {
            }
        })
        this.setState({
            searchConfig
        },()=>{
            this.getCityList()
        })
    }

    init = () => { //初始化获取选项
        couponService.getHouseTagList().then((data) =>{
            this.formatList(data)
        })
    }

    classifyData = (data) => {
        let newData = {};
        let newList = [];
        data && data.forEach(item => {
            if(newData[item.categoryId]) {
                newList.forEach(newListItem => {
                    if(newListItem.categoryId === item.categoryId) {
                        newListItem.list.push(item);
                    }
                })
            }else {
                newList.push({
                    categoryId: item.categoryId,
                    categoryName: item.categoryName,
                    list: [{...item}]
                })
            }
            newData[item.categoryId] = item;
        })
        let sortAry = ['房源类型', '优惠券', '房源活动', '房源功能', '风格特色', '通用标签']
        let sortNewList = new Array(newList.length)
        newList.forEach((item, index) => {
            sortAry.forEach((ite, idx) => {
                if(item.categoryName === ite){
                    sortNewList[idx] = item
                }
            })
            if(!sortAry.includes(item.categoryName)){
                sortNewList.push(item)
            }
        })
        return sortNewList;
    }

    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    onSearch = (searchFields) => {
        // console.log(searchFields,"searchFieldssearchFieldssearchFieldssearchFields")
        this.setState({
            pageNum: 1,
            searchFields:{
                bu: searchFields.bu.value,
                assist: searchFields.assist.value,
                landlord: searchFields.landlord.value,
                roomNumber: searchFields.roomNumber.value,
                houseSourceStatus: searchFields.houseSourceStatus.value,
                toiletNumber: searchFields.toiletNumber.value,
                balconyNumber: searchFields.balconyNumber.value,
                tenantNumber: searchFields.tenantNumber.value,
                houseStatusIn: !!searchFields.houseStatusIn.value ? searchFields.houseStatusIn.value.join(',') : undefined,
                bedNumber: searchFields.bedNumber.value,
                houseNo: searchFields.houseNo.value,
                keyword: searchFields.keyword.value,
                facility: searchFields.facility.value.length > 0 ? JSON.stringify(searchFields.facility.value) : undefined,
                // tagId: searchFields.tagId.value,
                buArea: !!searchFields.buArea.value.length > 0 ? searchFields.buArea.value[searchFields.buArea.value.length - 1] : undefined,
                houseActivityTag: searchFields.labelActivity.value,
                houseTypeTag: searchFields.labelType.value,
                houseStyleTag: searchFields.labelStyle.value,
                houseCouponTag: searchFields.labelOffer.value,
                houseFunctionTag: searchFields.labelFun.value,
                city: searchFields.city.value
            }
        }, this.renderTable)
    }
    handleTabsChange = (key) => {
        if(!!this.state.data.list && this.state.data.list.length > 0 && key === '2' ){
            let ids = []
            this.state.data.list.forEach(item => {
                ids.push(item.houseSourceId)
            })
            this.setState({
                houseIds: ids.join(',')
            }, () => {
                this.setState({
                    activeKeyTabs: key
                })
            })
        }else if(key === '1'){
            this.setState({
                activeKeyTabs: key
            },this.renderTable)
        }else{
            message.warning('未选取房源，请输入房源编号、关键字、上线状态等查询获取房源')
        }
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    //设置房源标签
    handleSettingLabel = () => {
        this.setState({
            checkVisibleModal: true
        })
    }
    handleLabelEvent = (type) => {
        this.setState({
            settingType: type
        })
    }
    renderTable = () => {
        this.setState({
            tableLoading: true
        })
        // console.log(this.state.searchFields,"this.state.searchFields")
        houseManageListService.getTable({
            ...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }).then((res) => {
            this.setState({
                data: res || {},
                tableLoading: false
            })
        }).catch(err => {
            this.setState({
                tableLoading: false
            })
        })
    }
    handleCheckBoxModalCancel = () => {
        this.setState({
            checkVisibleModal: false,
            settingType: "sales"
        })
    }
    //获取图片
    handleHouseImage = (val) => {
        houseManageListService.fetchHouseImages(val).then((res) => {
            this.setState({
                houseImages: res,
                isShowPhotos: true
            })
        })
    }
    handleSettingModalOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = values
                let params = {
                    houseIds: this.state.selectedRowKeys
                }
                if(!!data.delTagIdList){
                    let arr = []
                    data.delTagIdList.forEach(item => {
                        this.state.cacheSalesList.forEach(customItem => {
                            if(item === customItem.id) {
                                arr.push(customItem.id)
                            }
                        })
                    })
                    params.tagIds = arr
                    houseManageListService.delHouseCustomerTag(params).then((e) => {
                        message.success('删除成功！')
                        this.setState({
                            checkVisibleModal: false,
                            selectedRowKeys: []
                        }, () => {
                            this.renderTable()
                        })
                    })
                }
                if(!!data.tagIdList){
                    let arr = []
                    data.tagIdList.forEach(item => {
                        this.state.cacheSalesList.forEach(customItem => {
                            if(item === customItem.id) {
                                arr.push(customItem)
                            }
                        })
                    })
                    params.houseTagMaps = arr
                    houseManageListService.setHouseCustom(params).then((e) => {
                        message.success('设置成功！')
                        this.setState({
                            checkVisibleModal: false,
                            selectedRowKeys: []
                        }, () => {
                            this.renderTable()
                        })
                    })
                }
                if(!!data.houseSourceStatus) {
                    params.houseSourceStatus = data.houseSourceStatus
                    houseManageListService.setHouseStatus(params).then((e) => {
                        message.success('设置成功！')
                        this.setState({
                            checkVisibleModal: false,
                            selectedRowKeys: []
                        }, () => {
                            this.renderTable()
                        })
                    })
                }
            }
        })
    }
    onTRef = (ref) => {
        this.refHouseDetailComponent = ref
    }
    getHouseCleanTableList = () => {
        cleanKeepingService.getHouseCleanTable(this.state.houseInfo.houseSourceId).then(res => {
            this.setState({
                cleanFeeLise: res
            })
        }).catch(err => {

        })
    }

    cleanSettingSave = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = values
                this.state.ruleTypeList.forEach(item => {
                    if(item.id === params.ruleId) {
                        params.ruleType = item.ruleType
                    }
                })
                if(this.state.cleanOperateDes === 'add') {
                    params.houseSourceId = this.state.houseInfo.houseSourceId
                    cleanKeepingService.addSubmitHouseCleanFee(params).then(res => {
                        message.success('新增成功！')
                        this.setState({
                            showCleanSetting: false
                        }, this.getHouseCleanTableList)
                    })
                }else {
                    params.id = this.state.cleanFeeInfo.id
                    params.houseSourceId = this.state.cleanFeeInfo.houseSourceId
                    cleanKeepingService.editSubmitHouseCleanFee(params).then(res => {
                        message.success('修改成功！')
                        this.setState({
                            showCleanSetting: false
                        }, this.getHouseCleanTableList)
                    })
                }

            }
        })
    }

    openTagManageModal = (record) => {
        this.setState({
            tagManageModalVisible: true,
            checkItem: record
        })
    }

    handleCancel = () => {
        this.setState({
            tagManageModalVisible: false,
            checkItem: {}
        })
    }

    tagManageModalOnSubmit = (tagIds) => {
        const {houseSourceId} = this.state.checkItem
        const params = {
            houseId: houseSourceId,
            tagIds: tagIds
        }
        tagManageService.saveCustomerTagMap(params).then((data) => {
            this.setState({
                tagManageModalVisible: false,
                checkItem: {}
            })
            message.success('保存成功')
        })
    }

    render () {
        let { data, selectedRowKeys, isShowPhotos, tableLoading, showCleanSetting, showCleanTable, cleanFeeLise, cleanOperateDes, cleanFeeInfo, ruleTypeList } = this.state
        let that = this
        const columns = [
            {title: '房源编号&简称', dataIndex: 'houseNoName', width: 150, fixed: 'left'},
            {title: '房源地址', dataIndex: 'address', width: 150},
            {title: '房源标题', dataIndex: 'title', width: 150},
            {title: '房东', dataIndex: 'landlord', width: 150},
            {title: 'BU', dataIndex: 'buArea', width: 150},
            {title: 'BU总管', dataIndex: 'bu', width: 150},
            {title: '房东助理', dataIndex: 'assist', width: 150},
            {title: '销售标签', dataIndex: 'houseMappings', width: 150},
            {title: '管理状态', dataIndex: 'houseSourceStatus', width: 150, render: val => {
                return (
                    <span>
                        { houseManageSearch.houseManageTag[val] || '' }
                    </span>
                )
            }},
            {title: '上线状态', dataIndex: 'houseStatus', width: 150, render: val => {
                return (
                    <span>
                        {houseManageSearch.houseStatus[val]}
                    </span>
                )
            }},
            {title: '户型', dataIndex: 'houseRoom', width: 150},
            {title: '适宜人数', dataIndex: 'tenantNumber', width: 150},
            {title: '床位', dataIndex: 'bedNumber', width: 150},
            {title: '平日价', dataIndex: 'standardPrice', width: 150, render: (val,record) => {
                return (
                    <span>
                        {record.currency}{val}
                    </span>
                )
            }},
            {title: '周末价', dataIndex: 'weekPrice', width: 150, render: (val,record) => {
                return (
                    <span>
                        {record.currency}{val}
                    </span>
                )
            }},
            {title: '清洁费', dataIndex: 'clearPrice', width: 150, render: (val,record) => {
                return (
                    <span>
                    {record.currency}{val}
                </span>
                )
            }},
            {title: '保证金', dataIndex: 'deposit', width: 150, render: (val,record) => {
                return (
                    <span>
                    {record.currency}{val}
                </span>
                )
            }},
            {title: '图片', dataIndex: 'images', width: 150, render: val => {
                return (
                    val === null ?
                    <span>暂无房源图片</span> :
                    <a onClick={function () {
                    that.handleHouseImage(val)
                    }}
                    >
                        查看图片
                    </a>
                )
            }},
            {title: '路客链接', dataIndex: 'localsUrl', width: 150, render: val => {
                return val === '房源未上线' ? '房源未上线' : (<a target="_blank" href={val}>路客链接</a>)
            }},
            {title: 'airbnb链接', dataIndex: 'airbnbUrl', width: 150, render: val => {
                return val === '房源未上线' ? '房源未上线' : (<a target="_blank" href={val}>airbnb链接</a>)
            }},
            {title: '途家链接', dataIndex: 'tujiaUrl', width: 150, render: val => {
                return val === '房源未上线' ? '房源未上线' : (<a target="_blank" href={val}>途家链接</a>)
            }},
            {title: 'booking链接', dataIndex: 'bookingUrl', width: 150, render: val => {
                return val === '房源未上线' ? '房源未上线' : (<a target="_blank" href={val}>booking链接</a>)
            }},
            {title: '便利设施', dataIndex: 'facility', width: 300, render: val => {
                return (
                    <div className="house-manage-tap-wrapper">
                        {val}
                    </div>
                )
            }},
            {
                title: '操作',
                width: 80,
                fixed: 'right',
                render: function (record) {
                    return (
                        <div>
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                style={{marginBottom: '5px'}}
                                onClick={that.refHouseDetailComponent.preOnLine(record)}
                            >房源详情</Button>
                            {
                                equalsUserExistSuperAuth(['AUTH_ADMIN','AUTH_SUPER','AUTH_CLEANER_AREA', 'AUTH_CLEANER_BU']) ? (
                                    <Button
                                        type="primary"
                                        size="small"
                                        name="lookPick"
                                        style={{marginBottom: '5px'}}
                                        onClick={function () {
                                            cleanKeepingService.getCleanRules().then(resRules => {
                                                that.setState({
                                                    showCleanTable: true,
                                                    houseInfo: record,
                                                    ruleTypeList: resRules
                                                }, that.getHouseCleanTableList)
                                            })

                                        }}
                                    >
                                        保洁信息
                                    </Button>
                                ) : null
                            }
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                onClick={function () {
                                    that.openTagManageModal(record)
                                }}
                            >标签管理</Button>
                        </div>
                    )
                }
            }]

        const pagination = {
            total:Number(data && data.total ? data.total : 0),
            pageSize: this.state.pageSize,
            showSizeChanger: true,
            pageSizeOptions: this.state.pageSizeOptions,
            current: this.state.pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize },this.renderTable)
            },
            onChange: (value,pageSize) => {
                this.setState({ 'pageNum': value, pageSize },this.renderTable)
            }
        }

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 }
            }
        }
        const cleanColumns = [
            {title: '保洁佣金', dataIndex: 'cleanFee', width: 150, render: val => {
                    return <span>{val}元</span>
                }},
            {title: '保洁时长', dataIndex: 'cleanDuration', width: 150, render: val => {
                return <span>{val}小时</span>
                }},
            {title: '保洁类型', dataIndex: 'ruleId', width: 150, render: val => {
                    let name = ''
                    ruleTypeList.forEach(item => {
                        if(item.ruleId === val) {
                            name = item.ruleName
                        }
                    })

                return <span>{name}</span>
                }},
            {
                title: '操作',
                width: 100,
                fixed: 'right',
                render: function (record) {
                    return (
                        <div>
                            <Button
                                type="primary"
                                size="small"
                                name="lookPick"
                                style={{marginBottom: '5px'}}
                                onClick={function () {
                                    that.setState({
                                        showCleanSetting: true,
                                        cleanOperateDes: 'edit',
                                        cleanFeeInfo: record
                                    })
                                }}
                            >编辑</Button>
                        </div>
                    )
                }
            }
        ];
        return (
            <div>
                <Tabs type="card" activeKey={this.state.activeKeyTabs} onChange={this.handleTabsChange}>
                    <TabPane tab="房源" key="1">
                        {
                            this.state.prodCustomTagList.length > 0 ? <Search onSubmit={this.onSearch} config={this.state.searchConfig} /> : null
                        }
                        <Button
                            type="primary"
                            style={{marginBottom: 10}}
                            disabled={selectedRowKeys.length === 0}
                            onClick={this.handleSettingLabel}
                        >
                            设置
                        </Button>
                        <Table
                            bordered
                            rowSelection={rowSelection}
                            rowKey="houseSourceId"
                            columns={columns}
                            dataSource={data.list}
                            scroll={{ x: 3750 }}
                            pagination={pagination}
                            loading={tableLoading}
                        />
                    </TabPane>
                    <TabPane tab="房态" key="2">
                        {
                            this.state.activeKeyTabs === '2' ? <RoomStatusList houseIds={this.state.houseIds} /> : null
                        }
                    </TabPane>
                </Tabs>
                <HouseManageDetail onTRef={this.onTRef} />
                {
                    this.state.tagManageModalVisible &&
                    <TagManageModal
                        visible={this.state.tagManageModalVisible}
                        checkItem={this.state.checkItem}
                        handleCancel={this.handleCancel}
                        onSubmit={this.tagManageModalOnSubmit}
                        prodCustomTagList={this.state.prodCustomTagList}
                        cacheSalesList={this.state.cacheSalesList}
                    />
                }
                {
                    this.state.checkVisibleModal ?
                        <Modal
                            title="设置"
                            visible
                            onOk={this.handleSettingModalOk}
                            onCancel={this.handleCheckBoxModalCancel}
                        >
                            <div className="setting-label-btn-wrap">
                                <ButtonGroup>
                                    <Button onClick={function () {
                                        that.handleLabelEvent('delete')
                                    }} type={this.state.settingType === 'delete' ? 'primary' : 'default'}
                                    >删除销售标签</Button>
                                    <Button onClick={function () {
                                        that.handleLabelEvent('sales')
                                    }} type={this.state.settingType === 'sales' ? 'primary' : 'default'}
                                    >设置销售标签</Button>
                                    <Button disabled={!Global.role.includes('AUTH_HOUSE_MANAGE')}
                                        onClick={function () {
                                        that.handleLabelEvent('manage')
                                    }} type={this.state.settingType === 'manage' ? 'primary' : 'default'}
                                    >设置管理状态</Button>
                                </ButtonGroup>
                            </div>

                            <Form>
                                {
                                    this.state.settingType === 'delete' ? (
                                        this.state.prodCustomTagList.map((tagItem, index)=> {
                                            return (
                                                <FormItem
                                                    key={tagItem.categoryId + index}
                                                    {...formItemLayout}
                                                    label={tagItem.categoryName}
                                                >
                                                    {getFieldDecorator('delTagIdList', {
                                                        initialValue: []
                                                    })(
                                                        <CheckboxGroup style={{width:"100%"}}>
                                                            <Row type="flex" justify="start" >
                                                                {tagItem.list.map(item=>{
                                                                    return <Col flex={6} key={item.id}><Checkbox value={item.id}>{item.name}</Checkbox></Col>
                                                                })}
                                                            </Row>
                                                        </CheckboxGroup>
                                                    )}
                                                </FormItem>
                                            )
                                        })
                                    ) : null
                                }
                                {
                                    this.state.settingType === 'sales' ? (
                                        this.state.prodCustomTagList.map(tagItem => {
                                            return (
                                                <FormItem
                                                    key={tagItem.categoryId}
                                                    {...formItemLayout}
                                                    label={tagItem.categoryName}
                                                >
                                                    {getFieldDecorator('tagIdList', {
                                                        initialValue: []
                                                    })(
                                                        <CheckboxGroup style={{width:"100%"}}>
                                                            <Row type="flex" justify="start" >
                                                                {tagItem.list.map(item=>{
                                                                    return <Col flex={6} key={item.id}><Checkbox value={item.id}>{item.name}</Checkbox></Col>
                                                                })}
                                                            </Row>
                                                        </CheckboxGroup>
                                                    )}
                                                </FormItem>
                                            )
                                        })
                                    ) : null
                                }
                                {
                                    this.state.settingType === 'manage' ?
                                        <FormItem
                                            {...formItemLayout}
                                            label="管理状态"
                                        >
                                            {getFieldDecorator('houseSourceStatus')(
                                                <Select style={{ width: 300 }} placeholder="请选择管理状态">
                                                    <Option value="0">问题</Option>
                                                    <Option value="1">正常</Option>
                                                    <Option value="2">解约</Option>
                                                </Select>
                                            )}
                                        </FormItem> : null
                                }
                            </Form>
                        </Modal> : null
                }
                {
                    isShowPhotos ?
                        <LayerPhotos imagesDetail={this.state.houseImages} handleCancelPhotos={function () {
                            that.setState({
                                isShowPhotos: false
                            })
                        }}
                        /> : null
                }
                {
                    showCleanTable ?
                        <Modal
                        width={600}
                        visible
                        title="保洁信息列表"
                        onCancel={function () {
                            that.setState({showCleanTable: false})
                        }}
                        className="hideModel-okBtn"
                        >
                        <div style={{marginBottom: 5}}>
                            <Button type="primary" onClick={function () {
                                that.setState({
                                    cleanFeeInfo: {},
                                    cleanOperateDes: 'add',
                                    showCleanSetting: true
                                })
                            }}
                            >新增</Button>
                        </div>
                        <Table
                            bordered
                            rowKey="id"
                            columns={cleanColumns}
                            dataSource={cleanFeeLise}
                            pagination={false}
                        />
                    </Modal> : null
                }
                {
                    showCleanSetting ?
                        <Modal
                            visible
                            title={cleanOperateDes === 'add' ? '新增配置' : '修改配置'}
                            onOk={this.cleanSettingSave}
                            onCancel={function () {
                                that.setState({showCleanSetting: false})
                            }}
                        >
                            <Form>
                                <FormItem
                                    {...formItemLayout}
                                    label="保洁时长"
                                >
                                    <Row>
                                        <Col span={20}>
                                            {getFieldDecorator('cleanDuration', {
                                                initialValue: cleanFeeInfo.cleanDuration,
                                                rules: [
                                                    { required: true, message: '保洁时长不能为空' },
                                                    { validator (rule, value, callback) {
                                                            if(value === '' || value == null){
                                                                callback()
                                                                return
                                                            }else if(value.length > 8) {
                                                                callback('不可大于8位数');
                                                            }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                                                callback('请输入数字');
                                                            }else{
                                                                callback()
                                                            }
                                                        }}
                                                ]
                                            })(
                                                <Input />
                                            )}
                                        </Col>
                                        <Col span={4} style={{textAlign: 'center'}}>小时</Col>
                                    </Row>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="保洁佣金"
                                >
                                    <Row>
                                        <Col span={20}>
                                            {getFieldDecorator('cleanFee', {
                                                initialValue: cleanFeeInfo.cleanFee,
                                                rules: [
                                                    { required: true, message: '保洁佣金不能为空' },
                                                    { validator (rule, value, callback) {
                                                            if(value === '' || value == null){
                                                                callback()
                                                                return
                                                            }else if(value.length > 8) {
                                                                callback('不可大于8位数');
                                                            }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                                                callback('请输入数字');
                                                            }else{
                                                                callback()
                                                            }
                                                        }}
                                                ]
                                            })(
                                                <Input />
                                            )}
                                        </Col>
                                        <Col span={4} style={{textAlign: 'center'}}>元</Col>
                                    </Row>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="保洁类型"
                                >
                                    <Row>
                                        <Col span={20}>
                                            {getFieldDecorator('ruleId', {
                                                initialValue: cleanFeeInfo.ruleId,
                                                rules: [
                                                    { required: true, message: '保洁佣金不能为空' }
                                                ]
                                            })(
                                                <Select placeholder="请选择">
                                                    {
                                                        ruleTypeList.map((item,index) => {
                                                            return <Option key={index} value={item.ruleId}>{item.ruleName}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Col>
                                    </Row>

                                </FormItem>
                            </Form>
                        </Modal> : null
                }
            </div>
        )
    }
}

HouseManageList = Form.create()(HouseManageList)
export default HouseManageList
