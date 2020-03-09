import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import sessionstorage from 'sessionstorage'
import { Layout, Icon, Avatar, Menu, Dropdown, Modal, Form, Input, message} from 'antd'
import LayoutMenu from './menu.js'
import Global from '../../utils/Global.js'
import { onExit, getNewImagePrefix } from '../../utils/utils'
import { dicModel } from '../../utils/dictionary'
import {loginService} from '../../services'
import {InputCountdown} from '../index'
import './layout.less'
const { Header, Sider } = Layout
const FormItem = Form.Item

const mapStateToProps = (state, action) => {
    return {
        userLoginInfo: state.userLoginInfo
    }
}
class LayoutFrom extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            collapsed: false,
            path: '',
            theme: 'dark',
            userInfo: Global.userInfo || {
                avatar: '',
                userName: ''
            }
        }
        this.toggle = this.toggle.bind(this)
        this.handleClickMenu = this.handleClickMenu.bind(this)
        this.handleChangePassowrd = this.handleChangePassowrd.bind(this)
        this.dialogOk = this.dialogOk.bind(this)
        this.dialogCancel = this.dialogCancel.bind(this)
        this.getCode = this.getCode.bind(this)
    }
    changeTheme = (value) => {
        this.setState({
            theme: value ? 'dark' : 'light',
            modalVisible: false
        })
    }
    toggle () {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    handleChangePassowrd (){
        this.setState({
            modalVisible:true
        })
    }
    handleClickMenu = () => {
        // const _this = this
        console.log('onExit')
        onExit().then((e) => {
            //退出登录后，清除打开的页面记录
            sessionstorage.removeItem('locals_admin_tags_list')
            this.props.history.push('/login')
            window.location.reload()
        })
    }
    dialogCancel (e){
        this.setState({
            modalVisible:false
        })
    }
    changeFormState = (obj) => {
        // 修改手机号
        this.props.form.setFieldsValue(obj)
    }
    dialogOk (e){
        e.preventDefault();
        this.props.form.validateFields(
            (err,values) => {
                if (!err) {
                    let data = {
                        mobile:values.mobile,
                        code:values.code,
                        password:values.password
                    }
                    loginService.forgetPassword(data).then((e)=>{
                        message.success('修改密码成功！')
                        this.setState({
                            modalVisible:false
                        })
                    }).catch((e) => {
                        message.warning('请求失败！')
                    })
                }
            }
        )
    }
    getCode () {
        // 获取验证码
        let mobile = this.props.form.getFieldValue('mobile')
        if (mobile) {
            loginService.sendCode({mobile: mobile}).then((e)=>{
                message.success('验证码发送成功！')
            }).catch((e) => {
                message.warning('请求失败！')
            })
        }else{
            message.warning('请输入正确的手机号码！')
        }
    }
    render () {
        const { collapsed, userInfo, theme } = this.state
        const { getFieldDecorator } = this.props.form
        const menuOver = (
            <Menu>
                <Menu.Item key="changePassword" onClick={this.handleChangePassowrd}>
                    <span><Icon type="contacts" />修改密码</span>
                </Menu.Item>
                <Menu.Item key="logout" onClick={this.handleClickMenu}>
                    <span><Icon type="logout" />退出登录</span>
                </Menu.Item>
            </Menu>
        )
        const colStyle = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        }
        return (
            <Layout id="components-layout">
                <Sider
                    // width="240"
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <div className="logo">
                        <img src={require("../../images/locals.png")} alt="" />
                        {collapsed ?
                            null :
                            <div>路客管理后台</div>
                        }
                    </div>
                    <LayoutMenu theme={theme} />
                </Sider>
                <Layout>
                    <Header className="layout-right_header">
                        <div className="menu-trigger">
                            <Icon
                                className="trigger mr20"
                                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            {/* <Switch
                                checked={this.state.theme === 'dark'}
                                onChange={this.changeTheme}
                                checkedChildren="Dark"
                                unCheckedChildren="Light"
                            /> */}
                        </div>
                        <div className="right-warpper">
                            {/* <div className="button">
                                <Icon type="notification" />
                            </div> */}
                            <Dropdown overlay={menuOver}>
                                <span className="user-dropdown">
                                    <span className="mr20">{this.props.userLoginInfo.nickName}</span>
                                    {this.props.userLoginInfo.avatar ?
                                        <Avatar src={getNewImagePrefix(this.props.userLoginInfo.avatar)}></Avatar>
                                        : <Avatar icon="user" /> }
                                </span>
                            </Dropdown>
                        </div>
                    </Header>
                    {this.props.children}
                </Layout>
                <Modal title="修改密码" visible={this.state.modalVisible} onOk={this.dialogOk} onCancel={this.dialogCancel} {...dicModel} >
                    <Form layout="horizontal">
                        <FormItem label="手机号码" className="securityCodeBox" {...colStyle} >
                            {getFieldDecorator('mobile', {
                                rules: [{ required: true, message: '请输入手机号码！' }]
                            })(
                                <InputCountdown changeState={this.changeFormState} changeKey="mobile" />
                            )}
                        </FormItem>
                        <FormItem label="验证码" {...colStyle}>
                            {getFieldDecorator('code', {
                                rules: [{ required: true, message: '请输入验证码！' }]
                            })(
                                <Input placeholder="请输入验证码！" />
                            )}
                        </FormItem>
                        <FormItem label="密码" {...colStyle}>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码！' }]
                            })(
                                <Input placeholder="请输入密码！" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>
        )
    }
}
let LayoutProps = Form.create()(LayoutFrom)
let connectLayout = connect(mapStateToProps)(LayoutProps)
export default withRouter(connectLayout)
