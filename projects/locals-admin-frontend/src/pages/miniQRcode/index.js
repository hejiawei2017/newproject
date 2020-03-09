import React, {Component} from 'react'
import { Row, Col, Input, Button } from 'antd'

import {goodsListService} from '../../services'
import downloadImageFile from '../../utils/downloadFile'
import {message} from "antd/lib/index"

class MiniQRcode extends Component {

    constructor () {
        super()
        this.state = {
            page: '',
            isRepeat: false,
            isCache: ''
        }
    }
    onChangePage = (e) => {
        this.setState({
            page: e.target.value || ''
        })
    }
    onChangeScene = (e) => {
        this.setState({
            scene: e.target.value || ''
        })
    }
    handleSubmit = () => {
        if(this.state.page === '') {
            message.warning('请输入路径')
            return
        }

        if(this.state.isRepeat) {
            message.warning('正在操作，请稍后')
            return
        }

        this.setState({isRepeat: true})
        goodsListService.getUatQRCode({
            appId: 'wxdb6b6dc4977e6ef0',
            secret: '672f098c286349e6f78d1dc26f9c76d0',
            path: `${this.state.page}`
        }).then((res) => {
            if(res){
                this.setState({isRepeat: false})
                let imgUrl = 'http://uat.localhome.cn' + res
                setTimeout(function (){
                    downloadImageFile.download(imgUrl,'路客精品小程序二维码')
                },800)
            }else{
                message.warning('请重新请求')
            }
        }).catch(() => {
            this.setState({isRepeat: false})
        })
    }
    render () {
        return (
            <Row gutter={16}>
                <Col span={12}>
                    <Input placeholder="请填入页面地址 如pages/index/index?navigateToHouseDetailId=931070309585129481" onChange={this.onChangePage} />
                </Col>
                <Col span={4}>
                    <Button loading={this.state.isRepeat} type="primary" icon="download" onClick={this.handleSubmit}>生成二维码</Button>
                </Col>
            </Row>
        )
    }

}
export default MiniQRcode
