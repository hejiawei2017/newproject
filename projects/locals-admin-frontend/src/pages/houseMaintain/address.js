import React, {Component} from 'react'
import { Form, Input,Button, Icon, Modal, Row, Col, Alert } from 'antd'
import { houseMaintainService } from '../../services'
import ComponentCascaderAddress from '../../components/cascaderAddress'
import ComponentMapView from '../../components/mapView'
import {message} from "antd/lib/index";

const FormItem = Form.Item
const Search = Input.Search
const { TextArea } = Input
class HouseAddress extends Component {
    constructor () {
        super()
        this.state = {
            isRepeat: false,
            houseAddressInfo: {},
            selectedAddressList: [],
            position: {},
            tipsVisible: false
        }
    }

    componentDidMount () {
        this.getHouseAddressInfo()
    }

    getHouseAddressInfo = () => {
        houseMaintainService.fetchHouseAddress(this.props.houseSourceId).then((res) => {
            let houseAddress = res.provinceName + res.cityName + res.districtName + res.address
            this.setState({
                houseAddressInfo: res
            }, () => {
                if(!!res.longitude && !!res.latitude) {
                    let position = {
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                    this.mapChild.touchMapHandle('showPosition',position)
                    this.setState({
                        position
                    })
                }else {
                    this.mapChild.touchMapHandle('getPosition', houseAddress)
                }

            })
        }).catch(err => {

        })
    }

    handleSubmit = () => {
        //'5': '正式上线审核通过','7': '修改待审核','8': '修改审核拒绝'
        if(this.props.houseInfo.houseStatus === 5 || this.props.houseInfo.houseStatus === 7 || this.props.houseInfo.houseStatus === 8) {
            message.warning('在当前的状态下，不可修改房源地址信息');
            return false;
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(!this.state.position.longitude && !this.state.position.latitude) {
                    message.warning('请点击获取地图定位坐标，若坐标不准确，请检查地址是否有误');
                    return
                }
                //大于0，是重新选择了省市区
                let countryCode = ''
                let countryName = ''
                let provinceCode = ''
                let provinceName = ''
                let cityCode = ''
                let cityName = ''
                let districtCode = ''
                let districtName = ''
                let street = ''
                if(this.state.selectedAddressList.length > 0) {
                    countryCode = this.state.selectedAddressList[0] ? this.state.selectedAddressList[0].code : ''
                    countryName = this.state.selectedAddressList[0] ? this.state.selectedAddressList[0].name : ''
                    provinceCode = this.state.selectedAddressList[1] ? this.state.selectedAddressList[1].code : ''
                    provinceName = this.state.selectedAddressList[1] ? this.state.selectedAddressList[1].name : ''
                    cityCode = this.state.selectedAddressList[2] ? this.state.selectedAddressList[2].code : ''
                    cityName = this.state.selectedAddressList[2] ? this.state.selectedAddressList[2].name : ''
                    districtCode = this.state.selectedAddressList[3] ? this.state.selectedAddressList[3].code : ''
                    districtName = this.state.selectedAddressList[3] ? this.state.selectedAddressList[3].name : ''
                    street = this.state.selectedAddressList[4] ? this.state.selectedAddressList[4].name : ''
                }else {
                    countryCode = this.state.houseAddressInfo.countryCode
                    countryName = this.state.houseAddressInfo.countryName
                    provinceCode = this.state.houseAddressInfo.provinceCode
                    provinceName = this.state.houseAddressInfo.provinceName
                    cityCode = this.state.houseAddressInfo.cityCode
                    cityName = this.state.houseAddressInfo.cityName
                    districtCode = this.state.houseAddressInfo.districtCode
                    districtName = this.state.houseAddressInfo.districtName
                    street = this.state.houseAddressInfo.street
                }

                let params = {
                    countryCode: countryCode,
                    countryName: countryName,
                    provinceCode: provinceCode,
                    provinceName: provinceName,
                    cityCode: cityCode,
                    cityName: cityName,
                    districtCode: districtCode,
                    districtName: districtName,
                    street: street,
                    address: values.address,
                    addressEn: values.addressEn,
                    longitude: this.state.position.longitude,
                    latitude: this.state.position.latitude,
                    houseNumber: values.houseNumber
                }
                this.setState({isRepeat: true})
                houseMaintainService.updateAddress(this.props.houseSourceId, params).then(res => {
                    message.success('更新成功');
                    this.setState({isRepeat: false}, () => {
                        this.props.nextCb();
                    })

                }).catch(err => {
                    console.log(err)
                    this.setState({isRepeat: false})
                })
            }
        })
    }
    //地图回调获取坐标
    handleMapCallback = (position) => {
        this.setState({
            position
        })
    }
    onRefMap = (ref) => {
        this.mapChild = ref
    }

    render () {
        const { getFieldDecorator } = this.props.form
        const { houseAddressInfo, selectedAddressList, isRepeat } = this.state
        const that = this
        return (
            <div className="house-maintain" style={{width: '100%'}}>
                <Form>
                    <Row gutter={15}>
                        <Col span={13}>
                            <FormItem
                                label="国家&省份&城市&区域&街道"
                            >
                                {getFieldDecorator('countryCode', {
                                    initialValue: houseAddressInfo.countryCode,
                                    rules: [{ required: true, message: '地区不能为空' }]
                                })(
                                    <ComponentCascaderAddress
                                        disabled
                                        placeholder={'请选择地区'}
                                        countryCode={houseAddressInfo.countryCode}
                                        provinceCode={houseAddressInfo.provinceCode}
                                        cityCode={houseAddressInfo.cityCode}
                                        areaCode={houseAddressInfo.districtCode}
                                        streetCode={houseAddressInfo.street}
                                        handleChangeValue={function (val, selectedOptions) {
                                            that.setState({
                                                selectedAddressList: selectedOptions,
                                                position: {} //重置地图坐标
                                            })
                                            that.props.form.setFieldsValue({
                                                countryCode: val && val[0]
                                            })
                                            //修改了省市区后，清空街道信息
                                            // that.props.form.setFieldsValue({
                                            //     address: null
                                            // })
                                        }}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="详细地址"
                            >
                                {getFieldDecorator('address', {
                                    initialValue: houseAddressInfo.address,
                                    rules: [{ required: true, message: '详细地址不能为空' }]
                                })(
                                    <Search
                                        disabled
                                        placeholder="请输入详细地址"
                                        enterButton="获取定位"
                                        onSearch={function (value) {
                                            let countryName = '';
                                            let provinceName = '';
                                            let cityName = '';
                                            let districtName = '';
                                            let street = '';
                                            if(selectedAddressList.length === 0) {
                                                countryName = houseAddressInfo.countryName
                                                provinceName = houseAddressInfo.provinceName
                                                cityName = houseAddressInfo.cityName
                                                districtName = houseAddressInfo.districtName
                                                street = houseAddressInfo.street
                                            }else {
                                                countryName = !!selectedAddressList[0].name ? selectedAddressList[0].name : ''
                                                provinceName = !!selectedAddressList[1].name ? selectedAddressList[1].name : ''
                                                cityName = !!selectedAddressList[2].name ? selectedAddressList[2].name : ''
                                                districtName = !!selectedAddressList[3].name ? selectedAddressList[3].name : ''
                                                street = !!selectedAddressList[4].name ? selectedAddressList[4].name : ''
                                            }
                                            const houseAddress = countryName + provinceName + cityName + districtName + street + value
                                            that.mapChild.touchMapHandle('getPosition', houseAddress)
                                        }}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="门牌号"
                            >
                                {getFieldDecorator('houseNumber', {
                                    initialValue: houseAddressInfo.houseNumber,
                                    rules: [{ required: true, message: '门牌号信息不能为空' }]
                                })(
                                    <Input disabled placeholder="客人预订成功之后才会显示此信息" />
                                )}
                            </FormItem>
                            <FormItem
                                label="英文地址"
                            >
                                <div style={{width: '100%', position: 'relative'}}>
                                    <div style={{marginRight: 40}}>
                                        {getFieldDecorator('addressEn', {
                                            initialValue: houseAddressInfo.addressEn,
                                            rules: [{ required: true, message: '英文地址不能为空' }]
                                        })(
                                            <TextArea
                                                disabled
                                                rows={4}
                                                autosize
                                                placeholder="可点击右侧问号，参考填写"
                                            />
                                        )}
                                    </div>
                                    <div style={{width: 40, position: 'absolute', top: 7 , right: -7, cursor: 'pointer'}}
                                         onClick={function () {
                                             that.setState({
                                                 tipsVisible: true
                                             })
                                         }}
                                    >
                                        <Icon style={{fontSize: 24}} type="question-circle" />
                                    </div>
                                </div>

                            </FormItem>
                        </Col>
                        <Col span={11}>
                            <Alert showIcon
                               type="warning"
                               style={{marginTop: 23}}
                               message={
                                   <div>
                                       正式上线成功之后，房源地址不可再修改！修改可能会导致房源在Airbnb渠道下架！<br/>
                                       请提交正式上线审核之前，谨慎检查！
                                   </div>
                               }
                            />
                        </Col>

                    </Row>

                    <FormItem
                        label="地图定位"
                    >
                        <ComponentMapView
                            onRef={this.onRefMap}
                            handleMapCallback={this.handleMapCallback}
                        />
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
                    {/*<Button type="primary"*/}
                        {/*// disabled={this.props.houseInfo.houseStatus === 5 || this.props.houseInfo.houseStatus === 7 || this.props.houseInfo.houseStatus === 8}*/}
                        {/*loading={isRepeat} onClick={this.handleSubmit}*/}
                    {/*>*/}
                        {/*保存并下一步*/}
                    {/*</Button>*/}
                </div>
                <Modal
                    width={600}
                    className="hideModel-okBtn"
                    title="英文地址帮助"
                    visible={this.state.tipsVisible}
                    onCancel={function () {
                        that.setState({
                            tipsVisible: false
                        })
                    }}
                >
                    <p style={{fontSize: 14}}>
                        地址翻译顺序：从小到大<br />
                        若民宿位于以下城市，则地址中的区和市不用翻译：北京、上海、广州、深圳、杭州<br />
                        例如：上海市静安区南京西路100号紫竹苑206号101室<br />
                        Room 101, No.206 Zizhu Residence, No.100 West Nanjing Road（地址中的静安区，上海市不用翻译）<br />
                        如小区没有英文名，可用拼音代替<br />


                        常用地名翻译如下：<br />
                        小区  Community<br />
                        大道、大街 Avenue<br />
                        路 Road<br />
                        街 Street<br />
                        ××路中段 *** Road Middle Section<br />
                        ××路1号院 No.1 **** Road<br />
                        1656弄 Lane 1656<br />
                        交叉口、交界处 intersection of<br />
                        南京西路 West Nanjing Road<br />
                        山东中路 Middle Shandong Road<br />
                        ××栋 Building ××<br />
                        B座 Block B<br />
                        步行街 Pedestrian Street<br />
                        夫子庙 Confucius Temple<br />
                        巷 Alley<br />
                        往东200米路南 South of 200 meters to the East of<br />
                    </p>
                </Modal>
            </div>
        )
    }
}

HouseAddress = Form.create()(HouseAddress)
export default HouseAddress
