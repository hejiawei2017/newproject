import React, { Component } from 'react'
import { Modal, Form, Row, Col, Select, InputNumber, Button, Table } from 'antd'
import { standardManageService } from '../../services'

const {Item} = Form
const {Option} = Select

const columns = [{
    title: '变更时间',
    dataIndex: 'createTime'
}, {
    title: '投资回报基准值',
    dataIndex: 'amountMoney',
    render: (text, record) => {
        return (<span>￥{record.amountMoney}/{record.investYear}年</span>)
    }
}, {
    title: '操作人',
    dataIndex: 'creator'
}]

class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            editModalVisible: true,
            dataSource: [],
            years: []
        }
    }
    componentDidMount () {
        this.getHistory()
        this.getYearRange()
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const { planId, signYears } = this.props.single
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values)
                let data = {
                    planId: planId,
                    currency: values.exchange,
                    investBaseValue: values.money,
                    investYear: values.year,
                    signYears: signYears
                }
                this.handleCancel()
                this.props.updateBase(data)
            }
        })
    }
    handleCancel = () => {
        this.setState({
            editModalVisible: false
        }, () => {
            this.props.stateChange({editModalVisible: false})
        })
    }
    getHistory = () => {
        let { planId } = this.props.single
        standardManageService.getBase(planId).then((res) => {
            this.setState({
                dataSource: res
            })
        })
    }
    getYearRange = () =>{
        let { startTime, endTime } = this.props.single
        let range = new Date(endTime).getFullYear() - new Date(startTime).getFullYear()
        let years = []
        for (let i = 1; i <= range; i++) {
            years.push(i)
        }
        this.setState({
            years: years
        })
    }
    render () {
        const { editModalVisible, dataSource, years } = this.state
        const { getFieldDecorator } = this.props.form
        const { lotelNo, contractName, planType, startTime, endTime } = this.props.single
        return (
            <Modal
                visible={editModalVisible}
                onCancel={this.handleCancel}
                title="设置基准值"
                width={700}
                footer={null}
            >
                <Row className="mb20">
                    <Col span={8}>{`${lotelNo}(${contractName})`}</Col>
                    <Col span={6}>{planType}</Col>
                    <Col span={10}>合同时间：{`${startTime} ~ ${endTime}`}</Col>
                </Row>
                <Form layout="inline" onSubmit={this.handleSubmit} className="mb20">
                    <Item label="投资回报基准值">
                        {getFieldDecorator('exchange', {
                            rules: [{ required: true, message: '请选择汇率！' }]
                        })(
                            <Select
                                placeholder="选择汇率"
                                style={{ width: '100px' }}
                            >
                                <Option value="1">人民币</Option>
                                <Option value="2">美元</Option>
                            </Select>
                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('money', {
                            rules: [{ required: true, message: '请填写金额！' }],
                            initialValue: 1
                        })(
                            <InputNumber
                                formatter={function (value) {return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}
                                parser={function (value) {return value.replace(/\$\s?|(,*)/g, '')}}
                                min={1}
                                style={{ width: '150px' }}
                            />
                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('year', {
                            rules: [{ required: true, message: '请选择年限！' }]
                        })(
                            <Select
                                placeholder="选择年限"
                                style={{ width: '100px' }}
                            >
                                {years.map(function (v, i) {
                                    return (<Option key={i} value={v}>{v}</Option>)
                                })}
                            </Select>
                        )}
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Item>
                </Form>
                <div className="pb10 bb">历史基准值</div>
                <Table columns={columns} dataSource={dataSource} rowKey="id" />
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal