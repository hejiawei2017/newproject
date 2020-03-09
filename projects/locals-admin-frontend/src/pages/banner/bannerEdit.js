import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {bannerService,articleService} from '../../services'
import { Icon, Button, Radio, Input, Form, Card, Row, Col, message, Alert, notification, Select,DatePicker} from 'antd'
import {getNewImagePrefix,createUUID,dataFormat, searchObjectSwitchArray} from '../../utils/utils'
import dataURItoBlob from "../../utils/dataURItoBlob"
import { CropperModal } from "../../components"
import { bannerPlatform } from '../../utils/dictionary'
import ModalSelect from '../../components/modalSelect'
import {categoryType,articleStatus,bannerLocation} from '../../utils/dictionary'
import './edit.less'
import moment from 'moment'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option
const { RangePicker } = DatePicker;

class bannerEdit extends Component {
    constructor (){
        super()
        this.state = {
            title: "",
            url: "",
            description: "",
            platform: "APP3",
            type: 1,
            imageBase64: "",
            updateSrc: "",
            location: 1,
            loginStatus: undefined,
            buttonName: "",
            dateInstructions: [],
            submitLoading: false,
            cropperVisible: false
        }
        this.platformRadioBtn = []
        this.changePlatform = this.changePlatform.bind(this)
        this.doPhoto = this.doPhoto.bind(this)
    }
    componentWillMount () {
        const id = this.props.match.params.id
        if(id > 0)this.setState({id},() => this.getBannerInfo(id))
        for (const i in bannerPlatform) {
            if (bannerPlatform[i] && bannerPlatform[i] !== '全部') {
                this.platformRadioBtn.push(<RadioButton value={i} key={i}>{bannerPlatform[i]}</RadioButton>)
            }
        }
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    getBannerInfo (id){
        // 获取banner 详情
        bannerService.getActAdsInfo(id).then((data) => {
            let {title, url, description, platform, type, imagePath, articleId, location, loginStatus, beginTime, endTime, buttonName} = data
            imagePath = getNewImagePrefix(imagePath)
            let dateInstructions = [];
            if(beginTime && endTime) {
                dateInstructions.push(moment(beginTime))
                dateInstructions.push(moment(endTime))
            }
            this.setState({
                title,
                url: type === 2 ? articleId : '',
                description,
                platform,
                type,
                buttonName,
                location,
                loginStatus,
                dateInstructions,
                link: url,
                articleId: type === 1 ? articleId : '',
                imageBase64: imagePath,
                updateSrc: imagePath,
                isModalSelectVisible : false
            });
            this.props.form.setFieldsValue({'type': 1, articleId: ''})
            location && this.props.form.setFieldsValue({'location': location})
            buttonName && this.props.form.setFieldsValue({'buttonName': buttonName})
            loginStatus && this.props.form.setFieldsValue({'loginStatus': loginStatus})
            dateInstructions.length > 0 && this.props.form.setFieldsValue({'dateInstructions': dateInstructions})
        })
    }
    uploadImg (file,id) {
        // 提交图片转换成url 上传图片
        return bannerService.imgUpload(dataURItoBlob(file), id).then(data=>{
            return {
                imagePath: getNewImagePrefix(data.filePath)
            }
        })
    }
    async bannerSave (){
        // 保存
        const _this = this
        let {id, title, url, link, description, platform, type, updateSrc, imageBase64, location, loginStatus, articleId, buttonName, dateInstructions} = this.state
        type = Number(type)
        const uuid = createUUID('xxxxxxxxxxxxxxxx',10)
        const params = {
            title,
            // url: type === 3 ? link : url,
            description,
            location,
            loginStatus,
            buttonName,
            beginTime: dateInstructions && dateInstructions.length === 2 ? moment(dateInstructions[0]).format('x') : undefined,
            endTime: dateInstructions && dateInstructions.length === 2 ? moment(dateInstructions[0]).format('x') : undefined,
            platform: platform,
            type
            // articleId: type === 1 ? articleId : null
        }
        switch (type) {
        case 1:
            if(!articleId){
                notification.error({
                    message: '请选择图文'
                })
                this.setState({
                    submitLoading:false
                })
                return false
            }
            params.articleId = articleId
            break;
        case 2:
            if(!url){
                notification.error({
                    message: '请选择视频图文'
                })
                this.setState({
                    submitLoading:false
                })
                return false
            }
            params.articleId = url
            break;
        case 3:
            if(!link){
                notification.error({
                    message: '请输入跳转地址'
                })
                this.setState({
                    submitLoading:false
                })
                return false
            }
            params.url = link
            break;
        default:
            break;
        }
        if(imageBase64 && imageBase64.length > 0){
            if(imageBase64.includes("data:image/")){
                await this.uploadImg(imageBase64,(id || uuid)).then(e =>{
                    params.imagePath = e.imagePath
                })
            }else{
                params.imagePath = imageBase64
            }
        }else if(updateSrc && updateSrc.length > 0){
            if(updateSrc.includes("data:image/")){
                await this.uploadImg(updateSrc,(id || uuid)).then(e =>{
                    params.imagePath = e.imagePath
                })
            }else{
                params.imagePath = updateSrc
            }
        }
        if(type){
            let arr = ['','STORY','VIDEO','WEB']
            params.category = arr[type]
        }
        if(id > 0){
            await bannerService.putActAdsInfo({...params,id}).then((e)=>{
                message.success("保存成功")
                _this.props.history.push("/application/activityList")
            }).catch(()=>{
                this.setState({
                    submitLoading:false
                })
            })
        }else{
            await bannerService.addActAds(params).then((e)=>{
                message.success("保存成功")
                _this.props.history.push("/application/activityList")
            }).catch(()=>{
                this.setState({
                    submitLoading:false
                })
            })
        }
    }
    goList = () => {
        this.props.history.push("/application/activityList")
    }
    _crop = () =>{
        if (typeof this.cropper.getCroppedCanvas() === 'undefined' || this.cropper.getCroppedCanvas() === null || (!(this.state.updateSrc && this.state.updateSrc.length > 0))) {
            return false
        }
        this.setState({
            imageBase64: this.cropper.getCroppedCanvas().toDataURL()
        })
    }
    uploadCustomRequest = ({file})=>{
        bannerService.imgUpload(file,'activity').then((data)=>{
            this.setState({
                url: getNewImagePrefix(data.filePath)
            })
        })
    }
    handleSubmit = (e) =>{
        // 表单提交
        e.preventDefault()
        const _this = this
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {type} = _this.state;
                _this.setState({
                    submitLoading: true,
                    title: values.title,
                    url: values.url,
                    link: values.link,
                    description: values.description,
                    platform: values.platform,
                    type,
                    articleId : values.articleId,
                    location : values.location,
                    buttonName : values.buttonName,
                    loginStatus : values.loginStatus,
                    dateInstructions: values.dateInstructions

                }, ()=>{
                    _this.bannerSave()
                })
            }
        })
    }
    changePlatform (e){
        const val = e.target.value
        this.props.form.setFieldsValue({'type': 1, articleId: ''})
        this.setState({
            type:1,
            selectData:'',
            platform: val
        })
    }
    renderAd (){
        let photo = <RadioButton value={1} key="1">图文</RadioButton>
        let video = <RadioButton value={2} key="2">视频</RadioButton>
        let link = <RadioButton value={3} key="3">广告链接</RadioButton>
        //let APPLink = <RadioButton value={3} key="3">APP跳转</RadioButton>
        switch (this.state.platform){
        case 'APP3':
            return [photo,video,link]
        case 'APP':
            return [photo,video,link]
        case 'MINI':
            return photo
        case 'MINI2':
            return [photo,link]
        case 'H5':
            return [photo,link]
        case 'PC':
            return [photo,link]
        default:
            return false
        }
    }
    doPhoto (e){
        this.setState({
            isModalSelectType: e.target.id,
            isModalSelectVisible: true
        })
    }
    renderRelative (formItemLayout){
        let self = this
        const { getFieldDecorator } = this.props.form
        switch (this.state.type){
        case 1:
            return <FormItem {...formItemLayout} label = "关联图文">
                <Row gutter={8}>
                    <Col span={12}>
                        {getFieldDecorator('articleId',{
                            initialValue: self.state.articleId
                        })(
                            <Input className="disableGray" disabled />
                        )}
                    </Col>
                    <Col span={12}>
                        <Button onClick={this.doPhoto} id={'STORY'}>选择图文</Button>
                    </Col>
                </Row>
            </FormItem>
        case 2:
            return <FormItem {...formItemLayout} label="关联视频" >
                <Row gutter={8}>
                    <Col span={12}>
                        {getFieldDecorator('url',{
                            initialValue: self.state.url
                        })(
                            <Input className="disableGray" disabled />
                        )}
                    </Col>
                    <Col span={12}>
                        <Button onClick={this.doPhoto} id={'VIDEO'}>选择视频</Button>
                    </Col>
                </Row>
                {/* {getFieldDecorator("url", {
                    rules: [{ required: false, message: '请输入关联视频!' }],
                    initialValue: this.state.url
                })(
                    <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                )}
                <Upload showUploadList={false} customRequest={this.uploadCustomRequest}>
                    <Button>
                        <Icon type="upload" /> 上传视频
                    </Button>
                </Upload> */}
            </FormItem>
        case 3:
            return <FormItem {...formItemLayout} label="广告链接" >
                {getFieldDecorator("link", {
                    rules: [{ required: false, message: '请输入广告链接!' }],
                    initialValue: this.state.link
                })(
                    <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                )}
            </FormItem>
        default:
            return false
        }
    }
    msg (){
        switch (this.state.platform){
        case 'APP3':
            return '无限制'
        case 'APP':
            return '尺寸要求:670X390(px)。数量要求:可以投放10张左右。'
        case 'MINI':
            return '尺寸要求:750X620(px)。数量要求:可以投放10张左右。'
        case 'MINI2':
            return '尺寸要求:750X722(px)。数量要求:可以投放10张左右。'
        case 'H5':
            return '尺寸要求:750X406(px)。数量要求:可以投放10张左右。'
        case 'PC':
            return '尺寸要求:240 X130(px)。数量要求:数量10张左右。'
        default:
            return false
        }
    }
    setSelect = (id) => {
        const key = this.state.type === 1 ? 'articleId' : 'url'
        this.props.form.setFieldsValue({[key]: id})
        this.setState({
            isModalSelectVisible:false,
            [key]: id
            // selectData:id
        },()=>{
            console.log(this.props.form.getFieldsValue())
        })
    }
    render () {
        const _this = this
        const { getFieldDecorator } = _this.props.form
        const {title, description, type, platform, updateSrc, location, loginStatus, buttonName, dateInstructions, imageBase64, submitLoading, cropperVisible} = this.state
        const bannerLocationMap = searchObjectSwitchArray(bannerLocation);
        const currentLocation = this.props.form && this.props.form.getFieldValue('location') ? this.props.form.getFieldValue('location') : location;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        }
        const modalSelectConfig = {
            title : "文章列表",
            services : articleService.getArticlesTable,
            equalId : "id",
            isHideTotal: true,
            columns : [{
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            }, {
                title: '标题',
                dataIndex: 'title',
                key: 'title'
            }, {
                title: '文章类别',
                dataIndex: 'category',
                key: 'category',
                width:100,
                render: _ => <span>{categoryType[_]}</span>
            }, {
                title: '发布状态',
                dataIndex: 'articleStatus',
                key: 'articleStatus',
                width:100,
                render: _ => <span>{articleStatus[_]}</span>
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
            }],
            attr : {
                width : 800,
                visible : this.state.isModalSelectVisible
            },
            extraData:{
                platformIn: this.state.platform,
                articleStatusIn: 'PUBLISHED'
            },
            filterFun (data){
                let arr = data.list.filter((i) => {
                    if(i.category === _this.state.isModalSelectType){
                        return i.category
                    }else if(i.category === "PROMOTION" && _this.state.isModalSelectType === "STORY"){
                        return i.category
                    }else{
                        return false
                    }
                })
                data.list = arr
                return data
            },
            searchKeys:[{
                type: 'input',
                key: 'id',
                placeholder: '请输入id'
            }]
        }

        return (
            <div className="banner-edit">
                {
                    <div className="row-wrap">
                        <Row>
                            <Col span={16}>
                                <div className="domNameDiv">
                                    <Form>
                                        <FormItem
                                            {...formItemLayout}
                                            label="标题"
                                        >
                                            {getFieldDecorator("title", {
                                                rules: [{ required: true, message: '请输入标题!' }],
                                                initialValue: title
                                            })(
                                                <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="平台类型"
                                        >
                                            {getFieldDecorator("platform", {
                                                initialValue: platform
                                            })(
                                                <RadioGroup onChange = {this.changePlatform}>
                                                    {this.platformRadioBtn}
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                        {
                                            platform === 'APP3' ? (
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="位置"
                                                >
                                                    {getFieldDecorator("location", {
                                                        initialValue: location,
                                                        rules: [{ required: false, message: '请选择位置!' }]
                                                    })(
                                                        <Select>
                                                            {
                                                                bannerLocationMap.map(item => {
                                                                    return (
                                                                        <Option key={'bannerLocationMap_' + item.value} value={Number(item.value)}>{item.text}</Option>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            ) : null
                                        }
                                        <FormItem
                                            {...formItemLayout}
                                            label="广告类型"
                                        >
                                            <RadioGroup value={type} onChange={function (e) {
                                                console.log(e)
                                                _this.setState({
                                                    type: e.target.value
                                                })
                                            }}
                                            >
                                                {this.renderAd()}
                                            </RadioGroup>
                                        </FormItem>
                                        {this.renderRelative(formItemLayout)}
                                        {
                                            platform === 'APP3' && Number(currentLocation) !== 4 ? (
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="登录状态"
                                                >
                                                    {getFieldDecorator("loginStatus", {
                                                        initialValue: loginStatus,
                                                        rules: [{ required: true, message: '请选择登录状态!' }]
                                                    })(
                                                        <RadioGroup>
                                                            <Radio value={1}>已登录</Radio>
                                                            <Radio value={2}>未登录</Radio>
                                                            <Radio value={3}>不限</Radio>
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            ) : null
                                        }

                                        <FormItem
                                            {...formItemLayout}
                                            label="描述"
                                        >
                                            {getFieldDecorator("description", {
                                                rules: [{ required: false, message: '请输入描述!' }],
                                                initialValue: description
                                            })(
                                                <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                                            )}
                                        </FormItem>
                                        {
                                            platform === 'APP3' && Number(currentLocation) === 1 ? (
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="按钮名称"
                                                >
                                                    {getFieldDecorator("buttonName", {
                                                        initialValue: buttonName
                                                    })(
                                                        <Input />
                                                    )}
                                                </FormItem>
                                            ) : null
                                        }
                                        {
                                            platform === 'APP3' && Number(currentLocation) === 4 ? (
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="日期说明"
                                                >
                                                    {getFieldDecorator("dateInstructions", {
                                                        initialValue: dateInstructions
                                                    })(
                                                        <RangePicker
                                                            format="YYYY/MM/DD"
                                                        />
                                                    )}
                                                </FormItem>
                                            ) : null
                                        }
                                    </Form>
                                    <div className="mt20 text-right box-r-button">
                                        <Button onClick={this.goList} className="mr20" size="large">取消</Button>
                                        <Button type="primary" onClick={this.handleSubmit} loading={submitLoading} size="large">保存</Button>
                                    </div>
                                </div>
                            </Col>
                            <Col span={8} className="box-right">
                                <div>
                                    <Card title="封面图片" className="cropper-wrap">
                                        <Alert message={this.msg()} type="error" className="mb10" />
                                        <div className={"banner-wrapper mt20 " + (imageBase64 && "bnner-url")} onClick={function () {_this.stateChange({cropperVisible: true})}}><img className="default-banner-img" src={imageBase64 ? getNewImagePrefix(imageBase64) : require("../../images/updateImg.png")} alt="加载失败..." /></div>
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
                <CropperModal updateSrc={getNewImagePrefix(updateSrc)} visible={cropperVisible} changeKey="imageBase64" stateChange={this.stateChange} />
                {this.state.isModalSelectVisible && <ModalSelect setSelect={this.setSelect} initData={this.state.type === 1 ? this.state.articleId : this.state.url} config={modalSelectConfig} />}
            </div>
        )
    }
}

bannerEdit = Form.create()(bannerEdit)
export default withRouter(bannerEdit)
