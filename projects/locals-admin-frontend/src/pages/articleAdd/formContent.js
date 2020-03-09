import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { articleService } from '../../services'
import { Form, Row, Col, Icon, Input, Select, Button, message, Upload } from 'antd'
import { CropperModal } from "../../components"
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {articleGetTagsSuccess} from '../../actions/article'
import {getNewImagePrefix,createUUID} from '../../utils/utils'
import {categoryType, bannerPlatform} from '../../utils/dictionary'
const FormItem = Form.Item
const Option = Select.Option

const mapStateToProps = (state, action) => {
    return {
        articlesInfo: state.articlesInfo || {},
        articleTags: state.articleTags || {list:[]}
    }
}
let platformOptions = []
for (const key in bannerPlatform) {
    if(bannerPlatform[key] !== '全部'){
        platformOptions.push(<Option key={key}>{bannerPlatform[key]}</Option>)
    }
}
let categoryOptions = []
for (const key in categoryType) {
    categoryOptions.push(<Option key={key}>{categoryType[key]}</Option>)
}
class FormContent extends Component {
    constructor (props) {
        super(props)
        this.state = {
            id: "",
            uuid: null,
            editorState: EditorState.createEmpty(),
            cropperVisible: false,
            articleStatusList: [{value: 'WAIT',label:'待发布'}, {value: 'PUBLISHED',label:'发布'}],
            title: '',
            description:'',
            content:'',
            banner:'',
            category:'STORY',
            articleStatus: 'WAIT',
            url: '',
            tagIds: [],
            platform: 'APP',
            editorToolbar: {},
            loading: false
        }
        this.stateChange = this.stateChange.bind(this)
        this.editor = null
        this.editorToolbar = {
            // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
            options: ['blockType','inline','colorPicker','textAlign','list','link','image','remove'],
            blockType: {
                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
            },
            inline: {
                options: ['bold', 'italic', 'underline']
            },
            colorPicker: {
                colors: ['','#444444','#888888','#bbbbbb','#ffffff','#e84358']
            },
            image: { uploadCallback: this.uploadImageCallBack,
                previewImage: false,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                alt: { present: false, mandatory: false },
                defaultSize: {
                    height: 'auto',
                    width: 'auto'
                }
            }
        }
        this.editorToolbarToApp = {
            // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
            options: ['inline','colorPicker','textAlign','list','link','image','remove'],
            inline: {
                options: ['bold']
            },
            colorPicker: {
                colors: ['','#444444','#888888','#bbbbbb','#ffffff','#e84358']
            },
            image: { uploadCallback: this.uploadImageCallBack,
                previewImage: false,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                alt: { present: false, mandatory: false },
                defaultSize: {
                    height: 'auto',
                    width: 'auto'
                }
            }
        }
    }
    componentDidMount () {
        const id = this.props.match.params.id
        if(id > 0){
            this.setState({id},()=>{
                this.getArticleInfo(id)
            })
        }else{
            this.setState({uuid: createUUID('xxxxxxxxxxxxxxxx',10)})
        }
        this.getArticleTags()
    }
    stateChange (obj, fn){
        this.setState(obj, ()=> fn && fn())
    }
    changeInput = (e) => {
        console.log('changeInput',e)
        const {value,name} = e.target
        this.setState({[name]:value})
    }
    getArticleInfo (id){
        const _this = this
        articleService.getArticleInfo(id).then((data)=>{
            const {articleStatus, banner, category, content, description, tagIds, platform, title, uuid, videoUrl } = data
            const contentBlock = htmlToDraft(content || '')
            let editorState
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                editorState = EditorState.createWithContent(contentState)
            }
            _this.setState({
                articleStatus,
                banner,
                category,
                editorState,
                description,
                tagIds,
                title,
                platform,
                url: videoUrl,
                uuid
            })
        })
    }
    getArticleTags (){
        articleService.getArticlesLabelTable({pageSize:999}).then(data=>{
            this.props.dispatch(articleGetTagsSuccess(data))
        })
    }
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        })
    }
    uploadImageCallBack = (file) => {
        let uuid = this.state.uuid || 0
        if(!(uuid > 0)){
            uuid = createUUID('xxxxxxxxxxxxxxxx',10)
            this.setState({uuid})
        }
        return articleService.attachmentByte(file,uuid).then(data=>{
            return {
                data: {
                    link: getNewImagePrefix(data.filePath),
                    name: data.fileName
                }
            }
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    title: values.title,
                    description: values.description
                },this.subbmitInfo)
            }
        })
    }
    getTextAlign (str) {
        let reStr = str
        reStr = reStr.replace(/float:none;/g, "margin: 0 auto;display:block;")
        return reStr
    }
    subbmitInfo = () => {
        const { editorState,
            category,
            articleStatus,
            tagIds,
            platform,
            banner,
            title,
            description,
            id,
            url,
            uuid
        } = this.state
        const params = {
            title,
            description,
            banner,
            platform,
            category,
            articleStatus,
            tagIds,
            uuid
        }
        if( category === 'VIDEO'){
            params.videoUrl = url
        }else{
            params.content = this.getTextAlign(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }
        if(id){
            articleService.putArticle({...params,id}).then(e=>{
                message.success('保存成功')
                this.props.history.push('/application/article')
            })
        }else{
            articleService.addArticle(params).then(e=>{
                message.success('保存成功')
                this.props.history.push('/application/article')
            })
        }
    }
    openCropper = () => {
        this.stateChange({cropperVisible: true})
    }
    setEditorReference = (ref) => {
        this.editorReferece = ref
    }
    handlePastedText = (ref) => {
        return false
    }
    render () {
        const _this = this
        const { getFieldDecorator } = _this.props.form
        const {articleStatusList, category, banner, articleStatus, tagIds, platform, url, loading} = _this.state
        const { editorState,cropperVisible,title,description } = _this.state
        const statusOption = articleStatusList.map(item => {
            return (<Option key={item.value}>{item.label}</Option>)
        })
        const articleTagsOption = (this.props.articleTags.list || []).map(item => {
            return (<Option key={item.id}>{item.name}</Option>)
        })
        const UploadProps = {
            disabled: loading,
            beforeUpload: (file) => {
                this.setState(() => ({
                    fileList: [file],
                    loading: true
                }))
                this.uploadImageCallBack(file).then(({data})=>{
                    this.setState({
                        url: data.link,
                        loading: false
                    })
                }).catch(()=>{
                    this.setState({
                        loading: false
                    })
                })
                return false
            },
            showUploadList: false
        }
        return (
            <div className="row-wrap">
                <Row>
                    <Col span={16}>
                        <div>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem>
                                    {getFieldDecorator("title", {
                                        rules: [{ required: true, message: '请输入标题!' }],
                                        initialValue: title
                                    })(
                                        <Input suffix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入标题" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator("description", {
                                        rules: [{ required: false, message: '请输入描述!' }],
                                        initialValue: description
                                    })(
                                        <Input placeholder="请输入描述" />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {category === "VIDEO" ?
                                        <div>
                                            <Input className="mt10" name="url" value={url} onChange={this.changeInput} />
                                            <Upload {...UploadProps}>
                                                <Button>
                                                    <Icon type={loading ? "loading" : "upload"} />
                                                     Click to Upload
                                                </Button>
                                            </Upload>
                                        </div> :
                                        <Editor
                                            editorState={editorState}
                                            editorRef={this.setEditorReference}
                                            handlePastedText={this.handlePastedText}
                                            wrapperClassName="draft-wrapper"
                                            editorClassName="draft-editor"
                                            onEditorStateChange={this.onEditorStateChange}
                                            toolbar={this.state.platform === 'APP' ? this.editorToolbarToApp : this.editorToolbar}
                                        />
                                    }
                                </FormItem>
                            </Form>
                        </div>
                    </Col>
                    <Col span={8} className="box-right">
                        <div>
                            <h1 className="box-r-title"><Icon type="rocket" className="mr10" />发布</h1>
                            <div className="box-r-select-ul">
                                <div className={"banner-wrapper mt20 " + (banner && "bnner-url")} onClick={this.openCropper}><img className="default-banner-img" src={banner ? getNewImagePrefix(banner) : require("../../images/updateImg.png")} alt="加载失败..." /></div>
                                <Row className="select-prot mt20">
                                    <Col span={7} className="text-right label"><span>类别：</span></Col>
                                    <Col span={14}>
                                        <Select placeholder="请选择" className="width100" value={category} onChange={function (val) {
                                            _this.stateChange({category:val})
                                        }}
                                        >
                                            {categoryOptions}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row className="select-prot mt20">
                                    <Col span={7} className="text-right label"><span>状态：</span></Col>
                                    <Col span={14}>
                                        <Select placeholder="请选择" className="width100" value={articleStatus} onChange={function (val) {
                                            _this.stateChange({articleStatus:val})
                                        }}
                                        >
                                            {statusOption}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row className="select-prot mt20">
                                    <Col span={7} className="text-right label"><span>标签：</span></Col>
                                    <Col span={14}>
                                        <Select placeholder="请选择" mode="multiple" className="width100" value={tagIds} onChange={function (val) {
                                            _this.stateChange({tagIds:val})
                                        }}
                                        >
                                            {articleTagsOption}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row className="select-prot mt20">
                                    <Col span={7} className="text-right label"><span>平台类型：</span></Col>
                                    <Col span={14}>
                                        <Select placeholder="请选择" className="width100" value={platform} onChange={function (val) {
                                            _this.stateChange({platform:val})
                                        }}
                                        >
                                            {platformOptions}
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                            <div className="box-r-button">
                                <Form onSubmit={this.handleSubmit}>
                                    <Button className="width100" type="primary" htmlType="submit">发布</Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
                <CropperModal updateSrc={getNewImagePrefix(banner)} visible={cropperVisible} stateChange={this.stateChange} />
            </div>
        )
    }
}
FormContent = Form.create()(FormContent)
FormContent = withRouter(FormContent)
export default connect(mapStateToProps)(FormContent)