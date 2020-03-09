import React, {Component} from 'react'
import {Form,Modal,message,Button,Icon,Select,Input} from 'antd'
import {pmsService} from '../../../services'

class AddHouseForm extends Component {
    constructor (props) {
        super(props)
        this.state = {
            data: [],
            value: [],
            fetching: false,
            selectedItems: [],
            selectOptions: [],
            loadingSelect: false,
            inputValue: '',
            selectOpen: false
        }
    }

    componentDidMount () {
        const {hotelInfo} = this.props;
        if(hotelInfo && hotelInfo.hotelNo) {
            this.setState({inputValue: hotelInfo.hotelNo.substr(0,7)})
            // this.getCanStoreUnderHouse(hotelInfo.hotelNo)
        }

    }

    //获取该门店项目中可下挂的房源
    getCanStoreUnderHouse = (hotelNo) =>{
        this.setState({loadingSelect: true});
        const {hotelInfo} = this.props;
        pmsService.getCanStoreUnderHouse(hotelNo, hotelInfo.hotelType).then(res=>{
            console.log(res);
            this.setState({
                selectOptions: res,
                loadingSelect: false,
                selectOpen: true
            })
        }).catch(err => {
            message.warning(err);
            this.setState({loadingSelect: false})
        })
    };

    // 新增数据
    handleOk = () =>{
        const {selectedItems} = this.state;
        if(selectedItems && selectedItems.length === 0) {
            // message.warning('没有可下挂房源,已取消');
            // this.props.onCancel();
            return
        }
        pmsService.saveStoreUnderHouse(this.props.hotelNo,{houseSourceIds: selectedItems}).then(res=>{
            message.success('新增成功');
            this.props.onOk();
        }).catch(err => {
            message.warning(err);
        })
    };

    handleChange = (selectedItems) => {
        this.setState({ selectedItems })
    };

    onChangeInput = (e) => {
        this.setState({inputValue: e.target.value})
    };

    handleSearch = () => {
        if(this.state.inputValue !== '') {
            this.getCanStoreUnderHouse(this.state.inputValue)
        }
    };

    render () {
        const _self = this;
        const {selectedItems, selectOptions, loadingSelect,inputValue,selectOpen} = this.state;
        const {visible, onCancel} = this.props;
        return (
            <Modal
                visible={visible}
                title= "新增下挂房源"
                okText="确认"
                cancelText="取消"
                onCancel={onCancel}
                width="560px"
                footer={[
                    <span key="cancel" className="click-link mr-md" onClick={onCancel}>关闭</span>,
                    <Button key="submit" type="primary" onClick={_self.handleOk}>
                        确定
                    </Button>
                ]}
            >
                请输入房源编号
                <div style={{display:'flex', marginBottom: 10}}>
                    <Input style={{width: 125, marginRight: 10}} placeholder="请输入房源编号" value={inputValue} onChange={this.onChangeInput}/>
                    <Button style={{}} type="primary" shape="circle" icon="search" loading={loadingSelect} onClick={this.handleSearch} />
                </div>
                请选择下挂的房源(可多选)
                <Select
                    mode="multiple"
                    allowClear
                    clearIcon={<Icon type="close-circle"/>}
                    value={selectedItems}
                    onChange={_self.handleChange}
                    tokenSeparators={[',']}
                    style={{ width: 400, maxHeight: 150, overflowY:'scroll'}}
                    notFoundContent={'没有可下挂的房源'}
                    loading={loadingSelect}
                    open={selectOpen}
                >
                    {selectOptions !== null && selectOptions.map((item, index) => (
                        <Select.Option key={index} title={item.title} value={item.id}>
                            {item.houseNo + '，' + (item.title && item.title.substr(0,22)) + (item.title && item.title.length > 22 ? '...' : '')}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
        )
    }
}

let AddHouse = Form.create()(AddHouseForm);
export default AddHouse
