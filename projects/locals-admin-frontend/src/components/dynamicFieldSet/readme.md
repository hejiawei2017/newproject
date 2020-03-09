# 动态增减表单项组件

# 参数

* [必填] renderFieldFunc(key): 渲染表单项的内容, *key*参数是唯一值
* [可选] isCanEmpty: 是否容许为空, true: 可为空; false: 不可为空单项最少为一个
* [可选] isShowAdd: 是否显示添加按钮, true: 显示; false: 隐藏
* [可选] isShowDelete: 是否显示删除按钮, true: 显示; false: 隐藏
* [可选] defaultCount: 默认单项数量，默认为1

# 例子

```
...
renderField = (key) => {
    const { getFieldDecorator, getFieldValue } = this.props.form
    return (
        <div>
            <Row gutter={4}>
                <Col span={4}>
                    <FormItem>
                        {getFieldDecorator(`calcType${key}`, {
                            initialValue: 'scale'
                        })(
                            <Select>
                                <Option value="scale">比例计算</Option>
                                <Option value="absolute">固定计算</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
        </div>
    )
}

render () {
    return (
        <DynamicFieldSet renderFieldFunc={this.renderField} />
    )
}
...
```