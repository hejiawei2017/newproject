import React, { PureComponent } from 'react'
import { Modal, Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
}
class OperateModal extends PureComponent {
    static defaultProps = {
        behavior: 'default',
        title: '默认标题'
    }
    onSubmit = () =>{
        this.props.form.validateFields((error, value) => {
            this.props.onSubmit(error, value)
        })
    }
    onCancel = () => {
        this.props.onCancel()
    }
    renderTable = () => {
        const { getFieldDecorator } = this.props.form
        const {editContent} = this.props
        console.log(editContent)
        return (
            <div>
                <Row>
                    <Col>
                        <FormItem
                            {...formItemLayout}
                            label={'userId'}
                        >
                        {getFieldDecorator('userId',{
                            rules:[{
                                required:true,
                                message:'请输入16位userId',
                                len:16,
                                whitespace:true
                            }],
                            initialValue:editContent ? editContent.userId : null
                        })(
                            <Input />
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formItemLayout}
                            label={'手机号'}
                        >
                            {getFieldDecorator('mobile',{
                                rules:[{
                                    required:true,
                                    message:'请输入正确的手机号',
                                    pattern:/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                                    len:11
                                }],
                                initialValue:editContent ? editContent.mobile : null
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem
                            {...formItemLayout}
                            label={'姓名'}
                        >
                             {getFieldDecorator('name',{
                                rules:[{
                                    required:true,
                                    message:'请输入姓名'
                                }],
                                initialValue:editContent ? editContent.name : null
                            })(
                                <Input />
                            )}
                        </FormItem>

                    </Col>
                </Row>
            </div>
        )
    }
    render () {
        const { visible, title } = this.props
        return (
            <Modal
                title={title}
                visible={visible}
                onCancel={this.onCancel}
                destroyOnClose
                onOk = {this.onSubmit}
            >
                {this.renderTable()}
            </Modal>
        )
    }
}

OperateModal = Form.create()(OperateModal)

export default OperateModal