import React, {Component} from 'react'
import { Form, Input,Button, Select, Row, Col} from 'antd'
import { houseMaintainService } from '../../services'
import { rentOutTypeList, isBeds, HoletType } from '../../utils/dictionary'
import { searchObjectSwitchArray } from '../../utils/utils'
import './index.less'
import {message} from "antd/lib/index";

const FormItem = Form.Item
const Option = Select.Option
class HouseBaseInfo extends Component {
    constructor () {
        super()
        this.state = {
            isRepeat: false,
            houseInfo: {},
            houseTypeList: [], //房屋类型
            bedSelectedList: [] //床铺数
        }
    }

    componentDidMount () {
        //获取房屋信息
        this.getHouseInfo()
        //获取房屋类型字典
        this.getHousesType()
    }
    getHouseInfo = () => {
        houseMaintainService.fetchHouseRoom(this.props.houseSourceId).then((res) => {
            let bedSelectedList = []
            if(!!res.bed && res.bed.length > 0) {
                //往数组添加一个id字段，用于渲染key
                res.bed.forEach((item,index) => {
                    item.id = 'bed_index_' + (index + 1)
                })
                bedSelectedList = res.bed
            }else {
                bedSelectedList = [{
                    id: 'bed_index_1',
                    bedCode: null,
                    bedNumber: null
                }]
            }
            this.setState({
                houseInfo: res,
                bedSelectedList
            })
        })
    }
    getHousesType = () => {
        houseMaintainService.fetchHouseKind().then(res => {
            this.setState({houseTypeList: res})
        })
    }
    addBedInfo = () => {
        let bedSelectedList = this.state.bedSelectedList
        bedSelectedList.push({
            id: 'bed_index_' + (bedSelectedList.length + 1),
            bedCode: null,
            bedNumber: null
        })
        this.setState({bedSelectedList})
    }
    deleteBedInfo = (index) => {
        let bedSelectedList = this.state.bedSelectedList
        let formBedSelectedList = this.props.form.getFieldValue('bed')
        bedSelectedList.splice(index, 1)
        //删除form表单内的对象
        formBedSelectedList.splice(index, 1)
        this.props.form.setFieldsValue({bed: formBedSelectedList})
        this.setState({bedSelectedList})
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = values
                //封装床位信息
                params.bed.forEach((item,index) => {
                    item.bedNumber = index + 1
                })
                params.bedNumber = params.bed.length
                this.setState({isRepeat: true})
                houseMaintainService.updateHouseRoom(this.props.houseSourceId, params).then(res => {
                    message.success('更新成功');
                    this.setState({isRepeat: false}, () => {
                        this.props.nextCb();
                    })
                }).catch(err => {
                    this.setState({isRepeat: false})
                })
            }
        })
    }

    render () {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { houseTypeList, bedSelectedList, houseInfo, isRepeat } = this.state
        const that = this
        const formItemChildrenLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        }
        const bedList = searchObjectSwitchArray(isBeds)
        const holetTypeList = searchObjectSwitchArray(HoletType)
        return (
            <div className="house-maintain-base-info">
                <Form>
                    <FormItem
                        label="门店类型"
                    >
                        {getFieldDecorator('hotelType', {
                            initialValue: houseInfo.hotelType || undefined,
                            rules: [{ required: true, message: '请选择门店类型' }]
                        })(
                            <Select placeholder="请选择门店类型">
                                {
                                    holetTypeList.map(item => {
                                        return (
                                            <Option key={Number(item.value)} value={Number(item.value)}>{item.text}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="出租类型"
                    >
                        {getFieldDecorator('houseType', {
                            initialValue: houseInfo.houseType || undefined,
                            rules: [{ required: true, message: '请选择出租类型' }]
                        })(
                            <Select placeholder="请选择出租类型">
                                {
                                    rentOutTypeList.map(item => {
                                        return (
                                            <Option key={item.key} value={item.key}>{item.value}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        label="房屋类型"
                    >
                        {getFieldDecorator('houseKind', {
                            initialValue: houseInfo.houseKind || undefined,
                            rules: [{ required: true, message: '请选择房屋类型' }]
                        })(
                            <Select placeholder="请选择房屋类型">
                                {
                                    houseTypeList.map(item => {
                                        return (
                                            <Option key={item.code} value={item.code}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    {
                        (getFieldValue('hotelType') === 1 || getFieldValue('hotelType') === 3) ?
                            <FormItem
                                label="房间数量（仅对酒店/客栈）"
                            >
                                <div style={{width: '100%', position: 'relative'}}>
                                    <div style={{marginRight: 40}}>
                                        {getFieldDecorator('stock', {
                                            initialValue: houseInfo.stock || undefined,
                                            rules: [
                                                { required: true, message: '房间数量不能为空' },
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
                                            <Input placeholder="房间数量" />
                                        )}
                                    </div>
                                    <div style={{width: 40, position: 'absolute', top: 0 , right: -12}}>㎡</div>
                                </div>
                            </FormItem> : null
                    }

                    <FormItem
                        label="房屋面积"
                    >
                        <div style={{width: '100%', position: 'relative'}}>
                            <div style={{marginRight: 40}}>
                            {getFieldDecorator('houseArea', {
                                initialValue: houseInfo.houseArea || undefined,
                                rules: [
                                    { required: true, message: '房屋面积不能为空' },
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
                                <Input placeholder="整套房屋的使用面积" />
                            )}
                            </div>
                            <div style={{width: 40, position: 'absolute', top: 0 , right: -12}}>㎡</div>
                        </div>
                    </FormItem>
                    <Row>
                        <Col style={{color: 'rgba(0, 0, 0, 0.85)', height: 39, lineHeight: '39px'}}>
                            <label className="ant-form-item-required" title="房屋户型">房屋户型：</label>
                        </Col>
                        <Col>
                            <Row gutter={10}>
                                <Col span={8}>
                                    <FormItem
                                        label="卧室"
                                        {...formItemChildrenLayout}
                                    >
                                        {getFieldDecorator('roomNumber', {
                                            initialValue: houseInfo.roomNumber,
                                            rules: [
                                                { required: true, message: '卧室数不能为空' },
                                                { validator (rule, value, callback) {
                                                        if(value === '' || value == null){
                                                            callback()
                                                            return
                                                        }else if(value.length > 8) {
                                                            callback('不可大于8位数');
                                                        }else if(!(/^[0-9]\d*$/).test(value)) {
                                                            callback('请输入数字');
                                                        }else{
                                                            callback()
                                                        }
                                                    }}
                                            ]
                                        })(
                                            <Input placeholder="请输入卧室数" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="客厅"
                                        {...formItemChildrenLayout}
                                    >
                                        {getFieldDecorator('livingNumber', {
                                            initialValue: houseInfo.livingNumber,
                                            rules: [
                                                { required: true, message: '客厅数不能为空' },
                                                { validator (rule, value, callback) {
                                                    if(value === '' || value == null){
                                                        callback()
                                                        return
                                                    }else if(value.length > 8) {
                                                        callback('不可大于8位数');
                                                    }else if(!(/^[0-9]\d*$/).test(value)) {
                                                        callback('请输入数字');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                            ]
                                        })(
                                            <Input placeholder="请输入客厅数" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="厨房"
                                        {...formItemChildrenLayout}
                                    >
                                        {getFieldDecorator('kitchenNumber', {
                                            initialValue: houseInfo.kitchenNumber,
                                            rules: [
                                                { required: true, message: '厨房数不能为空' },
                                                { validator (rule, value, callback) {
                                                        if(value === '' || value == null){
                                                            callback()
                                                            return
                                                        }else if(value.length > 8) {
                                                            callback('不可大于8位数');
                                                        }else if(!(/^[0-9]\d*$/).test(value)) {
                                                            callback('请输入数字');
                                                        }else{
                                                            callback()
                                                        }
                                                    }}
                                            ]
                                        })(
                                            <Input placeholder="请输入厨房数" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="书房"
                                        {...formItemChildrenLayout}
                                    >
                                        {getFieldDecorator('studyNumber', {
                                            initialValue: houseInfo.studyNumber,
                                            rules: [
                                                { required: true, message: '书房数不能为空' },
                                                { validator (rule, value, callback) {
                                                        if(value === '' || value == null){
                                                            callback()
                                                            return
                                                        }else if(value.length > 8) {
                                                            callback('不可大于8位数');
                                                        }else if(!(/^[0-9]\d*$/).test(value)) {
                                                            callback('请输入数字');
                                                        }else{
                                                            callback()
                                                        }
                                                    }}
                                            ]
                                        })(
                                            <Input placeholder="请输入书房数" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="阳台"
                                        {...formItemChildrenLayout}
                                    >
                                        {getFieldDecorator('balconyNumber', {
                                            initialValue: houseInfo.balconyNumber,
                                            rules: [
                                                { required: true, message: '阳台数不能为空' },
                                                { validator (rule, value, callback) {
                                                        if(value === '' || value == null){
                                                            callback()
                                                            return
                                                        }else if(value.length > 8) {
                                                            callback('不可大于8位数');
                                                        }else if(!(/^[0-9]\d*$/).test(value)) {
                                                            callback('请输入数字');
                                                        }else{
                                                            callback()
                                                        }
                                                    }}
                                            ]
                                        })(
                                            <Input placeholder="请输入阳台数" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="公共卫生间"
                                        {...formItemChildrenLayout}
                                    >
                                        {getFieldDecorator('publicToiletNumber', {
                                            initialValue: houseInfo.publicToiletNumber,
                                            rules: [
                                                { required: true, message: '公共卫生间不能为空' },
                                                { validator (rule, value, callback) {
                                                        if(value === '' || value == null){
                                                            callback()
                                                            return
                                                        }else if(value.length > 8) {
                                                            callback('不可大于8位数');
                                                        }else if(!(/^[0-9]\d*$/).test(value)) {
                                                            callback('请输入数字');
                                                        }else{
                                                            callback()
                                                        }
                                                    }}
                                            ]
                                        })(
                                            <Input placeholder="请输入公共卫生间数" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="卧室带卫生间数"
                                        {...formItemChildrenLayout}
                                    >
                                        {getFieldDecorator('toiletNumber', {
                                            initialValue: houseInfo.toiletNumber,
                                            rules: [
                                                { required: true, message: '卧室带卫生间数不能为空' },
                                                { validator (rule, value, callback) {
                                                        if(value === '' || value == null){
                                                            callback()
                                                            return
                                                        }else if(value.length > 8) {
                                                            callback('不可大于8位数');
                                                        }else if(!(/^[0-9]\d*$/).test(value)) {
                                                            callback('请输入数字');
                                                        }else{
                                                            callback()
                                                        }
                                                    }}
                                            ]
                                        })(
                                            <Input placeholder="请输入卧室带卫生间数" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{color: 'rgba(0, 0, 0, 0.85)', height: 39, lineHeight: '39px'}}>
                            <label className="ant-form-item-required" title="床型">床型：共<span style={{color: 'red'}}>{bedSelectedList.length}</span>张床</label>
                        </Col>
                        <Col>
                            {
                                bedSelectedList.map((bedItem, index) => {
                                    return (
                                        <Row gutter={20} key={'Row_' + bedItem.id}>
                                            <Col span={22}>
                                                <FormItem>
                                                    {getFieldDecorator('bed[' + index + '].bedCode', {
                                                        initialValue: bedSelectedList[index].bedCode || undefined,
                                                        rules: [{ required: true, message: '床铺尺寸不能为空' }]
                                                    })(
                                                        <Select placeholder="请选择床铺尺寸">
                                                            {
                                                                bedList.map(item => {
                                                                    return (
                                                                        <Option key={item.value} value={item.value}>{item.text}</Option>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={2}>
                                                {
                                                    index === 0 ? <Button onClick={that.addBedInfo} type="primary" shape="circle" icon="plus-circle" style={{marginTop: 5}} /> : null
                                                }
                                                {
                                                    index > 0 ?
                                                        <Button onClick={function () {
                                                            that.deleteBedInfo(index)
                                                        }} type="danger" shape="circle" icon="delete" style={{marginTop: 5}}
                                                        /> : null
                                                }
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </Col>
                    </Row>

                    <FormItem
                        label="宜住人数"
                    >
                        <div style={{width: '100%', position: 'relative'}}>
                            <div style={{marginRight: 40}}>
                                {getFieldDecorator('tenantNumber', {
                                    initialValue: houseInfo.tenantNumber,
                                    rules: [
                                        { required: true, message: '宜住人数不能为空' },
                                        { validator (rule, value, callback) {
                                                if(value === '' || value == null){
                                                    callback()
                                                    return
                                                }else if(value.length > 8) {
                                                    callback('不可大于8位数');
                                                }else if(!(/^[0-9]\d*$/).test(value)) {
                                                    callback('请输入数字');
                                                }else{
                                                    callback()
                                                }
                                            }}
                                    ]
                                })(
                                    <Input placeholder="请输入宜住人数" />
                                )}
                            </div>
                            <div style={{width: 40, position: 'absolute', top: 0 , right: -7}}>人</div>
                        </div>
                    </FormItem>
                </Form>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '10px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px'
                    }}
                >
                    <Button
                        style={{
                            marginRight: 8
                        }}
                        onClick={this.props.onCloseDrawer}
                    >
                        取消
                    </Button>
                    <Button type="primary" loading={isRepeat} onClick={this.handleSubmit}>
                        保存并下一步
                    </Button>
                </div>
            </div>
        )
    }
}

HouseBaseInfo = Form.create()(HouseBaseInfo)
export default HouseBaseInfo
