import React, {Component} from 'react'
import {commentService} from '../../services/index'
import {Input, Form,Modal,message,Button,InputNumber,Row, Col} from 'antd'
import {connect} from "react-redux"
const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        addCommentM: state.addCommentM,
        updateCommentM: state.updateCommentM
    }
}

class CommentDetailForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            addStatus : false,
            updateStatus : false,
            formData:[],
            houseSourceId:'',
            bookingId:'',
            memberId:'',
            toMemberId:'',
            memberName:'',
            comment:'',
            stars:'',
            descriptionMatch:'',
            communication:'',
            clean:'',
            locationConvenient:'',
            checkin:'',
            priceRatio:''
        }
    }

    //提交数据
    handleOk = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            if(this.props.dataType === false){
                this.formAdd(values)
            }else{
                this.formUpdate(values)
            }
        })
    }

    // 新增数据
    formAdd (obj){
        const params = {
            'houseSourceId': obj.houseSourceId,
            'bookingId': obj.bookingId,
            'memberId': obj.memberId,
            'comment': obj.comment,
            'memberName': obj.memberName,
            'stars': obj.stars,
            'toMemberId': obj.toMemberId,
            'descriptionMatch': obj.descriptionMatch,
            'communication': obj.communication,
            'clean': obj.clean,
            'locationConvenient': obj.locationConvenient,
            'checkin': obj.checkin,
            'priceRatio': obj.priceRatio
        }
        this.props.dispatch({
            type: 'ADD_COMMENT_ING'
        })
        commentService.addComment(params).then((data) => {
            this.props.dispatch({
                type: 'ADD_COMMENT_SUCCESS'
            })
            message.success('添加成功！')
            this.props.onCancel()
        })
    }

    // 更新原本数据
    formUpdate (obj){
        const params = {
            'id':this.props.id,
            'version':this.props.formData.version,
            'stars': obj.stars,
            'houseSourceId': obj.houseSourceId,
            'bookingId': obj.bookingId,
            'toMemberId': obj.toMemberId,
            'memberId': obj.memberId,
            'memberName': obj.memberName,
            'comment': obj.comment,
            'descriptionMatch': obj.descriptionMatch,
            'communication': obj.communication,
            'clean': obj.clean,
            'locationConvenient': obj.locationConvenient,
            'checkin': obj.checkin,
            'priceRatio': obj.priceRatio
        }
        this.props.dispatch({
            type: 'UPDATE_COMMENT_ING'
        })
        commentService.updateComment(params).then((data) => {
            this.props.dispatch({
                type: 'UPDATE_COMMENT_SUCCESS'
            })
            message.success('更新成功！')
            this.props.onCancel()
        })
    }


    render () {
        const {visible, onCancel, form} = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:18 }
            }
        }
        let formData = this.props.formData

        const data = [{
            label:'房源ID',
            codetag:'houseSourceId',
            placeholder:'请输入房源ID',
            value:this.props.dataType ? formData.houseSourceId : '',
            message:'房源ID不能为空',
            number:false,
            relus:true
        },{
            id:'1',
            label:'预订ID',
            codetag:'bookingId',
            placeholder:'请输入预订ID',
            value:this.props.dataType ? formData.bookingId : '',
            message:'房源ID不能为空',
            number:false,
            relus:true
        },{
            label:'房东id',
            codetag:'memberId',
            placeholder:'请输入房东id',
            value:this.props.dataType ? formData.memberId : '',
            message:'房源ID不能为空',
            number:false,
            relus:true
        },{
            label:'房东名称',
            codetag:'memberName',
            placeholder:'请输入房东名称',
            value:this.props.dataType ? formData.memberName : '',
            message:'房源ID不能为空',
            number:false,
            relus:false
        },{
            label:'评价对象id',
            codetag:'toMemberId',
            placeholder:'请输入评价对象id',
            value:this.props.dataType ? formData.toMemberId : '',
            message:'房源ID不能为空',
            number:false,
            relus:true
        },{
            label:'评价内容',
            codetag:'comment',
            placeholder:'请输入评价内容',
            value:this.props.dataType ? formData.comment : '',
            message:'房源ID不能为空',
            number:false,
            relus:false
        },{
            label:'评星',
            codetag:'stars',
            placeholder:'请输入是否评星',
            value:this.props.dataType ? formData.stars : '',
            message:'房源ID不能为空',
            number:true,
            relus:false
        },{
            label:'描述相符',
            codetag:'descriptionMatch ',
            placeholder:'请输入是否描述相符',
            value:this.props.dataType ? formData.descriptionMatch : '',
            message:'描述相符不能为空',
            number:true,
            relus:false
        },{
            label:'沟通交流',
            codetag:'communication',
            placeholder:'请输入是否沟通交流',
            value:this.props.dataType ? formData.communication : '',
            message:'房源ID不能为空',
            number:true,
            relus:false
        },{
            label:'干净指数',
            codetag:'clean',
            placeholder:'请输入是否干净指数',
            value:this.props.dataType ? formData.clean : '',
            message:'干净指数不能为空',
            number:true,
            relus:false
        },{
            label:'位置便利指数',
            codetag:'locationConvenient',
            placeholder:'请输入是否位置便利指数',
            value:this.props.dataType ? formData.locationConvenient : '',
            message:'位置便利指数不能为空',
            number:true,
            relus:false
        },{
            label:'办理入住',
            codetag:'checkin',
            placeholder:'请输入是否办理入住',
            value:this.props.dataType ? formData.checkin : '',
            message:'办理入住不能为空',
            number:true,
            relus:false
        },{
            label:'性价比',
            codetag:'priceRatio',
            placeholder:'请输入是否性价比',
            value:this.props.dataType ? formData.priceRatio : '',
            message:'性价比不能为空',
            number:true,
            relus:false
        }]

        return (
            <Modal
                visible={visible}
                title= {this.props.dataType ? '详情' : '编辑'}
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                width="800px"
                footer={[
                    <span key="cancel" className="click-link mr-md" onClick={onCancel}>关闭</span>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        确定
                    </Button>
                ]}
            >
                <Form>
                    <Row gutter={16}>
                        {data.length > 0 ? data.map(function (item,index) {
                            return <Col span={12} key={index}>
                                <FormItem label={item.label} key={index} {...formItemLayout}>
                                    {getFieldDecorator(item.codetag,
                                        {initialValue:item.value, rules: [{ required:item.relus, message:item.message }]},
                                    )(
                                        item.number === true ? <InputNumber min={1} max={9} /> : <Input type="text" placeholder={item.placeholder} />

                                    )}
                                </FormItem>
                            </Col> }) : null
                        }
                    </Row>
                </Form>
            </Modal>
        )
    }
}

let CommentDetail = Form.create()(CommentDetailForm)
export default connect(mapStateToProps)(CommentDetail)