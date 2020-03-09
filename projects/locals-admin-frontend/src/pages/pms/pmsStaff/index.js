
import React, {Component} from 'react'
import {Input, Form, Button, Radio, Popconfirm, message, Spin, Row, Col} from 'antd'
import { withRouter } from 'react-router-dom'
import {houseSettingService, pmsService} from '../../../services'
import './index.less'

const FormItem = Form.Item
const Search = Input.Search

class PmsStaff extends Component {
    constructor (props) {
        super(props)
        this.state = {
            thenAssistantList: [
                {
                    userId: '',
                    realName: '',
                    code: '',
                    phone: '',
                    index: 1
                }
            ]
        }

    }


    // // 组件渲染后调用
    componentDidMount (){
        this.getPmsEmployee()
    }
    getPmsEmployee = () => {
        this.setState({
            loading: true
        })
        pmsService.getPmsEmployee({hotelId: this.props.hotelId}).then(thenAssistantList => {
            this.setState({thenAssistantList, loading: false})
        })
    }
    handleDeleteThenAssistant = (index) => {
        let thenAssistantList = this.state.thenAssistantList
        if(!thenAssistantList[index].hotelRoleId){
            thenAssistantList.splice(index, 1)
            this.setState({thenAssistantList})
            return
        }
        let params = {
            userId: thenAssistantList[index].userId,
            id: thenAssistantList[index].hotelRoleId,
            hotelId: this.props.hotelId
        }
        params = JSON.stringify(params)
        pmsService.deletePmsEmployee(params).then(data => {
            message.success('删除成功')
            thenAssistantList.splice(index, 1)
            this.setState({thenAssistantList})
        })
    }
    handleAddThenAssistant = () => {
        let thenAssistantList = this.state.thenAssistantList
        thenAssistantList.push({
            userId: '',
            realName: '',
            code: '',
            phone: '',
            index: thenAssistantList.length + 1
        })
        this.setState({thenAssistantList})

    }
    handleInputSearch = (keyword,index) => {
        let thenAssistantList = this.state.thenAssistantList
        let samePhone = false
        this.setState({
            loading: true
        })
        if(!keyword){
            message.warning('请先输入手机号码')
            return
        }else{
            thenAssistantList.forEach(item => {
                if(keyword === item.phone){
                    message.warning('手机号码重复')
                    samePhone = true
                    this.setState({
                        loading: false
                    })
                }
            })
        }
        !samePhone && houseSettingService.fetchUserSimpleInfo({
            mobile: keyword
        }).then((res) => {
            if(res !== null){
                thenAssistantList[index].userId = res.id
                thenAssistantList[index].phone = res.mobile
                thenAssistantList[index].realName = res.realName === null || res.realName === '' ? res.nickName : res.realName
                pmsService.addPmsEmployee({
                    userId: res.id,
                    hotelId: this.props.hotelId
                }).then(data => {
                    message.success('添加成功')
                    this.getPmsEmployee()
                })
            }else{
                thenAssistantList[index].userId = ''
                thenAssistantList[index].realName = ''
                message.warning('当前手机号获取不到人员信息')
                this.setState({
                    loading: false
                })
            }
        }).catch(() => {
            this.setState({
                loading: false
            })
        })
    }
    render () {
        const that = this
        const {loading, upteLoading, thenAssistantList} = that.state
        return (
            <div style={{width:'60%',margin:'0 auto',padding: '24px'}}>
                <Spin spinning={this.state.loading}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            <div>
                                {
                                    thenAssistantList.map((item,index) => {
                                        return (
                                            <Row gutter={10} key={item.userId + index}>
                                                <Col span={12}>
                                                    <Search
                                                        key={`thenAssistantList-${index}`}
                                                        defaultValue={item.phone}
                                                        placeholder="请输入员工号码"
                                                        onSearch={function (keyword) {
                                                            that.handleInputSearch(keyword,index)
                                                        }}
                                                        disabled={!!item.hotelRoleId}
                                                        enterButton
                                                    />
                                                </Col>
                                                <Col span={10}>
                                                    <Input disabled value={item.realName} />
                                                </Col>
                                                <Col span={2}>
                                                    <Popconfirm placement="topLeft" title="确定删除吗？" onConfirm={function () {
                                                        that.handleDeleteThenAssistant(index)
                                                    }} okText="是" cancelText="否"
                                                    >
                                                        <Button type="danger" shape="circle" icon="delete" />
                                                    </Popconfirm>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                                <Button type="primary" shape="circle" icon="plus-circle" onClick={this.handleAddThenAssistant} />
                            </div>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        )
    }
}

PmsStaff = Form.create()(PmsStaff)
export default withRouter(PmsStaff)
