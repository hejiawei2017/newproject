import React, { Component } from 'react'
import { Row,Col,Form,message,Input,Button} from 'antd'
import { connect } from 'react-redux'
import { pushMagage } from '../../services'
import Search from '../../components/search'
import {serachIngUser,serachUserSuccess,sendByAdmin} from '../../actions/pushManage'
import SelectList from '../../components/selectList'
import {pageOption} from '../../utils/utils.js'

const FormItem = Form.Item
const { TextArea } = Input

const searchConfig = {
    items: [
        {
            type: 'text',
            name: '用户id',
            key: 'id',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入用户id'
        },
        {
            type: 'text',
            name: '用户昵称',
            key: 'nickName',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入用户昵称'
        }
    ]
}

const selectListConfig = {
    equalId:"id",
    showPage:true,
    scroll:{scroll:{y: 240 }},
    leftColumns: [
        {
            title: '用户ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '用户昵称',
            dataIndex: 'nickName',
            key: 'nickName'
        }
    ],
    rightColumns: [
        {
            title: '已选用户ID',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '已选用户昵称',
            dataIndex: 'nickName',
            key: 'nickName'
        }
    ]
}

const mapStateToProps = (state, action) => {
    return {
        userList: state.userList
    }
}

class PushManageForm extends Component {
    constructor (props) {
        super (props)
        this.state = {
            searchFields:{},
            uploading:false,
            selectData:[],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions:pageOption.pageSizeOpts
        }
        this.renderTable = this.renderTable.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount (){
        this.renderTable()
    }
    renderTable () { // 获取table数据
        const params = {...this.state.searchFields,
            pageNum:  this.state.pageNum,
            pageSize: this.state.pageSize
        }

        this.props.dispatch(serachIngUser(this.props.userList))
        pushMagage.getTable(params).then((data) => {
            this.props.dispatch(serachUserSuccess(data))
        }).catch((e) => {
            this.props.dispatch(serachIngUser(this.props.userList))
        })
    }
    setSelect = (list) => {
        this.setState({selectData:list})
    }
    setPageNum = (pageNum,pageSize) => {
        this.setState({
            pageNum:pageNum,
            pageSize:pageSize
        }, this.renderTable)
    }
    onSearch = (searchFields) => {
        this.setState({
            pageNum:1,
            searchFields:{
                id: searchFields.id.value,
                nickNameLike: searchFields.nickName.value
            }
        }, this.renderTable)
    }
    handleSubmit = (e) => {
        e.preventDefault()
        let self = this

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(self.state.selectData.length === 0){
                    message.error('请选择用户')
                }else{
                    self.toSubmit(values)
                }
            }
        })
    }
    toSubmit = (content) => {
        let data = content
        data.toUserNames = []
        for(let i in this.state.selectData){
            data.toUserNames.push(this.state.selectData[i].id)
        }

        this.setState({uploading: true })
        pushMagage.sendByAdmin(data).then((data) => {
            this.props.dispatch(sendByAdmin({
                type: 'SEND_BY_ADMIN',
                payload: data
            }))
            message.success('推送成功')
            this.setState({uploading: false })
        }).catch((e) => {
            this.setState({uploading: true })
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <Row>
                    <Col span={18} >
                        <SelectList setSelect={this.setSelect} setPageNum={this.setPageNum} selectData={this.state || []} initData={this.props.userList} config={selectListConfig} />
                    </Col>
                    <Col span={6} className="pl10">
                        <Form onSubmit={this.handleSubmit}>
                            请输入消息内容
                            <FormItem>
                                {getFieldDecorator('content', {
                                    rules: [{
                                        required: true, message: '请输入消息内容'
                                    }]
                                })(
                                    <TextArea rows={4} />
                                )}
                            </FormItem>
                            <Button className="upload-demo-start" type="primary" htmlType="submit" loading={this.state.uploading} >推送消息</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

let PushManage = Form.create()(PushManageForm)
export default connect(mapStateToProps)(PushManage)
