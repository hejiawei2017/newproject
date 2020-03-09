import React, {Component} from 'react'
import {
    Drawer, Form, Button, Col, Row, Input, Radio, Tag, Select
} from 'antd';
import ComponentCascaderAddress from '../../components/cascaderAddress'
import UploadImage from '../../components/uploadImage'
import { lotelService } from '../../services'
import './index.less'
import {message} from "antd/lib/index";


const { TextArea, Search } = Input
const { Option } = Select
const FormItem = Form.Item
const RadioGroup = Radio.Group
class LotelDrawer extends Component{
    constructor (props){
        super(props)
        this.state = {
            isRepeat: false,
            lotelNoList: [],
            selectedAddressList: [],
            lotelDetailInfo: {},
            labelTabList: [],
            prodLotelStoreHousenos: [],
            houseNoTabList: [],
            prodLotelStorePhotos: [],
            addCacheHouseNoList: [], //缓存编辑信息时，新增的房源编号
            removeCacheHouseNoList: [], //缓存编辑信息时，删除的房源编号
            addCachePhotoList: [],
            removeCachePhotoList: [],
            colLayout : {
                 labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 }
                  },
                  wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 }
                  }
            },
            textLayout : {
                wrapperCol: {
                    xs: {
                        span: 24,
                        offset: 0
                    },
                    sm: {
                        span: 16,
                        offset: 8
                    }
                }
            }
        }
    }
    componentWillMount () {
        this.getLotelNoList()
        if(this.props.mode === 'edit') {
            lotelService.getDetail(this.props.lotelId).then(res => {
                //lotel标签
                let labelTabList = !!res.prodLotelStore.label ? res.prodLotelStore.label.split(',') : []
                //房源编号
                let houseNoTabList = []
                !!res.prodLotelStoreHousenos && res.prodLotelStoreHousenos.forEach(item => {
                    houseNoTabList.push(item.houseNo)
                })
                //图片封装
                const prodLotelStorePhotos = this.packImageObject(res.prodLotelStorePhotos)


                let selectedAddressList = []
                selectedAddressList.push({
                    code: '86',
                    name: '中国'
                })
                selectedAddressList.push({
                    code: res.prodLotelStore.provinceCode,
                    name: res.prodLotelStore.province
                })
                selectedAddressList.push({
                    code: res.prodLotelStore.cityCode,
                    name: res.prodLotelStore.city
                })
                selectedAddressList.push({
                    code: res.prodLotelStore.areaCode,
                    name: res.prodLotelStore.area
                })

                this.setState({
                    lotelDetailInfo: res.prodLotelStore,
                    prodLotelStoreHousenos: res.prodLotelStoreHousenos,
                    labelTabList,
                    houseNoTabList,
                    prodLotelStorePhotos,
                    selectedAddressList
                })
            })
        }
    }
    getLotelNoList = () => {
        lotelService.getLotelNo().then(res => {
            this.setState({
                lotelNoList: res || []
            })
        })
    }
    //封装上传图片可用
    packImageObject = (list) => {
        if(!!list) {
            let transList = JSON.parse(JSON.stringify(list))
            transList.forEach(item => {
                item.uid = item.id
            })
            return transList
        }
        return []
    }
    onSubmit=(e)=>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({isRepeat: true})
                let params = JSON.parse(JSON.stringify(values))
                params.prodLotelStore.label = this.state.labelTabList.join(',')
                params.prodLotelStore.provinceCode = this.state.selectedAddressList.length > 1 ? this.state.selectedAddressList[1].code : ''
                params.prodLotelStore.province = this.state.selectedAddressList.length > 1 ? this.state.selectedAddressList[1].name : ''
                params.prodLotelStore.cityCode = this.state.selectedAddressList.length > 2 ? this.state.selectedAddressList[2].code : ''
                params.prodLotelStore.city = this.state.selectedAddressList.length > 2 ? this.state.selectedAddressList[2].name : ''
                params.prodLotelStore.areaCode = this.state.selectedAddressList.length > 3 ? this.state.selectedAddressList[3].code : ''
                params.prodLotelStore.area = this.state.selectedAddressList.length > 3 ? this.state.selectedAddressList[3].name : ''

                if(this.props.mode === 'add') {

                    params.addHouseNo = this.state.houseNoTabList
                    let arr = []
                    values.addPhoto.forEach(item => {
                        arr.push(item.url)
                    })
                    params.addPhoto = arr.length > 0 ? arr : ''
                    lotelService.addLotel(params).then(res => {
                        message.success('新增成功')
                        this.setState({isRepeat: false}, () => {
                            this.props.onCancel()
                        })
                    }).catch(err => {
                        this.setState({isRepeat: false})
                    })
                }else {
                    params.prodLotelStore.id = this.state.lotelDetailInfo.id
                    params.addHouseNo = this.state.addCacheHouseNoList
                    params.removeHouseNo = this.state.removeCacheHouseNoList
                    params.addPhoto = this.state.addCachePhotoList
                    params.removePhoto = this.state.removeCachePhotoList
                    lotelService.editLotel(params).then(res => {
                        message.success('修改成功')
                        this.setState({isRepeat: false}, this.props.onCancel)
                    }).catch(err => {
                        this.setState({isRepeat: false})
                    })
                }
            }
        })
    }
    removeHouse = (_, index) => () => {
        const { houseNoTabList, prodLotelStoreHousenos, removeCacheHouseNoList } = this.state
        let currentRemoveHouseItem = houseNoTabList.splice(index, 1)
        this.setState({ houseNoTabList })
        if (this.props.mode === 'edit') {
            let willRemoveHouseId = null
            prodLotelStoreHousenos.some(houseItem => {
                if (houseItem['houseNo'] === currentRemoveHouseItem[0]) {
                    willRemoveHouseId = houseItem['id']
                    return true
                } else {
                    return false
                }
            })
            if (willRemoveHouseId) {
                removeCacheHouseNoList.push(willRemoveHouseId)
                this.setState({removeCacheHouseNoList})
            }
        }
    }
    leftColRender (){
        const { getFieldDecorator } = this.props.form
        const {lotelDetailInfo, labelTabList, houseNoTabList} = this.state
        const _this = this
        return <Col span={12}>
            <FormItem label="系统ID" {...this.state.colLayout}>
                {lotelDetailInfo.id}
            </FormItem>
            <FormItem label="Lotel编码" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.lotelNo', {
                    initialValue: lotelDetailInfo.lotelNo,
                    rules: [{ required: true, message: '请选择Lotel编码' }]
                })(<Input disabled={this.props.mode === 'edit'} placeholder="请选择Lotel编码" />)}
            </FormItem>
            <FormItem
                label="地区&城市"
                {...this.state.colLayout}
            >
                {getFieldDecorator('prodLotelStore.provinceCode', {
                    initialValue: lotelDetailInfo.provinceCode,
                    rules: [{ required: true, message: '地区不能为空' }]
                })(
                    <ComponentCascaderAddress
                        placeholder={'请选择地区'}
                        cascaderLength={4}
                        countryCode={!!lotelDetailInfo.provinceCode ? '86' : undefined} //默认中国
                        provinceCode={lotelDetailInfo.provinceCode}
                        cityCode={lotelDetailInfo.cityCode}
                        areaCode={lotelDetailInfo.areaCode}
                        handleChangeValue={function (val, selectedOptions) {
                            _this.setState({
                                selectedAddressList: selectedOptions
                            })
                            _this.props.form.setFieldsValue({
                                prodLotelStore: {
                                    provinceCode: val && val[1]
                                }
                            })
                        }}
                    />
                )}
            </FormItem>

            <FormItem label="详细地址" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.address', {
                    initialValue: lotelDetailInfo.address,
                    rules: [{ required: true, message: '请输入详细地址' }]
                })(<Input placeholder="请输入详细地址" />)}
            </FormItem>
            <FormItem label="房源编码" {...this.state.colLayout}>
                {getFieldDecorator('addHouseNo', {
                    rules: [
                        {
                            validator (rule, value, callback) {
                                if(value === '' || value == null){
                                    callback()
                                    return
                                }else if(value.length > 10) {
                                    callback('房源编号不可多于10个字')
                                }else{
                                    callback()
                                }
                            }
                        }
                    ]
                })(
                    <Search
                        placeholder="请输入房源编码,按回车键添加"
                        onSearch={function (val) {
                            if(!!val) {
                                if(val.length > 10) {
                                    message.warning('房源编号不可多于10个字')
                                    return
                                }
                                const site = houseNoTabList.includes(val)
                                if(site) {
                                    message.warning('不可重复添加房源编号')
                                    return
                                }
                                let addCacheHouseNoList = _this.state.addCacheHouseNoList
                                houseNoTabList.push(val)
                                if(_this.props.mode === 'edit'){//修改lotel时，处理一下
                                    addCacheHouseNoList.push(val.trim())
                                }
                                _this.setState({houseNoTabList, addCacheHouseNoList})
                                _this.props.form.setFieldsValue({
                                    addHouseNo: ''
                                })
                            }
                        }}
                        enterButton={<span>添加</span>}
                    />
                )}
                <div>
                    {
                        houseNoTabList.map((item,index) => {
                            return(
                                <Tag
                                    key={'tag_label_' + item + index}
                                    closable
                                    onClose={this.removeHouse(item, index)}
                                >
                                    {item}
                                </Tag>
                            )
                        })
                    }
                </div>
            </FormItem>
            <FormItem label="状态" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.status', {
                    initialValue: lotelDetailInfo.status,
                    rules: [{ required: true, message: '请选择状态' }]
                })(<RadioGroup>
                    <Radio value={1}>有效</Radio>
                    <Radio value={2}>暂停</Radio>
                    <Radio value={0}>无效</Radio>
                </RadioGroup>)}
            </FormItem>

            <Row gutter={20}>
                <Col span={14}>
                    <FormItem label={<span><span style={{color: 'red', fontSize: 14}}>* </span>联系电话</span>} {...{
                        labelCol: {
                            xs: { span: 24 },
                            sm: { span: 14 }
                        },
                        wrapperCol: {
                            xs: { span: 24 },
                            sm: { span: 10 }
                        }
                    }}
                    >
                        {getFieldDecorator('prodLotelStore.phoneCode', {
                            initialValue: lotelDetailInfo.phoneCode,
                            rules: [
                                {
                                    validator (rule, value, callback) {
                                        if(value === '' || value == null){
                                            callback()
                                            return
                                        }else if(value.length > 5) {
                                            callback('不可多于5个字');
                                        }else{
                                            callback()
                                        }
                                    }
                                }
                            ]
                        })(<Input placeholder="区号" />)}
                    </FormItem>
                    <p style={{paddingLeft: '60%'}}>无固话直接输入手机</p>
                </Col>
                <Col span={10}>
                    <FormItem className={'display-inline-block'}>
                        {getFieldDecorator('prodLotelStore.phone', {
                            initialValue: lotelDetailInfo.phone,
                            rules: [
                                { required: true, message: '请输入号码' },
                                {
                                    validator (rule, value, callback) {
                                        if(value === '' || value == null){
                                            callback()
                                            return
                                        }else if(value.length > 11) {
                                            callback('不可大于11位数');
                                        }else if(!(/^[0-9]\d*$/).test(value)) {
                                            callback('请输入数字');
                                        }else{
                                            callback()
                                        }
                                    }
                                }
                            ]
                        })(<Input placeholder="号码" />)}
                    </FormItem>
                </Col>
            </Row>

            <FormItem label="LOTEL店名" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.shopName', {
                    initialValue: lotelDetailInfo.shopName,
                    rules: [
                        { required: true, message: '请输入LOTEL店名' },
                        { validator (rule, value, callback) {
                                if(value == null || value === ''){
                                    callback()
                                    return
                                }else if(value.length > 15) {
                                    callback('限制15字内');
                                }else{
                                    callback()
                                }
                            }}
                    ]
                })(<Input placeholder="限制15字" />)}
            </FormItem>

            <FormItem label="LOTEL亮点" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.brightSpot', {
                    initialValue: lotelDetailInfo.brightSpot,
                    rules: [{ validator (rule, value, callback) {
                        if(value == null || value === ''){
                            callback()
                            return
                        }else if(value.length > 500) {
                            callback('限制500字内');
                        }else{
                            callback()
                        }
                    }}]
                })(<TextArea placeholder="限制500字" rows={5}/>)}
            </FormItem>

            <FormItem label="LOTEL标签" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.label', {
                    rules: [
                        {
                            validator (rule, value, callback) {
                                if(value === '' || value == null){
                                    callback()
                                    return
                                }else if(value.length > 5) {
                                    callback('标签不可多于5个字')
                                }else{
                                    callback()
                                }
                            }
                        }
                    ]
                })(
                    <Search
                    placeholder="如免费接机,免费停车,行李寄存等，最多5组词"
                    onSearch={function (val) {
                        if(!!val) {
                            if(val.length > 5) {
                                message.warning('标签不可多于5个字')
                                return;
                            }
                            const site = labelTabList.includes(val)
                            if(site) {
                                message.warning('不可重复添加标签')
                                return
                            }
                            if(labelTabList.length < 5) {
                                labelTabList.push(val)
                                _this.setState({labelTabList})
                                _this.props.form.setFieldsValue({
                                    prodLotelStore: {label: ''}
                                })
                            }else {
                                message.warning('最多只能输入5组标签');
                            }
                        }
                    }}
                    enterButton={<span>添加</span>}
                    />
                )}
                <div>
                    {
                        labelTabList.map((item,index) => {
                            return (
                                <Tag
                                    key={'tag_label_' + item + index}
                                     closable
                                     onClose={function () {
                                        labelTabList.splice(index, 1)
                                            _this.setState({labelTabList})
                                        }}
                                >
                                    {item}
                                </Tag>
                            )
                        })
                    }
                </div>
            </FormItem>

            <FormItem label="LOTEL介绍" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.introduce', {
                    initialValue: lotelDetailInfo.introduce,
                    rules: [{ validator (rule, value, callback) {
                            if(value == null || value === ''){
                                callback()
                                return
                            }else if(value.length > 500) {
                                callback('限制500字内');
                            }else{
                                callback()
                            }
                        }}]
                })(<TextArea placeholder="限制500字" rows={5}/>)}
            </FormItem>

            <FormItem label="周边介绍" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.peripheralIntroduction', {
                    initialValue: lotelDetailInfo.peripheralIntroduction,
                    rules: [{ validator (rule, value, callback) {
                            if(value == null || value === ''){
                                callback()
                                return
                            }else if(value.length > 500) {
                                callback('限制500字内');
                            }else{
                                callback()
                            }
                        }}]
                })(<TextArea placeholder="限制500字" rows={5}/>)}
            </FormItem>

            <FormItem label="交通介绍" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.trafficIntroduction', {
                    initialValue: lotelDetailInfo.trafficIntroduction,
                    rules: [{ validator (rule, value, callback) {
                            if(value == null || value === ''){
                                callback()
                                return
                            }else if(value.length > 500) {
                                callback('限制500字内');
                            }else{
                                callback()
                            }
                        }}]
                })(<TextArea placeholder="限制500字" rows={5}/>)}
            </FormItem>

            <FormItem label="入住须知" {...this.state.colLayout}>
                {getFieldDecorator('prodLotelStore.instructionsAdmission', {
                    initialValue: lotelDetailInfo.instructionsAdmission,
                    rules: [{ validator (rule, value, callback) {
                            if(value == null || value === ''){
                                callback()
                                return
                            }else if(value.length > 500) {
                                callback('限制500字内');
                            }else{
                                callback()
                            }
                        }}]
                })(<TextArea placeholder="限制500字" rows={5}/>)}
            </FormItem>
        </Col>
    }
    rightColRender (){
        const {form} = this.props
        const { getFieldDecorator } = form
        const _this = this
        return (<Col span={12} >
            <div>房源照片</div>
            <div>1.请上传竖图，长边尺寸为1200px，短边不少于800px</div>
            <div>2.图片按外观、大堂、公区、部分靓丽房源客厅，内部细节不需要上传建议10张即可</div>
            <FormItem>
                {getFieldDecorator('addPhoto', {
                    initialValue: this.state.prodLotelStorePhotos,
                    rules: [
                        {
                            validator (rule, value, callback) {
                                if(value === '' || value == null){
                                    callback()
                                    return
                                }else if(value.length === 0) {
                                    callback('请上传图片');
                                }else{
                                    callback()
                                }
                            }
                        }
                    ]
                })(
                    <UploadImage
                        key="addPhoto"
                        handleType="vertical"
                        minSizeWidth={800}
                        minSizeHeight={1200}
                        imageUrlList={this.state.prodLotelStorePhotos}
                        imageLength={30}
                        pathFile="lotel/"
                        getImageInfo={function (fileList,operateType, operateIndex) {
                            if(_this.props.mode === 'add') { //新增lotel时，处理一下
                                _this.props.form.setFieldsValue({
                                    addPhoto: fileList || []
                                })
                                _this.setState({
                                    prodLotelStorePhotos: fileList || []
                                })
                            }else {//修改lotel时处理一下
                                if(operateType === 'add') {
                                    let addCachePhotoList = _this.state.addCachePhotoList
                                    addCachePhotoList.push(fileList[operateIndex].url)
                                    _this.setState({
                                        addCachePhotoList,
                                        prodLotelStorePhotos: JSON.parse(JSON.stringify(fileList))
                                    })
                                }else if(operateType === 'delete') {
                                    let removeCachePhotoList = _this.state.removeCachePhotoList
                                    //当有id时，数据就是后端返回的，若没有id时，是当前新增的图片
                                    !!_this.state.prodLotelStorePhotos[operateIndex].id && removeCachePhotoList.push(_this.state.prodLotelStorePhotos[operateIndex].id)
                                    let prodLotelStorePhotos = JSON.parse(JSON.stringify(fileList)) || this.state.prodLotelStorePhotos
                                    _this.setState({
                                        removeCachePhotoList,
                                        prodLotelStorePhotos
                                    })
                                }

                            }
                        }}
                    />
                )}
            </FormItem>
        </Col>)
    }
    render () {
        const {isRepeat} = this.state
        return (
            <div>
                <Drawer
                    title={this.props.mode === 'add' ? '新增Lotel' : '修改Lotel'}
                    width={1200}
                    onClose={this.props.onCancel}
                    visible
                    className={'lotelDrawer'}
                >
                <Form style={{marginBottom: 38}}>
                    <Row gutter={16}>
                        {this.leftColRender()}
                        {this.rightColRender()}
                    </Row>
                </Form>
                <div className="lotelDrawer_foot_btn">
                    <Button
                        style={{
                            marginRight: 8
                        }}
                        onClick={this.props.onCancel}
                    >
                        关闭
                    </Button>
                    <Button type="primary" loading={isRepeat} onClick={this.onSubmit}>保存</Button>
                </div>

                </Drawer>
            </div>
        )
    }
}
export default Form.create()(LotelDrawer)
