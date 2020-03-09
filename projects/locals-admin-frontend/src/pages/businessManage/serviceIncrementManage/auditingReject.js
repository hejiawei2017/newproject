import React, {Component} from 'react'
import {Modal,Form,Input,message} from 'antd'
import {serviceIncrementManage} from "../../../services"
import {connect} from "react-redux"
import Global from "../../../utils/Global"
const { TextArea } = Input
const FormItem = Form.Item


const mapStateToProps = (state, action) => {
    return {
        serviceIncrementAuditingLogM: state.serviceIncrementAuditingLogM
    }
}
class AuditingReject extends Component {

    onOK = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            this.props.form.resetFields()
            this.onChangeStatusClick(values)
        })
    }

    //更改状态
    onChangeStatusClick = (obj) =>{
        const params = {
            activitystatus : 6,
            activityid:this.props.id,
            remark:obj.remark,
            creator:Global.userInfo.nickName,
            oldBusinessActivity:{
                id:this.props.id,
                status:6,
                timeVersion : new Date().getTime(),
                version : this.props.version,
                creator:Global.userInfo.nickName
            }
        }
        this.props.dispatch({
            type: 'STATUS_SERVICE_INCREMENT_MANAGE_ING'
        })
        serviceIncrementManage.statusServiceItem(params).then((data) => {
            this.props.dispatch({
                type: 'STATUS_SERVICE_INCREMENT_MANAGE_SUCCESS',
                payload:data
            })
            this.props.onCancel()
            message.success('操作成功',0.5)
        }).catch((data) => {
            this.props.dispatch({
                type: 'STATUS_SERVICE_INCREMENT_MANAGE_ING'
            })
            message.success('操作失败',0.5)
        })
    }



    render () {
        const { visible, onCancel,form} = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span:6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span:18 }
            }
        }
        return (
            <Modal
                visible={visible}
                title="审核记录"
                cancelText="取消"
                onCancel={onCancel}
                okText="提交"
                onOk={this.onOK}
            >
                <Form>
                    <p className="text-center padder-vb-md">{this.props.activityname} ({this.props.activitycode}）</p>
                    <FormItem label="备注" {...formItemLayout}>
                        {getFieldDecorator("remark",
                            {rules: [{ required:true, message:'原因不能为空'}]},
                        )(
                            <TextArea maxLength={2000} placeholder="请输入驳回原因" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </FormItem>
                </Form>

            </Modal>
        )
    }
}

let AuditingRejectNew = Form.create()(AuditingReject)
export default connect(mapStateToProps)(AuditingRejectNew)
