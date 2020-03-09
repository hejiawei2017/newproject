import React, {Component} from 'react'
import { Modal } from 'antd'
import { envConfig } from "../../utils/utils"

class AccessoryModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            imgList: []
        }
    }
    componentWillReceiveProps (nextProps) {
        // console.log('批量--->', nextProps.visible)
    }
    handleCancel = () => {
        this.setState({
            visible: false
        }, () => {
            this.props.stateChange({accessoryType: false})
        })
    }
    render () {
        const { data } = this.props
        const { visible } = this.props
        return (
            <Modal
                title="附件"
                width={900}
                visible={visible}
                bodyStyle={{padding:"10px"}}
                onCancel={this.handleCancel}
                footer={null}
            >
                <div className="text-center">
                    { data.length > 0 ? data.map(function (item, index) {
                        return <img className="mb20" style={{width:'80%'}} src={item} alt="加载失败..." />
                    }) : <div style={{padding:"20px"}}>暂无附件</div>
                    }
                </div>
            </Modal>
        )
    }
}

export default AccessoryModal