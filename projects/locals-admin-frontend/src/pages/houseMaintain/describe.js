import React, {Component} from 'react'
import { Form, Input, Button, Row, Col, Alert, Modal } from 'antd'
import {houseMaintainService} from "../../services";
import {message} from "antd/lib/index";
import './index.less'

const FormItem = Form.Item
const { TextArea } = Input
class HouseDescribe extends Component {
    constructor () {
        super()
        this.state = {
            isRepeat: false,
            tipsVisible: false,
            houseDescribeInfo: {
                title: {},
                traffic: {}
            },
            describeStatistics: {
                titleCount: 0,
                airbnbTitleCount: 0,
                tujiaTitleCount: 0,
                bookingTitleCount: 0,
                summaryCount: 0,
                navigationInfoCount: 0,
                openDoorInfoCount: 0,
                parkInfoCount: 0
            }
        }
    }
    componentDidMount () {
        //获取房屋价格信息
        this.getHouseDescribeInfo()
    }
    /**
     * 产品经理说，如果原有数据的标题超过了字数限制，就把多出的字截取掉
     * 我只是个开发仔~
     *
     * */
    getHouseDescribeInfo = () => {
        houseMaintainService.fetchHouseDescribe(this.props.houseSourceId).then((res) => {

            let houseDescribeInfo = res;


            let describeStatistics = {
                titleCount: !!res.title.title ? res.title.title.length > 50 ? 50 : res.title.title.length : 0,
                airbnbTitleCount: !!res.title.airbnbTitle ? res.title.airbnbTitle.length > 50 ? 50 : res.title.airbnbTitle.length : 0,
                tujiaTitleCount: !!res.title.tujiaTitle ? res.title.tujiaTitle.length > 20 ? 20 : res.title.tujiaTitle.length : 0,
                bookingTitleCount: !!res.title.bookingTitle ? res.title.bookingTitle.length > 40 ? 40 : res.title.bookingTitle.length : 0,
                summaryCount: !!res.summary ? res.summary.length : 0,
                navigationInfoCount: !!res.traffic.navigationInfo ? res.traffic.navigationInfo.length : 0,
                openDoorInfoCount: !!res.openDoorInfo ? res.openDoorInfo.length : 0,
                parkInfoCount: !!res.traffic.parkInfo ? res.traffic.parkInfo.length : 0
            }

            if(describeStatistics.titleCount === 50) {
                houseDescribeInfo.title.title = houseDescribeInfo.title.title.substring(0, 50)
            }
            if(describeStatistics.airbnbTitleCount === 50) {
                houseDescribeInfo.title.airbnbTitle = houseDescribeInfo.title.airbnbTitle.substring(0, 50)
            }
            if(describeStatistics.tujiaTitleCount === 20) {
                houseDescribeInfo.title.tujiaTitle = houseDescribeInfo.title.tujiaTitle.substring(0, 20)
            }
            if(describeStatistics.bookingTitleCount === 40) {
                houseDescribeInfo.title.bookingTitle = houseDescribeInfo.title.bookingTitle.substring(0, 40)
            }

            this.setState({
                houseDescribeInfo,
                describeStatistics
            })
        })
    }
    handleSubmit = () => {

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({isRepeat: true});
                const str = '亲爱的路客家人，欢迎来到路客精品民宿。\n路客是全球最大规模的民宿管理品牌，统一管理超15000套民宿，更干净、更安全、更精品。\n\n';
                let params = values;
                params.summary = str + params.summary;
                houseMaintainService.updateHouseDescribe(this.props.houseSourceId, params).then(res => {
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
        const { getFieldDecorator } = this.props.form
        const { houseDescribeInfo, isRepeat, describeStatistics } = this.state
        const that = this
        return (
            <div className="house-maintain house-maintain-describe">
                <Form>
                    <Row gutter={15}>
                        <Col span="13">
                            <FormItem
                                colon={false}
                                label={
                                    <span>Locals标题（编号：<span style={{color: 'red'}}>{houseDescribeInfo.title.houseNo}</span>）</span>
                                }
                            >
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('title.title', {
                                        initialValue: houseDescribeInfo.title.title,
                                        rules: [
                                            { required: true, message: 'Locals中文标题不能为空' },
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length < 20) {
                                                        callback('Locals标题字数必须多于20个字');
                                                    }else if(value.length > 50) {
                                                        callback('Locals标题只在50个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea maxLength="50" className="text-area-pb" autosize placeholder="请输入Locals中文标题" onChange={function (event) {
                                            describeStatistics.titleCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        20/<span style={{color: 'red'}}>{describeStatistics.titleCount}</span>/50
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('title.enTitle', {
                                    initialValue: houseDescribeInfo.title.enTitle,
                                    rules: [
                                        { validator (rule, value, callback) {
                                                if(value == null || value === ''){
                                                    callback()
                                                    return
                                                }else if(value.length < 20) {
                                                    callback('Locals标题字数必须多于20个字');
                                                }else if(value.length > 50) {
                                                    callback('Locals标题只在50个字以内');
                                                }else{
                                                    callback()
                                                }
                                            }}
                                    ]
                                })(
                                    <TextArea autosize placeholder="请输入Locals英文标题" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <Alert showIcon
                               type="warning"
                               style={{marginTop: 23}}
                               message={
                                    <div>
                                        <p style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '10px'}}>标题</p>
                                        1、填写对应平台的标题，即可在【正式上线审核成功】之后，触发上线<br />
                                        2、参考例子：『赫本印象』天河区|体育西路站3min|天河城旁|广交会|可商务接待【2居】高端小区+舒适垫+安静隔音
                                    </div>
                                }
                            />

                        </Col>
                        <Col span="13">
                            <FormItem
                                colon={false}
                                label={
                                      <span>Airbnb标题（编号：<span style={{color: 'red'}}>{!!houseDescribeInfo.title.airbnbHouseNo ? houseDescribeInfo.title.airbnbHouseNo : '无'}</span>）</span>
                                }
                            >
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('title.airbnbTitle', {
                                        initialValue: houseDescribeInfo.title.airbnbTitle,
                                        rules: [
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length < 10) {
                                                        callback('Airbnb标题字数必须多于10个字');
                                                    }else if(value.length > 50) {
                                                        callback('Airbnb标题只在50个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea className="text-area-pb" autosize placeholder="请输入Airbnb中文标题" onChange={function (event) {
                                            describeStatistics.airbnbTitleCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        10/<span style={{color: 'red'}}>{describeStatistics.airbnbTitleCount}</span>/50
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('title.airbnbEnTitle', {
                                    initialValue: houseDescribeInfo.title.airbnbEnTitle,
                                    rules: [
                                        { validator (rule, value, callback) {
                                                if(value == null || value === ''){
                                                    callback()
                                                    return
                                                }else if(value.length < 10) {
                                                    callback('Airbnb标题字数必须多于10个字');
                                                }else if(value.length > 50) {
                                                    callback('Airbnb标题只在50个字以内');
                                                }else{
                                                    callback()
                                                }
                                            }}
                                    ]
                                })(
                                    <TextArea autosize placeholder="请输入Airbnb英文标题" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem
                                colon={false}
                                label={
                                  <span>途家标题（编号：<span style={{color: 'red'}}>{!!houseDescribeInfo.title.tujiaHouseNo ? houseDescribeInfo.title.tujiaHouseNo : '无'}</span>）</span>
                                }
                            >
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('title.tujiaTitle', {
                                        initialValue: houseDescribeInfo.title.tujiaTitle,
                                        rules: [
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length > 20) {
                                                        callback('途家标题只在20个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea className="text-area-pb" autosize placeholder="请输入途家中文标题" onChange={function (event) {
                                            describeStatistics.tujiaTitleCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        <span style={{color: 'red'}}>{describeStatistics.tujiaTitleCount}</span>/20
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('title.tujiaEnTitle', {
                                    initialValue: houseDescribeInfo.title.tujiaEnTitle,
                                    rules: [
                                        { validator (rule, value, callback) {
                                                if(value == null || value === ''){
                                                    callback()
                                                    return
                                                }else if(value.length > 20) {
                                                    callback('途家标题只在20个字以内');
                                                }else{
                                                    callback()
                                                }
                                            }}
                                    ]
                                })(
                                    <TextArea autosize placeholder="请输入途家英文标题" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem
                                colon={false}
                                label={
                                  <span>Booking标题（编号：<span style={{color: 'red'}}>{!!houseDescribeInfo.title.bookingHouseNo ? houseDescribeInfo.title.bookingHouseNo : '无'}</span>）</span>
                                }
                            >
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('title.bookingTitle', {
                                        initialValue: houseDescribeInfo.title.bookingTitle,
                                        rules: [
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length > 40) {
                                                        callback('Booking标题只在40个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea className="text-area-pb" autosize placeholder="请输入Booking中文标题" onChange={function (event) {
                                            describeStatistics.bookingTitleCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        <span style={{color: 'red'}}>{describeStatistics.bookingTitleCount}</span>/40
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('title.bookingEnTitle', {
                                    initialValue: houseDescribeInfo.title.bookingEnTitle
                                })(
                                    <TextArea autosize placeholder="英文标题（上线booking的房源，英文标题为必填项）" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span="13">

                            <FormItem label="摘要简介">
                                <p style={{lineHeight: '20px'}}>
                                    亲爱的路客家人，欢迎来到路客精品民宿。 <br/>
                                    路客是全球最大规模的民宿管理品牌，统一管理超15000套民宿，更干净、更安全、更精品。
                                </p>
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('summary', {
                                        initialValue: houseDescribeInfo.summary,
                                        rules: [
                                            { required: true, message: '摘要简介不能为空' },
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length < 100) {
                                                        callback('摘要简介字数必须多于100个字');
                                                    }else if(value.length > 1000) {
                                                        callback('摘要简介只在1000个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea className="text-area-pb" autosize placeholder="请根据右侧参考填写；包括格式和内容" onChange={function (event) {
                                            describeStatistics.summaryCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        100/<span style={{color: 'red'}}>{describeStatistics.summaryCount}</span>/1000
                                    </div>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <div style={{
                                color: 'red',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                marginTop: '38px'
                            }}
                                 onClick={function () {
                                     that.setState({
                                         tipsVisible: true
                                     })
                                 }}
                            >怎么写描述？</div>
                        </Col>
                        <Col span="13">
                            <FormItem label="乘车路线推荐">
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('traffic.navigationInfo', {
                                        initialValue: houseDescribeInfo.traffic.navigationInfo,
                                        rules: [
                                            { required: true, message: '乘车路线推荐不能为空' },
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length > 500) {
                                                        callback('乘车路线推荐只在500个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea className="text-area-pb" autosize placeholder="请输入乘车路线推荐" onChange={function (event) {
                                            describeStatistics.navigationInfoCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        <span style={{color: 'red'}}>{describeStatistics.navigationInfoCount}</span>/500
                                    </div>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem label="停车场推荐">
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('traffic.parkInfo', {
                                        initialValue: houseDescribeInfo.traffic.parkInfo,
                                        rules: [
                                            { required: true, message: '停车场推荐不能为空' },
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length > 500) {
                                                        callback('停车场推荐只在500个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea className="text-area-pb" autosize placeholder="请输入停车场推荐" onChange={function (event) {
                                            describeStatistics.parkInfoCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        <span style={{color: 'red'}}>{describeStatistics.parkInfoCount}</span>/500
                                    </div>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem label="开门方式">
                                <div className="text-area-wrapper">
                                    {getFieldDecorator('openDoorInfo', {
                                        initialValue: houseDescribeInfo.openDoorInfo,
                                        rules: [
                                            { required: true, message: '开门方式不能为空' },
                                            { validator (rule, value, callback) {
                                                    if(value == null || value === ''){
                                                        callback()
                                                        return
                                                    }else if(value.length > 500) {
                                                        callback('开门方式只在500个字以内');
                                                    }else{
                                                        callback()
                                                    }
                                                }}
                                        ]
                                    })(
                                        <TextArea className="text-area-pb" autosize placeholder="请输入开门方式" onChange={function (event) {
                                            describeStatistics.openDoorInfoCount = event.target.value.length
                                            that.setState({
                                                describeStatistics
                                            })
                                        }}
                                        />
                                    )}
                                    <div className="text-area-count">
                                        <span style={{color: 'red'}}>{describeStatistics.openDoorInfoCount}</span>/500
                                    </div>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span="13">
                            <FormItem label="房源简称">
                                {getFieldDecorator('houseNickname', {
                                    initialValue: houseDescribeInfo.houseNickname,
                                    rules: [
                                        { required: true, message: '房源简称不能为空' },
                                        { validator (rule, value, callback) {
                                                if(value == null || value === ''){
                                                    callback()
                                                    return
                                                }else if(value.length > 6) {
                                                    callback('房源简称只在6个字以内');
                                                }else{
                                                    callback()
                                                }
                                            }}
                                    ]
                                })(
                                    <Input placeholder="用于房态中，最左侧房源图片下的标题显示" />
                                )}
                            </FormItem>
                        </Col>

                    </Row>
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
                <Modal
                    width={650}
                    className="hideModel-okBtn"
                    title="【摘要简介】参考格式"
                    visible={this.state.tipsVisible}
                    onCancel={function () {
                        that.setState({
                            tipsVisible: false
                        })
                    }}
                >
                    <p style={{fontSize: 14}}>
                        亲爱的路客家人，欢迎来到路客精品民宿。<br />
                        路客是全球最大规模的民宿管理品牌，统一管理超15000套民宿，更干净、更安全、更精品。<br />
                        【精品推荐】<br />
                        - 核心地段：<br />
                        - 精致品质：<br />
                        - 贴心服务：<br />
                        【房源介绍】<br />
                        - 装修风格：<br />
                        - 户型功能：<br />
                        - 关键硬件：<br />
                        【民宿故事】
                        - 记录房东的初心，和分享她的生活态度。<br />
                        【街区特色文化】<br />
                        - 周边建筑景点：<br />
                        - 特色小吃美食：<br />
                        - 网红餐饮休闲推荐：<br />
                        【温馨提示】<br />
                        - 入住前需做好入住登记，获得免费高额住宿保险保障，安心出行；<br />
                        - 维护和谐的社区环境，不要影响邻居或社区居民；<br />
                        - 出门请随手关灯关空调，请节约用电；<br />
                        - 禁止携带宠物入住，禁止搞轰趴派对；<br />
                        - 欢迎您入住我家，享受温馨自如，祝您旅程愉快！<br />
                    </p>
                </Modal>
            </div>
        )
    }
}

HouseDescribe = Form.create()(HouseDescribe)
export default HouseDescribe
