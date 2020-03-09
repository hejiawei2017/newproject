import React, { Component } from 'react'
import { Row, Col, Modal, Form, Select, Input, Button, Radio } from 'antd'
import {houseSettingService} from '../../services'
import {message} from "antd/lib/index";
import ComponentTreeSelect from '../../components/buAreaTreeSelect/index'
import {equalsRoleExist, equalsUserExistSuperAuth} from '../../utils/getUserRole'

import './index.less'
import {houseManageSearch} from "../../utils/dictionary";

const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search
const RadioGroup = Radio.Group


class EditModal extends Component {
    constructor (props) {
        super(props)
        let thenAssistantList = props.houseInfo.thenAssistantList.length > 0 ? props.houseInfo.thenAssistantList : [{
            userId: '',
            name: '',
            code: '',
            mobile: '',
            index: 1
        }]
        //当没有大区ID时，需要用户手动选择大区，再重新设置BU，因为在迁移过程中有些数据问题，后端暂时没解决
        let formParams = {}
        if(!!props.houseInfo.areaId) {
            formParams = {
                areaId: props.houseInfo.areaId || undefined,
                buId: props.houseInfo.buId || undefined,
                mainAssistantId: props.houseInfo.mainAssistantId || undefined
            }
        }
        this.state = {
            houseInfo : props.houseInfo,
            mainAssistantList: [], //助理
            thenAssistantList: thenAssistantList, //副管家
            formParams: formParams,
            buUserInfo: {
                realName: '',
                mobile: ''
            }, //BU总管
            awardMonth: '',
            isSettingAwardMount: false,
            loading: false
        }
        this.handleCancel = this.handleCancel.bind(this)

        if(!!props.houseInfo.areaId) {
            this.getBuUserInfo(props.houseInfo.buId)
        }
    }
    handleCancel () {
        this.props.stateChange({editModalVisible: false})
    }

    //获取BU总管信息
    getBuUserInfo = (buId) => {
        if(!!buId) {
            houseSettingService.fetchPositions({
               }).then((res) => {
                let positionInfo = {} //职位信息
                let assistantInfo = {}
                res.list.forEach(item => {
                    if(item.name === 'BU') {
                        positionInfo = item
                    }
                    if(item.name === '助理') {
                        assistantInfo = item
                    }
                })

                //根据职位ID获取BU总管
                this.getHouseRoleUser(positionInfo.id, buId, res => {
                    let buUserInfo = res.length > 0 ? res[res.length - 1] : {}
                    this.setState({buUserInfo})
                })

                //获取管家
                this.getHouseRoleUser(assistantInfo.id,buId, res => {
                    //如果管家没有设置手机号时，不展示管家数据
                    const mainAssistantList = res.filter(item => {
                        return !!item.comMobile
                    })
                    this.setState({mainAssistantList})
                })
            })
        }

    }
    getHouseRoleUser = (pId, buId, fn) => {
        houseSettingService.fetchHouseRoleUser({
            positionId: pId,
            organizationId: buId,
            pageSize: 100
        }).then((res) => {
            if(res.list !== null && res.list.length > 0) {
                fn(res.list)
            }else{
                fn([])
            }
        })
    }
    //选择管家
    handleAssistantChange = (e) => {
        let isSettingAwardMount = false
        if(this.state.houseInfo.mainAssistantId !== ''){
            isSettingAwardMount = true
        }
        let formParams = this.state.formParams
        formParams.mainAssistantId = e
        this.setState({
            formParams,
            awardMonth: '',
            isSettingAwardMount
        })
    }
    //添加副管家
    handleAddThenAssistant = () => {
        let thenAssistantList = this.state.thenAssistantList
        thenAssistantList.push({
            userId: '',
            name: '',
            code: '',
            mobile: '',
            index: thenAssistantList.length + 1
        })
        this.setState({thenAssistantList})

    }
    handleDeleteThenAssistant = (index) => {
        let thenAssistantList = this.state.thenAssistantList
        thenAssistantList.splice(index, 1)
        this.setState({thenAssistantList})
    }

    handleInputSearch = (keyword,index) => {
        let thenAssistantList = this.state.thenAssistantList
        houseSettingService.fetchUserSimpleInfo({
            mobile: keyword
        }).then((res) => {
            if(res !== null){
                thenAssistantList[index].userId = res.id
                thenAssistantList[index].mobile = res.mobile
                thenAssistantList[index].name = res.realName === null || res.realName === '' ? res.nickName : res.realName
            }else{
                thenAssistantList[index].userId = ''
                thenAssistantList[index].name = ''
                message.warning('当前手机号获取不到人员信息')
            }
            this.setState({thenAssistantList})
        })
    }
    render () {
        let that = this
        const { getFieldDecorator } = this.props.form
        const { houseInfo, buUserInfo, mainAssistantList, thenAssistantList, formParams, isSettingAwardMount, awardMonth, loading } = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 }
            }
        }
        let buName = !!buUserInfo.comMobile ? buUserInfo.comMobile : '暂无公司手机号'
        buName = buName + (buUserInfo.realName ? '(' + buUserInfo.realName + ')' : '')
        return (
            <Modal className="house-setting-edit"
                width={700}
                visible={this.props.editModalVisible}
                title="编辑"
               onCancel={this.handleCancel}
               footer={[
                   <Button key="back" onClick={this.handleCancel}>关闭</Button>,
                   <Button key="submit" type="primary" loading={loading} onClick={function () {
                       that.props.form.validateFields((err, values) => {
                           if (!err) {
                               if(!buUserInfo.userId) {
                                   message.warning('当前BU未设置BU总管，请更换BU！')
                                   return;
                               }else{
                                   let associateAssistUserId = []
                                   thenAssistantList.forEach((item) => {
                                       if(item.userId !== '') {
                                           associateAssistUserId.push(item.userId)
                                       }
                                   })
                                   let params = {
                                       houseSourceId: houseInfo.houseSourceId,
                                       areaId: formParams.areaId, //房源大区编码
                                       buId: formParams.buId, //房源BU编码
                                       awardMonth: awardMonth,
                                       buUserId: buUserInfo.userId,
                                       assistUserId: values.mainAssistantId,
                                       associateAssistUserId: associateAssistUserId
                                   }

                                   that.setState({ loading: true })
                                   houseSettingService.fetchHouseRole(params).then((res) => {
                                       if(!!res) {
                                           setTimeout(() => {
                                               message.success('修改成功！')
                                               that.props.handleSubmit()
                                           }, 2000)
                                       }
                                       that.setState({ loading: false })
                                   }).catch((err) => {
                                       that.setState({ loading: false })
                                   })
                               }
                           }
                       })
                   }}
                   >保存</Button>
               ]}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="房源编码"
                    >
                        { houseInfo.houseNo }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="上线状态"
                    >
                        {houseManageSearch.houseStatus[houseInfo.houseWorkflowStatus]}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="BU"
                    >
                        {getFieldDecorator('buId', {
                            initialValue: formParams.buId,
                            rules: [{ required: true, message: '请选择BU' }]
                        })(
                            <ComponentTreeSelect
                             disabled={!equalsUserExistSuperAuth(['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR']) && equalsRoleExist('ROLE_BU')}
                             buId={formParams.buId}
                             placeholder="请选择BU"
                             onChange={function (areaId, buId) {
                                let formParams = that.state.formParams
                                formParams.areaId = areaId
                                formParams.buId = buId
                                that.setState({
                                    formParams
                                }, () => {
                                    that.props.form.setFieldsValue({mainAssistantId: undefined})
                                    that.getBuUserInfo(buId)
                                })
                            }}
                            />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="BU总管"
                    >
                        <Input value={buName} disabled />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="管家"
                    >
                        {getFieldDecorator('mainAssistantId', {
                            initialValue: formParams.mainAssistantId
                        })(
                            <Select placeholder="请选择管家" onChange={that.handleAssistantChange} disabled={!equalsUserExistSuperAuth(['AUTH_ADMIN', 'AUTH_SUPER', 'AUTH_HR']) && equalsRoleExist('ROLE_BU')}>
                                {
                                    mainAssistantList.map(item => {
                                        return (<Option value={item.userId} key={item.userId}>{item.comMobile}({item.realName})</Option>)
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <Row gutter={10} justify="end">
                        <Col span={19} offset={5}>
                            <div className="house-setting-mark">注：BU总管和主管家在此处显示的手机号为公司手机号</div>
                        </Col>
                    </Row>
                    {
                        isSettingAwardMount ?
                        <FormItem
                        {...formItemLayout}
                        label="接管月奖起计月份"
                        >
                            {getFieldDecorator('awardMonth', {
                                rules: [{ required: true, message: '请选择接管月奖起计月份' }]
                            })(
                                <RadioGroup onChange={function (e) {
                                    let val = e.target.value
                                    that.setState({awardMonth: val})
                                }}
                                >
                                    <Radio value={0}>当月</Radio>
                                    <Radio value={1}>次月</Radio>
                                </RadioGroup>
                            )}
                        </FormItem> : null
                    }
                    {
                        isSettingAwardMount ?
                        <Row gutter={10} justify="end">
                            <Col span={19} offset={5}>
                                <div className="house-setting-mark">注：该月份的选择会影响【路客订单奖】、【月度入住奖】的计算。</div>
                            </Col>
                        </Row> : null
                    }
                    <FormItem
                        {...formItemLayout}
                        label="副管家"
                    >
                        <div>
                            {
                                thenAssistantList.map((item,index) => {
                                    return (
                                        <Row gutter={10} key={`thenAssistantList-key-${item.index}`}>
                                            <Col span={12}>
                                                <Search
                                                    key={`thenAssistantList-${item.index}`}
                                                    defaultValue={item.mobile}
                                                    placeholder="请输入私人号码"
                                                    onSearch={function (keyword) {
                                                        that.handleInputSearch(keyword,index)
                                                    }}
                                                    enterButton
                                                />
                                            </Col>
                                            <Col span={10}>
                                                <Input disabled value={item.name} />
                                            </Col>
                                            <Col span={2}>
                                                <Button onClick={function () {
                                                    that.handleDeleteThenAssistant(index)
                                                }} type="danger" shape="circle" icon="delete"
                                                />
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                            <Button type="primary" shape="circle" icon="plus-circle" onClick={this.handleAddThenAssistant} />
                        </div>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal
