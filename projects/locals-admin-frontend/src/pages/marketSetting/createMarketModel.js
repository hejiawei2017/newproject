import React from 'react'
import { Modal, Form, Input, DatePicker,Select } from 'antd';
import {maketService} from '../../services'
const { RangePicker } = DatePicker;
const { Option } = Select;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      selValue: '1'
    }

    onChange = (value) =>{
      this.setState({selValue:value})
    }

    render () {
      const {
        visible, onCancel, onCreate, form ,giftData
      } = this.props;
      const { getFieldDecorator,getFieldValue } = form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      }
      return (
        <Modal
          visible={visible}
          title="创建规则"
          okText="创建"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="horizontal">
            <Form.Item label="选择创建类型" {...formItemLayout}>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择规则类型' }],
                initialValue: "1"
              })(
                <Select setFieldsValue={getFieldValue('type')} onChange={this.onChange}>
                  <Option key="1" value="1">拉粉奖励</Option>
                  <Option key="2" value="2">注册奖励</Option>
                  <Option key="3" value="3">礼包奖励</Option>
                  <Option key="4" value="4">订房奖励</Option>
                  <Option key="5" value="5">房晚奖励</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="规则名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true,max:10, message: '请输入正确的规则名称' }]
              })(
                <Input placeholder="请输入规则名称"/>
              )}
            </Form.Item>
            <Form.Item label="有效期" {...formItemLayout}>
              {getFieldDecorator('time', {
                rules: [{ required: true, message: '请选择正确的有效期' }]
              })(
                <RangePicker showTime format="YYYY/MM/DD HH:mm:ss" />
              )}
            </Form.Item>
            <Form.Item label="单笔奖励（元）" {...formItemLayout}>
              {getFieldDecorator('bonus', {
                rules: [{ required: true, pattern:'^([1-9]?(\\.\\d{1,2})?|[1-9]\\d?(\\.\\d{1,2})?|[1-4]\\d?[0-9]?(\\.\\d{1,2})?|0\\.\\d{1,2}|500)$', message: '请输入正确的单笔奖励' }]
              })(
                <Input placeholder="请输入单笔奖励" max="500"/>
              )}
            </Form.Item>
            {this.state.selValue === '1' ? (
              <Form.Item label="拉粉统计日期:" {...formItemLayout}>
                {getFieldDecorator('dayOfMonth', {
                  rules: [{ required: false, message: '请输入拉粉统计日期' }]
                })(
                  <Input disabled placeholder="9"/>
                )}
              </Form.Item>
            ) : (
              <div></div>
            )}
            {this.state.selValue !== '3' ? (
              <Form.Item label="适用范围" {...formItemLayout}>
                {getFieldDecorator('range1', {
                  rules: [{ required: false, message: '请选择适用礼包' }]
                })(
                  <Input disabled placeholder="全部房源"/>
                )}
              </Form.Item>
            ) : (
              <Form.Item label="适用范围" {...formItemLayout}>
                {getFieldDecorator('giftCode', {
                  rules: [{ required: true, message: '请选择适用礼包' }],
                  initialValue: "0"
                })(
                  <Select setFieldsValue={getFieldValue('giftCode')}>
                    <Option key="0" value="0">选择适用礼包</Option>
                    {giftData.map((item)=>
                      <Option key={item.id} value={item.id}>{item.title}</Option>
                    )}
                  </Select>
                )}
              </Form.Item>
            )}
          </Form>
        </Modal>
      );
    }
  }
);

export default CollectionCreateForm