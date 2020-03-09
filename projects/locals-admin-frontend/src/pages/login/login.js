import React, {Component} from 'react'
import {loginService} from '../../services/index.js'
import { Icon, Tabs, Input, Button, Form, message } from 'antd'
import {withRouter} from 'react-router-dom'
import {InputCountdown} from '../../components/index.js'
import {reg, setCookie, clearAllCookie} from '../../utils/utils.js'
import checkToken from '../../utils/getUserRole'

const TabPane = Tabs.TabPane
const FormItem = Form.Item

class LoginFrom extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loginType: 'pass',
            buttonLoading: false,
            userName:'',
            password: '',
            tel: '',
            code: ''
        }
        this.tabsChange = this.tabsChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.loginClick = this.loginClick.bind(this)
        this.loginSuccess = this.loginSuccess.bind(this)
        this.loginError = this.loginError.bind(this)
        this.changeFormState = this.changeFormState.bind(this)
    }
    tabsChange (key) {
        // tabs 标签change
        this.setState({
            loginType: key
        })
    }
    loginClick () {
        // 登录按钮
        // this.setState({
        //buttonLoading: !this.state.buttonLoading
        // })
    }
    changeState (obj,fn) {
        // 状态改变
        this.setState(obj, () => {fn && fn()})
    }
    changeFormState (obj){
        // 修改手机号
        this.props.form.setFieldsValue(obj)
    }
    handleSubmit (e){
        clearAllCookie()
        // 表单提交
        e.preventDefault()
        const _this = this
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                _this.setState({
                    buttonLoading: true
                }, ()=>{
                    if(_this.state.loginType === 'pass'){
                        this.passLogin(values)
                    }else{
                        this.codeLogin(values)
                    }
                })
            }
        })
    }
    passLogin (obj){
        // 用户名登录
        const params = {
            'username': obj.userName,
            'password': obj.password
        }
        loginService.platformAuth(params).then(this.loginSuccess).catch(this.loginError)
    }
    codeLogin (obj){
        // 验证码登录
        const params = {
            'mobile': obj.tel,
            'authCode': obj.code
        }
        loginService.signInCode(params).then(this.loginSuccess).catch(this.loginError)
    }
    loginSuccess (data){
        clearAllCookie()
        if(data){
            message.success('登录成功！')
            setCookie('token', data)
            checkToken().then((e)=>{
                const firstRoute = e.firstRoute || '/login'
                this.props.history.push(firstRoute)
                window.location.reload()
            })
        }
        this.loginError()
    }
    loginError (data){
        this.setState({
            buttonLoading: false
        })
    }
    render () {
        const { loginType, buttonLoading } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <Tabs defaultActiveKey={loginType} onChange={this.tabsChange}>
                <TabPane tab="密码登录" key="pass" className="passBox">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem className="dfadf">
                            {getFieldDecorator('userName', {
                                rules: [{
                                    required: loginType === 'pass',
                                    message: '请输入用户名!'
                                }]
                            })(
                                <Input addonBefore={<Icon type="user" />} placeholder="请输入用户名" />
                            )}
                        </FormItem>
                        <FormItem className="dfadf">
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: loginType === 'pass', message: '请输入密码!'
                                }]
                            })(
                                <Input type="password" className="ffff" addonBefore={<Icon type="lock" />} placeholder="请输入密码" />
                            )}
                        </FormItem>
                        <Button type="primary" className="width100 mt10" loading={buttonLoading} onClick={this.loginClick} htmlType="submit">登录</Button>
                        <div className="mt20 tips">用户名密码登录</div>
                    </Form>
                </TabPane>
                <TabPane tab="手机登录" key="tel" className="telBox">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('tel', {
                                rules: [{
                                    required: loginType === 'tel',message: '请输入手机号码!'
                                },{
                                    pattern:reg.tel,message: '请输入正确手机号码!'
                                }]
                            })(
                                <InputCountdown changeState={this.changeFormState} addonBefore="user" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('code', {
                                rules: [{
                                    required: loginType === 'tel', message: '请输入验证码!'
                                }]
                            })(
                                <Input addonBefore={<Icon type="lock" />} placeholder="请输入验证码" />
                            )}
                        </FormItem>
                        <Button type="primary" className="width100 mt10" loading={buttonLoading} onClick={this.loginClick} htmlType="submit">登录</Button>
                        <div className="mt20 tips">手机号获取认证码登录</div>
                    </Form>
                </TabPane>
            </Tabs>
        )
    }
}
LoginFrom = Form.create()(LoginFrom)

export default withRouter(LoginFrom)