import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Icon } from 'antd'
import { CompactPicker } from 'react-color'
const FormItem = Form.Item
let uuid = 0
class DetailList extends Component {
    constructor (props) {
        super(props)
        this.addItem = this.addItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.changeColor = this.changeColor.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
    }
    changeColor (k, color) {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            ['template-color-' + k]: color.hex
        })
    }
    handleClose (k) {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            ['isShowColor' + k]: false
        })
    }
    handleOpen (k) {
        const { setFieldsValue } = this.props.form
        setFieldsValue({
            ['isShowColor' + k]: true
        })
    }
    addItem () {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(uuid)
        uuid++
        form.setFieldsValue({
            keys: nextKeys
        })
    }
    deleteItem (k) {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        })
    }
    render () {
        const _this = this
        const { getFieldDecorator, getFieldValue } = this.props.form
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 14
            }
        }
        getFieldDecorator('keys', {initialValue: []})
        const keys = getFieldValue('keys')
        const formItems = keys.map((k, index) => {
            return (
                <Row className="display-inline_block" key={k} gutter={4}>
                    <Col span={8}>
                        <FormItem
                            {...formItemLayout}
                            label="标题"
                        >
                            {getFieldDecorator(`template-title-${k}`)(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={9}>
                        <FormItem
                            {...formItemLayout}
                            label="内容"
                        >
                            {getFieldDecorator(`template-content-${k}`)(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="颜色"
                        >
                            {getFieldDecorator(`template-color-${k}`, {initialValue: '#000000'})(
                                <div>
                                    <Button
                                        style={{
                                            marginTop: 5,
                                            width: 30,
                                            height: 30,
                                            background: getFieldValue(`template-color-${k}`) || '#000'
                                        }}
                                        onClick={function () {_this.handleOpen(k)}}
                                    />
                                    {getFieldValue(`isShowColor${k}`) ? (
                                        <div className="color-picker">
                                            <div
                                                className="mask"
                                                onClick={function () {_this.handleClose(k)}}
                                            />
                                            <CompactPicker
                                                color={getFieldValue(`template-color-${k}`)}
                                                onChange={function (color) {_this.changeColor(k, color)}}
                                            />
                                        </div>) : null}
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <Icon
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={function () {_this.deleteItem(k)}}
                        />
                    </Col>
                </Row>
            )
        })
        return (
            <div>
                {formItems}
                <Button type="primary" onClick={this.addItem}>
                    <Icon type="plus" /> 新增内容
                </Button>
            </div>
        )
    }
}

export default DetailList