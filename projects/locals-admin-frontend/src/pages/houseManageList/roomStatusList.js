import React, {Component} from 'react'
import moment from 'moment';
import {Table,Tooltip,Checkbox,Modal,Button,Form,Input,Row,Col,Select,DatePicker,Popconfirm} from 'antd'
import {houseManageListService, orderService} from '../../services'
import {dataFormat, searchObjectSwitchArray} from "../../utils/utils"
import Search from '../../components/search'
import {selectRoomSource, roomSource, sourseType, orderStatusType} from "../../utils/dictionary"
import {message} from "antd/lib/index"
import './index.less'


const ButtonGroup = Button.Group
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker;
const { TextArea } = Input;

let searchConfig = {
    items: [
        {
            type: 'text',
            name: '房源编码',
            key: 'houseNo',
            searchFilterType: 'string',
            placeholder: '请输入房源编码'
        },
        {
            type: 'rangepicker',
            name: '日期',
            key: 'dateList',
            searchFilterType: 'string',
            defaultValue: ''
        },
        {
            type: 'checkbox',
            name: '是否显示空房',
            key: 'isShowEmptyHouse',
            checkboxData: [
                {label: '', value: '1'}
            ],
            searchFilterType: 'select',
            defaultValue: []
        }
        // ,{
        //     type: 'select',
        //     name: '房源状态',
        //     key: 'status',
        //     selectData: searchObjectSwitchArray(roomStatusSearch),
        //     searchFilterType: 'select',
        //     defaultValue: '',
        //     placeholder: '请选择'
        // }
        // ,{
        //     type: 'rangeInput',
        //     name: '价格',
        //     key: 'rangePrice',
        //     searchFilterType: 'string',
        //     defaultLeftValue: '',
        //     defaultRightValue: '',
        //     rangeLeftPlaceholder: '不限',
        //     rangeRightPlaceholder: '不限'
        // }
    ]
}
class RoomStatusList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            memberHousesList: [],
            searchConfig: searchConfig,
            searchFields: {
                houseSourceIds: props.houseIds,
                startDate: '',
                endDate: '',
                isShowEmptyHouse: false
            },
            selectedHouseDate: {
                key: '', //房源id
                rangeDate: []
            },
            orderIds: [], //订单编号数组
            orderInfo: {}, //单个订单详情信息
            orderInfoList: [], //订单列表
            roomVisibleModal: false,
            orderModalVisible: false,
            formParams: {},
            typeString: 'editPrice',
            modalFormConfig: [],
            loading: false
        }

    }
    componentDidMount () {
        this.renderTable()
    }

    onSearch = (searchFields) => {
        let params = this.state.searchFields

        if(!!searchFields.houseNo.value) {
            params.houseSourceIds = undefined
            params.houseNo = searchFields.houseNo.value
        }else {
            params.houseSourceIds = this.props.houseIds
            params.houseNo = undefined
        }

        if (!!searchFields.dateList.value) {
            params.startDate = dataFormat(searchFields.dateList.value[0])
            params.endDate = dataFormat(searchFields.dateList.value[1])
        }else{
            params.startDate = ''
            params.endDate = ''
        }
        params.isShowEmptyHouse = searchFields.isShowEmptyHouse.value.length === 1
        this.setState({
            searchFields: params
        }, this.renderTable)
    }
    renderTable = () => {
        this.setState({
            loading: true
        })
        houseManageListService.getRoomStatusTable({
            ...this.state.searchFields,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }).then((res) => {
            //默认在房源日期集合中添加isActive字段，作为标识是否选中当前td
            if(!!res) {
                res.memberHousesList.forEach(houseInfo => {
                    houseInfo.houseCalendarList.forEach(item => {
                        item.isActive = false
                    })
                })
                this.setState({
                    memberHousesList: res.memberHousesList
                })
            }
            this.setState({
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }
    //获取订单详情信息
    getOrderDetail = () => {
        houseManageListService.getTrendsOrders({
            orderNos: this.state.orderIds.join(',')
        }).then((res) => {
            this.setState({
                orderModalVisible: true,
                orderInfoList: res
            })
        })
    }
    isInArray = (arr,value) => {
        for(let i = 0; i < arr.length; i++){
            if(value === arr[i]){
                return true;
            }
        }
        return false;
    }
    //计算日期天数差
    handleCountDate = (startDate,endDate,moment) => {
        return moment(endDate).diff(moment(startDate).format('YYYY-MM-DD'),'day')
    }
    //选择是否刷单
    onChangeCheckbox = (e) => {
        houseManageListService.calendarTrandsOrderType({
            orderNo: this.state.orderInfo.orderNo,
            orderType: e.target.checked ? 2 : 0
        }).then((res) => {
            this.getOrderDetail()
        })
    }
    // 房东自住
    onChangeCheckboxOneSelf = (e) => {
        houseManageListService.selfOccupation({
            bookingId: this.state.orderInfo.orderNo
        }).then((res) => {
            this.getOrderDetail()
        })
    }
    //操作房态
    handleRoomModalOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = values

                const selectedHouseDate = {
                    key: '',
                    rangeDate: []
                }
                if(this.state.typeString === 'editPrice') {
                    let params = {
                        ...this.state.formParams,
                        ...data
                    }
                    let startDate = moment(params.checkDate[0]).valueOf()
                    let endDate = moment(params.checkDate[1]).valueOf()
                    let days = (endDate - startDate) / 24000 / 3600 + 1
                    let dates = []
                    for(let i = 0; i < days; i++){
                        dates.push(moment(params.checkDate[0]).add(i, 'day').format('YYYY-MM-DD'))
                    }
                    params.dates = dates
                    if(params.beds === 0) {
                        message.warning('请先在房源维护设置床位个数，再设置价格');
                        return;
                    }else {
                        if(Number(params.price) > (params.beds * 1500)) {
                            message.warning('价格不可大于房屋床位个数乘以1500');
                            return;
                        }
                    }

                    houseManageListService.fetchBackstageCalendarPrice(params).then((res) => {
                        message.success('修改成功！')
                        this.setState({
                            roomVisibleModal: false,
                            selectedHouseDate
                        }, this.renderTable)
                    }).catch(err => {

                    })
                }else if(this.state.typeString === 'order') {
                    let params = {
                        ...this.state.formParams,
                        ...data
                    }
                    //下单时，截止时间加一天
                    params.checkInDate = moment(params.checkDate[0]).format('YYYY-MM-DD')
                    params.checkOutDate = moment(params.checkDate[1]).add(1,'days').format('YYYY-MM-DD')

                    houseManageListService.fetchHandedOrder(params).then((res) => {
                        message.success('添加成功！')
                        if(this.state.orderModalVisible){
                            this.getOrderDetail()
                        }
                        this.setState({
                            roomVisibleModal: false,
                            selectedHouseDate
                        }, this.renderTable)
                    })
                }else if(this.state.typeString === 'shield') {
                    let params = {
                        houseSourceId: this.state.formParams.houseSourceId,
                        checkInDate: dataFormat(data.checkDate[0]),
                        checkOutDate: dataFormat(data.checkDate[1]),
                        occupationRemark: data.occupationRemark
                    }
                    houseManageListService.calenderBlocking(params).then((res) => {
                        message.success('屏蔽成功！')
                        this.setState({
                            roomVisibleModal: false,
                            selectedHouseDate
                        }, this.renderTable)
                    })
                }else if(this.state.typeString === 'maintain') {

                }
            }
        })
    }
    handleModalType = (typeString) => {
        let formParams = null
        let modalFormConfig = []
        const dateArr = [dataFormat(this.state.selectedHouseDate.rangeDate[0]), dataFormat(this.state.selectedHouseDate.rangeDate[1])]
        if(typeString === 'editPrice') {
            formParams = {
                houseSourceId: this.state.selectedHouseDate.key,
                price: '',
                beds: 0,
                dates: []
            }
            modalFormConfig = [
                {
                    type: 'rangeDate', // text select
                    name: '日期',
                    key: 'checkDate',
                    searchFilterType: 'select',
                    defaultValue: dateArr,
                    format: 'YYYY-MM-DD',
                    rules: [
                        { required: true, message: '请选择日期' }
                    ]
                },
                {
                    type: 'text', // text select
                    name: '价格',
                    key: 'price',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入房态价格',
                    rules: [
                        { required: true, message: '价格不能为空' },
                        { validator (rule, value, callback) {
                                if(value == null){
                                    callback()
                                    return
                                }else if(value < 100) {
                                    callback('价格不可低于100')
                                }else if(value.length > 8) {
                                    callback('价格不可大于8位数')
                                }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                    callback('价格输入有误')
                                }else{
                                    callback()
                                }
                            }}
                    ]
                }
            ]
            this.state.memberHousesList.forEach(houses => {
                houses.houseCalendarList.forEach(order => {
                    if(order.isActive){
                        formParams.dates.push(dataFormat(order.date))
                        formParams.beds = !!houses.beds ? houses.beds : 0
                    }
                })
            })
        }else if(typeString === 'order') { //手工单
            formParams = {
                houseSourceId: this.state.selectedHouseDate.key,
                checkInDate: dataFormat(this.state.selectedHouseDate.rangeDate[0]),
                checkOutDate: dataFormat(this.state.selectedHouseDate.rangeDate[1]),
                bookingMemberName: '',
                bookingMemberMobile: '',
                tenantNumber: '',
                orderTotalPrice: '',
                source: ''
            }
            modalFormConfig = [
                {
                    type: 'rangeDate', // text select
                    name: '日期',
                    key: 'checkDate',
                    searchFilterType: 'select',
                    defaultValue: dateArr,
                    format: 'YYYY-MM-DD',
                    rules: [
                        { required: true, message: '请选择日期' }
                    ]
                },
                {
                    type: 'select', // text select
                    name: '来源',
                    key: 'source',
                    searchFilterType: 'string',
                    defaultValue: '',
                    selectData: searchObjectSwitchArray(selectRoomSource),
                    placeholder: '请选择手工单来源',
                    rules: [
                        { required: true, message: '来源不能为空' }
                    ]
                },{
                    type: 'text',
                    name: '平台',
                    key: 'sourceRemark',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入订单实际的来源平台',
                    rules: [
                        { required: true, message: '来源平台不能为空' }
                    ]
                },
                {
                    type: 'text',
                    name: '平台订单号',
                    key: 'apiOrderId',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入订单实际的来源平台订单号',
                    rules: [
                        { required: true, message: '来源平台订单号不能为空' }
                    ]
                },
                {
                    type: 'text', // text select
                    name: '客人姓名',
                    key: 'bookingMemberName',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入客人姓名',
                    rules: [
                        { required: true, message: '客人姓名不能为空' }
                    ]
                },
                {
                    type: 'text', // text select
                    name: '手机号码',
                    key: 'bookingMemberMobile',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入客户手机号码',
                    rules: [
                        { required: true, message: '客户手机号码不能为空' },
                        { validator (rule, value, callback) {
                                if(value == null){
                                    callback()
                                    return
                                }else if(!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/).test(value)) {
                                    callback('手机输入有误')
                                }else{
                                    callback()
                                }
                            }}
                    ]
                },
                {
                    type: 'text', // text select
                    name: '入住人数',
                    key: 'tenantNumber',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入入住人数',
                    rules: [
                        { required: true, message: '入住人数不能为空' }
                    ]
                },
                {
                    type: 'text', // text select
                    name: '订单总额',
                    key: 'orderTotalPrice',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入订单总额',
                    rules: [
                        { required: true, message: '订单总额不能为空' },
                        { validator (rule, value, callback) {
                                if(value == null){
                                    callback()
                                    return
                                }else if(value < 100) {
                                    callback('总金额不可低于100')
                                }else if(value.length > 8) {
                                    callback('价格不可大于8位数')
                                }else if(!(/^[0-9]+(.[0-9]*)?$/).test(value)) {
                                    callback('价格输入有误')
                                }else{
                                    callback()
                                }
                            }}
                    ]
                }
            ]
        }else if(typeString === 'shield') { //屏蔽
            formParams = {
                houseSourceId: this.state.selectedHouseDate.key,
                occupationRemark: '',
                checkDate: dateArr
            }
            modalFormConfig = [
                {
                    type: 'rangeDate', // text select
                    name: '日期',
                    key: 'checkDate',
                    searchFilterType: 'select',
                    defaultValue: dateArr,
                    format: 'YYYY-MM-DD',
                    rules: [
                        { required: true, message: '请选择' }
                    ]
                },
                {
                    type: 'textArea',
                    name: '屏蔽原因',
                    key: 'occupationRemark',
                    searchFilterType: 'string',
                    defaultValue: '',
                    placeholder: '请输入屏蔽原因',
                    rules: [
                        { required: true, message: '屏蔽原因不能为空' }
                    ]
                }
            ]
        }else if(typeString === 'maintain') {

        }
        let formData = {}
        Object.entries(modalFormConfig).forEach(([key, value]) => {
            formData[value.key] = value.defaultValue
            return ''
        })
        this.setState({
            typeString,
            formParams,
            modalFormConfig
        }, () => this.props.form.setFieldsValue(formData))
    }
    handleOrderCancel = () => {
        this.setState({
            orderModalVisible: false
        })
    }
    //取消修改房态
    handleRoomModalCancel = () => {
        this.setState({
            roomVisibleModal: false
        })
    }
    //打开修改房态modal
    openRoomModal = () => {
        this.setState({
            roomVisibleModal: true
        }, () => {
            this.handleModalType('editPrice')
        })
    }
    onDeleteOrderClick = (orderInfo) => {
        orderService.handOrderCancel(orderInfo.orderNo).then((res) => {
            message.success('订单取消成功！')
            this.setState({
                orderModalVisible: false
            }, this.renderTable())
        }).catch(err => {

        })
    }
    cancelReleaseBlocking = (record,fristIndex,count) => {
        const lastIndex = (count) + fristIndex
        const checkInDate = record.houseCalendarList[fristIndex].date
        const checkOutDate = record.houseCalendarList[lastIndex - 1].date
        const params = {
            houseSourceId: record.houseSourceId,
            checkInDate: dataFormat(checkInDate),
            checkOutDate: dataFormat(checkOutDate)
        }
        houseManageListService.cancelCalenderBlocking(JSON.stringify(params)).then((res) => {
            message.success('解除成功')
            this.renderTable()
        })
    }
    //处理房态屏蔽信息
    handleForEachSameShieldList = (allCalendarList, index) => {
        let count = 0
        if(!!allCalendarList) {
            let isShield = false
            //若上一个日期有屏蔽信息或者订单信息，就进行如下处理
            if(index > 0 && !!allCalendarList[index - 1].calendarOccupationList) {

                allCalendarList[index - 1].calendarOccupationList.forEach(item => {
                    //判断是否有屏蔽单,并且判断上一个日期和当前日期的备注是否一致
                    if(item.occupationType === 5) {
                        allCalendarList[index].calendarOccupationList.forEach(currentItem => {
                            //若上一个日期的备注为空或者上一个日期的备注和当前备注是否相同，若相同，视为有屏蔽单
                            if(!item.occupationRemark || currentItem.occupationRemark === item.occupationRemark) {
                                isShield = true
                            }
                        })
                    }
                })

                //若上一个日期没有屏蔽单，并且没有订单或者当前日期没有订单，就设为true
                let preFlag = (!isShield || allCalendarList[index - 1].calendarOrderList !== null) && allCalendarList[index].calendarOrderList === null

                for(let i = index; i <= allCalendarList.length - 1; i++){
                    if(!!allCalendarList[i].calendarOccupationList) {
                        let isRange = false
                        for(let j = 0; j < allCalendarList[i].calendarOccupationList.length; j++) {
                            let item = allCalendarList[i].calendarOccupationList[j]
                            //当前item的type等于5,需要统计屏蔽数
                            if(preFlag && allCalendarList[i].calendarOrderList === null && item.occupationType === 5) {
                                isRange = true
                            }
                        }
                        if(isRange) {
                            count++
                        }else{
                            break;
                        }
                    }else {//当前的屏蔽为空时，跳出循环
                        break;
                    }
                }
                /**
                 * 注：增加这行代码，是因为上面的逻辑有个bug，就是在当前item的订单为空，并且item的上一个下标item有订单数据时，会缺少展示屏蔽订单，
                 * 所以，该行代码是为了补上这个bug,若上一个item没有屏蔽单，并且屏蔽数为零、当前的订单信息为空时，直接设置当前item为一个屏蔽
                 *
                 * */
                if(!isShield && count === 0 && allCalendarList[index].calendarOrderList === null) {
                    count = 1
                }
            }else {
                //第一个日期判断
                for(let i = index; i <= allCalendarList.length - 1; i++){
                    if(!!allCalendarList[i].calendarOccupationList) {
                        let isRange = false
                        for(let j = 0; j < allCalendarList[i].calendarOccupationList.length; j++) {
                            let item = allCalendarList[i].calendarOccupationList[j]
                            if(item.occupationType === 5) {
                                isRange = true
                            }
                        }
                        if(isRange) {
                            count++
                        }else{
                            break;
                        }
                    }else {//当前的屏蔽为空时，跳出循环
                        break;
                    }
                }

            }
        }
        return {
            count: count //屏蔽天数
        }
    }
    //处理房态订单信息
    handleForEachSameOrderList = (allCalendarList,index) => {
        let count = 0
        let firstIndex = index
        let lastIndex = -1
        if(!!allCalendarList) {
            for(let i = index; i < allCalendarList.length; i++) {
                let lastLengthFlag = false
                //校对最后一个日期是否与前一个日期的订单相同
                if(i === (Number(allCalendarList.length - 1))) {
                    lastLengthFlag = true
                    if(this.compareBeforeAndAfterList(allCalendarList[i].calendarOrderList, allCalendarList[i - 1].calendarOrderList)) {
                        if(lastIndex !== -1) {
                            lastIndex = i
                        }
                    }
                }
                if(!lastLengthFlag) {
                    let flag = (i === Number(allCalendarList.length - 2))
                    //通过判断前后的订单对象，获取到最后订单日期下标
                    if(!this.compareBeforeAndAfterList(allCalendarList[i].calendarOrderList, allCalendarList[i + 1].calendarOrderList, flag)) {
                        lastIndex = i
                        if(!flag) {
                            break
                        }

                    }
                }
            }

            if(lastIndex === -1){ //只有一天房态被占用
                count = 1
                lastIndex = index
            }else{
                count = (lastIndex - firstIndex) + 1
            }
        }
        return {
            count: count, //订单占用天数
            lastIndex: lastIndex //订单最后日期下标
        }
    }
    //判断当前日期与前一天日期的订单是否有重复单号
    compareBeforeAndAfterList = (beforeList, afterList, lastLengthFlag) => {

        if(beforeList !== null && afterList !== null) {
            let flag = false
            beforeList.forEach(beforeItem => {
                afterList.forEach(afterItem => {
                    if(beforeItem.orderNo === afterItem.orderNo) {
                        flag = true
                    }
                })
            })
            //当时房态数组是最后一个元素，并且订单号与上一个房态订单一致时，返回false
            if(lastLengthFlag && flag){
                return false
            }
            return flag
        }
        return false
    }
    //发送密码
    handleSendPassClick = (orderInfo) => {
        houseManageListService.sendOrderPassword({
            bookingId: orderInfo.orderNo,
            phone: orderInfo.bookingMemberMobile
        }).then((res) => {
            message.success('发送成功！')
            this.getOrderDetail()
        })
    }
    //table选中
    handleSelectedEvent = (houseSourceId,houseIndex,orderIndex) => {
        let selectedHouseDate = this.state.selectedHouseDate
        const memberHousesList = this.state.memberHousesList
        const currentOrderInfo = memberHousesList[houseIndex].houseCalendarList[orderIndex]
        if(selectedHouseDate.rangeDate.length === 0){//选中第一个日期
            selectedHouseDate.key = houseSourceId
            selectedHouseDate.rangeDate.push(currentOrderInfo.date)
            currentOrderInfo.isActive = true
        }else if(selectedHouseDate.rangeDate.length === 1){ //选中第二个日期
            if(selectedHouseDate.key === houseSourceId){
                if(currentOrderInfo.date === selectedHouseDate.rangeDate[0]) {
                    //选中一天进行操作
                    selectedHouseDate.rangeDate.push(currentOrderInfo.date)
                }else if(currentOrderInfo.date > selectedHouseDate.rangeDate[0]) {

                    //代码非常冗余，大神帮忙重构一下？
                    let count = 0
                    for(let i = orderIndex; i > 0; i--) {
                        if(selectedHouseDate.rangeDate[0] === memberHousesList[houseIndex].houseCalendarList[i].date){
                            break
                        }
                        if (memberHousesList[houseIndex].houseCalendarList[i].calendarOrderList !== null && this.isAvailableOrderStatus(memberHousesList[houseIndex].houseCalendarList[i].calendarOrderList)) {
                            count++
                        }
                    }
                    if(count > 0) {
                        message.warning('当前区间有房态已被占用，不可选')
                        return
                    }
                    //选中多天进行操作
                    for(let i = orderIndex; i > 0; i--) {
                        const selectedDate = memberHousesList[houseIndex].houseCalendarList[i]
                        //当循环到第一个选中的对象时，跳出循环
                        if(selectedDate.date === selectedHouseDate.rangeDate[0]){
                            break
                        }else{
                            //将选中区间标记为true
                            memberHousesList[houseIndex].houseCalendarList[i].isActive = true
                        }
                    }

                    //只保存第一个日期和最后日期
                    if(selectedHouseDate.rangeDate.length === 1) {
                        selectedHouseDate.rangeDate.push(currentOrderInfo.date)
                    }else{
                        selectedHouseDate.rangeDate[1] = currentOrderInfo.date
                        //取消已经被选中的td
                        for(let i = orderIndex + 1; i < memberHousesList[houseIndex].houseCalendarList.length; i++) {
                            memberHousesList[houseIndex].houseCalendarList[i].isActive = false
                        }
                    }


                }else if(currentOrderInfo.date < selectedHouseDate.rangeDate[0]) {
                    //将日期小的设为第一个范围值
                    memberHousesList.forEach(houseInfo => {
                        houseInfo.houseCalendarList.forEach(item => {
                            item.isActive = false
                        })
                    })
                    selectedHouseDate.rangeDate = []
                    selectedHouseDate.rangeDate.push(currentOrderInfo.date)
                    currentOrderInfo.isActive = true
                }
            }else{
                //当点击的房源ID与上一次点击的ID不一致时，取消选中
                memberHousesList.forEach(houseInfo => {
                    houseInfo.houseCalendarList.forEach(item => {
                        item.isActive = false
                    })
                })
                selectedHouseDate.key = ''
                selectedHouseDate.rangeDate = []
            }
        }else{ //第三次选中日期时，视为重新选择
            memberHousesList.forEach(houseInfo => {
                houseInfo.houseCalendarList.forEach(item => {
                    item.isActive = false
                })
            })
            selectedHouseDate.key = houseSourceId
            selectedHouseDate.rangeDate = []
            selectedHouseDate.rangeDate.push(currentOrderInfo.date)
            currentOrderInfo.isActive = true
        }
        this.setState({
            memberHousesList,
            selectedHouseDate
        },() => {
            if(selectedHouseDate.rangeDate.length > 1) {
                this.setState({
                    roomVisibleModal: true
                }, () => {
                    this.handleModalType('editPrice')
                })
            }
        })
    }

    isAvailableOrderStatus = (list) => {
        let flag = false
        if(!!list) {
            //'1100': '已删除',
            list.forEach(item => {
                if(item.orderStatus !== '1100') {
                    flag = true
                }
            })
        }
        return flag
    }

    formInputBar = (item) => {
        const { getFieldValue } = this.props.form
        const that = this
        let opts = null
        if(item.type === 'select') {
            for(let i = 0; i < item.selectData.length; i++) {
                opts = item.selectData.map((v, i) => (<Option value={v.value} key={v.value}>{v.text}</Option>))
            }
        }
        const htmlStr = (
            <div>
                {item.type === 'text' ? <Input placeholder={item.placeholder} defaultValue={getFieldValue(item.key)}/> : null}
                {item.type === 'select' ?
                    <Select placeholder={item.placeholder} defaultValue={getFieldValue(item.key)} onChange={function (e) {
                        that.props.form.setFieldsValue({
                            [item.key]: e
                        })}}
                    >{ opts }</Select> : null
                }
                {(item.type === 'rangeDate' && getFieldValue(item.key)) ?
                    <RangePicker
                        onChange={function (e) {
                            that.props.form.setFieldsValue({
                                [item.key]: e
                            })}}
                        // getFieldValue(item.key)
                        defaultValue={[moment(getFieldValue(item.key)[0], item.format), moment(getFieldValue(item.key)[1], item.format)]}
                        // defaultValue={item.defaultValue}
                        format={item.format}
                    /> : null
                }
                {item.type === 'textArea' ? <TextArea defaultValue={getFieldValue(item.key)} placeholder={item.placeholder} rows={4} /> : null}
            </div>
        )
        return htmlStr
    }
    //类型文案转化
    transRoomSource = (currentOrderList,index) => {
        if(!!currentOrderList[index].calendarOrderList[0].source && sourseType[currentOrderList[index].calendarOrderList[0].source]) {
            if(currentOrderList[index].calendarOrderList[0].source === 'OTHER') {
                return '其他-' + currentOrderList[index].calendarOrderList[0].sourceRemark;
            }else if(currentOrderList[index].calendarOrderList[0].source === 'LONG_TERM'){
                return '长租' + currentOrderList[index].calendarOrderList[0].sourceRemark;
            }else {
                return sourseType[currentOrderList[index].calendarOrderList[0].source];
            }
        }else {
            return currentOrderList[index].calendarOrderList[0].source;
        }
    }
    onChangeRangeDate = (date) => {
        // selectedHouseDate
    }
    render () {

        let { memberHousesList, orderInfoList } = this.state
        let scrollX = 250
        const that = this
        let fixedFlag = memberHousesList.length > 0 && !!memberHousesList[0].houseCalendarList && memberHousesList[0].houseCalendarList.length > 8
        const columns = [
            {title: '房源编号&简称', dataIndex: 'houseNo', width: 250, fixed: fixedFlag ? 'left' : '',
                render: (val,record) => {
                    return (
                        <div className="code-wrapper">
                            <Tooltip placement="bottomLeft" title={'【' + record.houseNo + '】' + record.title}>
                                {'【' + record.houseNo + '】' + record.title}
                            </Tooltip>
                        </div>
                    )
                }
            }
        ]
        const orderColumns = [
            {title: '行程编号', dataIndex: 'randomId', width: 100},
            {title: '来源', dataIndex: 'source', width: 100, render: (val, record) => {
                    let apiOrderId = !!record.apiOrderId ? '(平台订单号：' + record.apiOrderId + ')' : ''

                    const sourceRemark = !!record.sourceRemark ? record.sourceRemark : '无'
                    let sourceName = ''
                    if(!!val && sourseType[val]) {
                        if(val === 'OTHER') {
                            sourceName = '其他-' + sourceRemark
                        }else if(val === 'LONG_TERM') {
                            sourceName = '长租-' + sourceRemark
                        }else{
                            sourceName = sourseType[val]
                        }
                    }else {
                        sourceName = val
                    }
                    return sourceName + apiOrderId
                }},
            {title: '客名', dataIndex: 'bookingMemberName', width: 100},
            {title: '电话', dataIndex: 'bookingMemberMobile', width: 100},
            {title: '入住房晚', dataIndex: 'checkInDate1', width: 100, render: (val,record) => {
                    return <span>{ this.handleCountDate(record.checkInDate,record.checkOutDate,moment) }</span>
                }},
            {title: '入住', dataIndex: 'checkInDate', width: 100, render: val => {
                    return <span>{dataFormat(val)}</span>
                }},
            {title: '离店', dataIndex: 'checkOutDate', width: 100, render: val => {
                    return <span>{dataFormat(val)}</span>
                }},
            {title: '订单状态', dataIndex: 'orderStatus', width: 100, render: val => <span>{val !== null ? orderStatusType[val] : ''}</span>},
            {title: '密码', dataIndex: 'doorPwd', width: 100, render: (val, record) => {
                    return (
                        <div>
                            <span>{val}</span>
                            {/*<Popconfirm title="确定发送?" key={`send-confirm-${record.orderNo}`} onConfirm={function () {*/}
                                {/*that.handleSendPassClick(record)*/}
                            {/*}} okText="确认" cancelText="取消"*/}
                            {/*>*/}
                                {/*<Button size="small" key={`send-${record.orderNo}`}>发送密码</Button>*/}
                            {/*</Popconfirm>*/}
                        </div>
                    )
                }},
            {title: '保险', dataIndex: 'paResult', width: 100, render: val => {
                return <span>{val ? '购买成功' : '未购买'}</span>
                }},
            {title: '促销', dataIndex: 'orderType', width: 100, render: (val,record) => {
                    return (
                        <Checkbox onChange={function (e) {
                            that.setState({
                                orderInfo: record
                            }, () => {
                                that.onChangeCheckbox(e)
                            })

                        }} checked={val === 2}
                        />
                    )
                }},
            {title: '房东自住', dataIndex: 'selfOccupation', width: 100, render: (val,record) => {
                    let sourceName = !!record.source && sourseType[record.source] ? sourseType[record.source] : record.source
                    let isSelf = sourceName.indexOf('路客') !== -1
                    return isSelf ? (
                        <Checkbox onChange={function (e) {

                            that.setState({
                                orderInfo: record
                            }, () => {
                                that.onChangeCheckboxOneSelf(e)
                            })

                        }} checked={val === 1}
                        />
                    ) : <span>-</span>
                }},
            { title: '操作', key: 'operation', width: 100, render: (val,record) => {
                    let isSelf = !!record.source && roomSource[record.source]
                    return isSelf ? (
                        <Popconfirm title="确定删除?" key={`tab-popconfirm-${record.orderNo}`} onConfirm={function () {
                            that.onDeleteOrderClick(record)
                        }} okText="确认" cancelText="取消"
                        >
                            <Button type="danger" size="small" key={`tab-delect-${record.orderNo}`}>删除</Button>
                        </Popconfirm>
                    ) : <span>-</span>
                } }
        ]
        if(memberHousesList.length > 0){
            let firstHouseOrders = memberHousesList[0].houseCalendarList
            //计算table宽度
            scrollX = firstHouseOrders.length * 140 + 250

            //封装table 数据
            firstHouseOrders.forEach((item,index) => {
                let cnDate = dataFormat(item.date,'MM-DD')
                cnDate = cnDate.replace('-','月') + '日'
                columns.push({
                    title: cnDate,
                    dataIndex: 'title',
                    key: item.date,
                    width: 140,
                    render: (val, record, recordIndex) => {
                        const currentHouseOrderInfo = record
                        const currentOrderList = currentHouseOrderInfo.houseCalendarList

                        //判断是否有屏蔽
                        let isShield = false
                        let shieldReason = ''
                        if(!!currentOrderList[index] && !!currentOrderList[index].calendarOccupationList){
                            currentOrderList[index].calendarOccupationList.forEach(shieldItem => {
                                if(shieldItem.occupationType === 5) {
                                    isShield = true
                                    shieldReason = shieldItem.occupationRemark
                                }
                            })
                        }
                        //防止页面白屏
                        if(!currentOrderList || currentOrderList.length === 0 || !currentOrderList[index]) {
                            return null
                        }
                        //封装td对象
                        let obj = {
                            children: <div>{currentOrderList[index].price}</div>,
                            props: {
                                colSpan: 1
                            }
                        }
                        //(第二个td才开始判断)判断上一个td的编号是否相等，若相等就设置colSpan为0，不渲染该td
                        if(index > 0 && currentOrderList[index].calendarOrderList !== null && that.compareBeforeAndAfterList(currentOrderList[index].calendarOrderList,currentOrderList[index - 1].calendarOrderList) && that.isAvailableOrderStatus(currentOrderList[index].calendarOrderList)) {
                            obj.props.colSpan = 0
                        }else{
                            //房态有订单信息（可能含有屏蔽单）
                            if(currentOrderList[index].calendarOrderList !== null && that.isAvailableOrderStatus(currentOrderList[index].calendarOrderList)) {
                                const orderCountObj = that.handleForEachSameOrderList(currentOrderList,index)
                                let lastIndex = orderCountObj.lastIndex
                                let ids = []
                                for(let i = index; i <= lastIndex; i++) {
                                    currentOrderList[i].calendarOrderList.forEach(orderItem => {
                                        if(!that.isInArray(ids, orderItem.orderNo)) {
                                            ids.push(orderItem.orderNo)
                                        }
                                    })
                                }
                                const lastTime = moment(currentOrderList[currentOrderList.length - 1].date).add(1, 'days').valueOf()
                                obj.children = (
                                    <div className={`price-wrapper
                                        ${currentOrderList[index].calendarOrderList[0].checkoutDate > lastTime ? 'border-right-radius-none ' : '' }
                                        ${dataFormat(currentOrderList[index].calendarOrderList[0].checkinDate) === dataFormat(currentOrderList[0].date) ? 'border-left-radius-none ' : ''}`
                                    }
                                     onClick={function () {
                                         // currentOrderList[index].isActive = true
                                         that.setState({
                                            selectedHouseDate: {
                                                key: currentHouseOrderInfo.houseSourceId,
                                                rangeDate: [currentOrderList[index].calendarOrderList[0].checkinDate, moment(currentOrderList[index].calendarOrderList[0].checkinDate).add(orderCountObj.count - 1, 'days')]
                                            },
                                            orderInfoList: currentOrderList[index].calendarOrderList,
                                            orderIds: ids
                                        },that.getOrderDetail)
                                    }}
                                    >
                                        {
                                            ids.length > 1 ?
                                                <div className="repeat-order">多单</div> : null
                                        }
                                        {
                                            isShield ?
                                                <Tooltip placement="topLeft" title={shieldReason}>
                                                    <div className="repeat-order shield-tip">屏蔽</div>
                                                </Tooltip> : null
                                        }

                                        <div className="order-info">
                                            <p>{currentOrderList[index].calendarOrderList[0].bookingMemberName}</p>
                                            <p>
                                                {
                                                    that.transRoomSource(currentOrderList,index)
                                                }
                                            </p>
                                        </div>
                                        <div className="price-amount">
                                            {
                                                currentOrderList[index].calendarOrderList[0].source === 'BOOKING' || currentOrderList[index].calendarOrderList[0].source === 'BOOKING_HAND' ?
                                                currentOrderList[index].calendarOrderList[0].orderTotalPrice : currentOrderList[index].calendarOrderList[0].transferPrice
                                            }
                                        </div>
                                    </div>
                                )
                                obj.props.colSpan = orderCountObj.count
                            }else if(isShield) { //房态有屏蔽单
                                obj.props.colSpan = that.handleForEachSameShieldList(currentOrderList,index).count
                                obj.children = (
                                    <div className="shield-wrapper">
                                        <Popconfirm placement="topLeft" title="是否解除屏蔽？" onConfirm={function () { that.cancelReleaseBlocking(currentHouseOrderInfo, index, obj.props.colSpan) }} okText="Yes" cancelText="No">
                                            <div className="shield-info">
                                                <p>屏蔽</p>
                                                <p title={shieldReason}>{shieldReason}</p>
                                            </div>
                                        </Popconfirm>
                                    </div>
                                )
                            }else if(currentOrderList[index].stock < 1 || (!currentOrderList[index].isOpen)) { //房态库存不足
                                obj.children = (
                                    <div className="shield-wrapper">
                                        <Popconfirm placement="topLeft" title="是否解除屏蔽？" onConfirm={function () {
                                            that.cancelReleaseBlocking(currentHouseOrderInfo, index, 1)
                                        }} okText="Yes" cancelText="No"
                                        >
                                            <div className="order-info">
                                                <p>屏蔽</p>
                                            </div>
                                            <div className="price-amount">
                                                {currentOrderList[index].price}
                                            </div>
                                        </Popconfirm>
                                    </div>
                                )
                            }else {
                                obj.children = (
                                    <div className={currentOrderList[index].isActive ? 'house-selected' : ''} onClick={function () {
                                        that.handleSelectedEvent(currentHouseOrderInfo.houseSourceId,recordIndex,index)
                                    }}
                                    >{currentOrderList[index].price}</div>
                                )
                            }
                        }
                        return obj
                    }
                })
            })
        }

        const { getFieldDecorator, getFieldValue } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 17 },
                sm: { span: 17 }
            }
        }
        return (
            <div className="room-status-list">
                <Search onSubmit={this.onSearch} config={this.state.searchConfig} />
                <Table
                    bordered
                    rowKey="houseSourceId"
                    columns={columns}
                    dataSource={memberHousesList}
                    scroll={{ x: scrollX }}
                    pagination={false}
                    loading={this.state.loading}
                />
                <Modal
                    width={1300}
                    visible={this.state.orderModalVisible}
                    title="订单信息"
                    onCancel={this.handleOrderCancel}
                    onOk={this.openRoomModal}
                    cancelText="关闭"
                    okText="更多"
                >
                    <Table
                        bordered
                        rowKey="orderNo"
                        columns={orderColumns}
                        dataSource={orderInfoList}
                        pagination={false}
                    />
                </Modal>
                {
                    this.state.roomVisibleModal ?
                        <Modal
                            title="房态操作"
                            visible
                            onOk={this.handleRoomModalOk}
                            onCancel={this.handleRoomModalCancel}
                        >
                        <div className="modal-wrapper">
                            <div className="room-modal-title">
                                <ButtonGroup>
                                    <Button onClick={function () {
                                        that.handleModalType('editPrice')
                                    }} type={this.state.typeString === 'editPrice' ? 'primary' : 'default'}
                                    >修改价格</Button>
                                    <Button onClick={function () {
                                        that.handleModalType('order')
                                    }} type={this.state.typeString === 'order' ? 'primary' : 'default'}
                                    >手工单</Button>
                                    <Button onClick={function () {
                                        that.handleModalType('shield')
                                    }} type={this.state.typeString === 'shield' ? 'primary' : 'default'}
                                    >屏蔽</Button>
                                    {/*<Button onClick={function () {*/}
                                    {/*that.handleModalType('maintain')*/}
                                    {/*}} type={this.state.typeString === 'maintain' ? 'primary' : 'default'}*/}
                                    {/*>维修</Button>*/}
                                </ButtonGroup>
                                {/*<div className="room-modal-date">*/}
                                    {/*<Row>*/}
                                        {/*<Col className="room-modal-date-label" xs={8} sm={6}>选中日期：</Col>*/}
                                        {/*<Col xs={18} sm={18}>*/}
                                            {/*/!*<RangePicker onChange={that.onChangeRangeDate} defaultValue={[moment(that.state.selectedHouseDate.rangeDate[0]), moment(that.state.selectedHouseDate.rangeDate[1])]}/>*!/*/}
                                            {/*{dataFormat(that.state.selectedHouseDate.rangeDate[0])}至{dataFormat(that.state.selectedHouseDate.rangeDate[1])}*/}
                                        {/*</Col>*/}
                                    {/*</Row>*/}
                                {/*</div>*/}
                            </div>
                            <Form>
                                {

                                    this.state.modalFormConfig.map((item,index) => {
                                        //其他来源时，需要加上sourceRemark来源平台的信息输入框
                                        if((getFieldValue('source') === 'OTHER' || getFieldValue('source') === 'LONG_TERM') && item.key === 'sourceRemark') {
                                            return (
                                                <FormItem
                                                    key={index}
                                                    {...formItemLayout}
                                                    label={item.name}
                                                >
                                                    {getFieldDecorator(item.key, {
                                                        initialValue: that.state.formParams[item.key],
                                                        rules: item.rules || []

                                                    })(
                                                        that.formInputBar(item)
                                                    )}
                                                </FormItem>
                                            )
                                        }
                                        //当不是线下、维修来源时，需要增加来源ID字段输入框
                                        if(getFieldValue('source') !== 'REPAIR' && getFieldValue('source') !== 'OFFLINE' && item.key === 'apiOrderId') {
                                            return (
                                                <FormItem
                                                    key={index}
                                                    {...formItemLayout}
                                                    label={item.name}
                                                >
                                                    {getFieldDecorator(item.key, {
                                                        initialValue: that.state.formParams[item.key],
                                                        rules: item.rules || []

                                                    })(
                                                        that.formInputBar(item)
                                                    )}
                                                </FormItem>
                                            )
                                        }
                                        if(item.key !== 'sourceRemark' && item.key !== 'apiOrderId') {
                                            return (
                                                <FormItem
                                                    key={index}
                                                    {...formItemLayout}
                                                    label={item.name}
                                                >
                                                    {getFieldDecorator(item.key, {
                                                        initialValue: that.state.formParams[item.key],
                                                        rules: item.rules || []

                                                    })(
                                                        that.formInputBar(item)
                                                    )}
                                                </FormItem>
                                            )
                                        }
                                        return null
                                    })
                                }
                            </Form>
                        </div>
                    </Modal> : null
                }
            </div>
        )
    }
}

RoomStatusList = Form.create()(RoomStatusList)
export default RoomStatusList
