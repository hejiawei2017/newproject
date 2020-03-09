import React, {Component} from 'react'
import { Icon, Input, message } from 'antd'
import {loginService} from '../../services'
import {reg} from '../../utils/utils.js'


/**
 * <InputCountdown changeState={this.changeFormState} changeKey="mobile" />
 * changeState 改变回调function
 * changeKey 修改key
 */
class InputCountdown extends Component {
    constructor (){
        super()
        this.state = {
            tel: '',
            countdown: 0
        }
        this.getCode = this.getCode.bind(this)
        this.inputChange = this.inputChange.bind(this)
    }
    inputChange (e) {
        // 改变值
        const val = e.target.value
        this.setState({tel: val})
        this.props.changeState({[this.props.changeKey || 'tel']: val})
    }
    changeCountdown (num){
        if (num >= 0){
            window.setTimeout(()=>{
                this.setState({countdown:num},()=>{
                    if(num > 0){
                        this.changeCountdown(num - 1)
                    }
                })
            },1000)
        }
    }
    getCode () {
        // 获取验证码
        const {tel, countdown} = this.state
        const time = 60
        if (countdown === 0) {
            if(!reg.tel.test(tel)){
                message.warning('请输入正确的手机号码！')
                return false
            }
            this.setState({countdown: time},()=>{
                loginService.sendCode({mobile: tel}).then((e)=>{
                    message.success('验证码发送成功！')
                })
                this.changeCountdown(time - 1)
            })
        }
    }
    render () {
        const {countdown} = this.state
        const {addonBefore} = this.props
        return (
            <Input
                addonBefore={addonBefore ? <Icon type={addonBefore} /> : null}
                addonAfter={<span className="cup" style={{'width':'70px','display':'inline-block'}} onClick={this.getCode}>{ countdown > 0 ? countdown.toString() : '获取验证码' }</span>}
                maxLength="11"
                placeholder="请输入手机号码"
                onChange={this.inputChange}
            />
        )
    }
}
export default InputCountdown