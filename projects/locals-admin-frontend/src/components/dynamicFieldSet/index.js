import React, { Component } from 'react'
import { Row, Col, Icon, Button, Form} from 'antd'
import PropTypes from 'prop-types'

/**
 * 动态增减表单项
 * @props renderFieldFunc(key) 渲染表单项的内容, *key*参数是唯一值
 * @props isCanEmpty 是否容许为空, true: 可为空; false: 不可为空单项最少为一个
 * @props isShowAdd 是否显示添加按钮, true: 显示; false: 隐藏
 * @props isShowDelete 是否显示删除按钮, true: 显示; false: 隐藏
 * @props defaultCount 默认单项数量，默认为1
 */

let uuid = 0

class DynamicFieldSet extends Component {
    static defaultProps = {
        isCanEmpty: false,
        defaultCount: 1,
        isShowAdd: true,
        isShowDelete: true
    }
    static propTypes = {
        renderFieldFunc: PropTypes.func.isRequired,
        isCanEmpty: PropTypes.bool,
        defaultCount: PropTypes.number,
        isShowAdd: PropTypes.bool
    }
    init = () => {
        const { defaultCount } = this.props
        for (let i = 0; i < defaultCount; i++) {
            this.addItem()
        }
    }
    addItem = () => {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(uuid)
        uuid++
        form.setFieldsValue({
            keys: nextKeys
        })
    }
    deleteItem = (k) => () => {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        uuid--
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        })
    }
    renderFormItems = () => {
        const { renderFieldFunc, isCanEmpty, isShowDelete, form, defaultCount } = this.props
        const { getFieldValue, getFieldDecorator } = form
        let initialValue = []
        for (let i = 0; i < defaultCount; i++) {
            initialValue.push(i)
        }
        getFieldDecorator('keys', { initialValue });
        const keys = getFieldValue('keys')
        return (
            <div>
                { Array.isArray(keys) && keys.map( (key, index) => {
                    let rowItem = (
                        <Row key={index}>
                            <Col span={22}>
                                { renderFieldFunc && renderFieldFunc(key) }
                            </Col>
                            { isShowDelete ? (
                                <Col span={2}>
                                    {keys.length > 1 || isCanEmpty ? (
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={this.deleteItem(key)}
                                        />
                                    ) : null}
                                </Col>
                            ) : null }
                        </Row>
                    )
                    return rowItem
                } ) }
            </div>
        )
    }
    render () {
        const { isShowAdd } = this.props
        return (
            <div>
                { this.renderFormItems() }
                { isShowAdd ? (
                    <Button type="primary" onClick={this.addItem}>
                        <Icon type="plus" /> 添加
                    </Button>
                ) : null }
            </div>
        )
    }
}

DynamicFieldSet = Form.create({name: 'dynamic_form_item'})(DynamicFieldSet)

export default DynamicFieldSet
