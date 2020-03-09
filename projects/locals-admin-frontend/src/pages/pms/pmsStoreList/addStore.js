import React, {Component} from 'react'
import {Drawer} from 'antd'
import EditStoreForm from './editStoreForm'
class AddStore extends Component {
    constructor (props) {
        super(props)
        this.state = {
            editData:{
                hotelName: null,
                address: null,
                longitude: null,
                latitude:null,
                linkMan:null,
                linkPhone:null,
                currency: 'CNY',
                exchangeRate:null,
                hotelType: 1,
                overBooking:null,
                hotelNo:null,
                images: [{
                        module: "门店",
                        images: []
                }
                ],
                fileLists: []
            }
        }
    }

    render () {
        const _this = this
        const {visible, onCancel} = _this.props
        return (
            <Drawer
                title="新增门店"
                width={800}
                onClose={onCancel}
                visible={visible}
                style={{
                    overflow: 'auto',
                    height: 'calc(100% - 80px)',
                    paddingBottom: '80px'
                }}
            >
                <EditStoreForm
                    onCancel={onCancel}
                    type="AddStore"
                    data={this.state.editData}
                />
            </Drawer>
        )
    }
}

export default AddStore
