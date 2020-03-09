import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Modal, Form, Input, message, Spin } from 'antd';
import * as API from 'services';
import { houseCheckingService } from '../../services';
import { getOrderDetail } from '../../actions/order';
import './abnormalOrderModal.less';
const Fragment = React.Fragment;
const FormItem = Form.Item;
const Search = Input.Search;

const tailFormItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
    }
};

@connect(state => ({
    currentOrder: state.order.currentOrder,
}))
@Form.create()
export default class ChangeRoomModal extends Component {
    constructor (props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.doOk = this.doOk.bind(this);
    }

    state = {
        bookingId: 0,
        checkinDate: '',
        checkoutDate: '',
        confirmVisible: false,
        changeName: '',
        haveHouse: true,
        searching: false,
        isSearch: false,
        houseSourceId: ''
    };

    handleCompensation = values => {
        console.log(values)
        const params = {
            orderId: values.bookingId,
            houseSourceId: this.state.houseSourceId
        }
        API.orderService.orderEditUpdate(params).then(() => {
            this.showAfterConfirm();
        });
    };

    showAfterConfirm = () => {
        const modal = Modal.success({
            title: '修改房源成功～',
            onOk: () => {
                this.handleCancel(true);
                this.changeHouseId();
                modal.destroy();
            }
        });
    };

    handleCancel = needRequest => {
        const { dispatch, currentOrder } = this.props;

        if (needRequest) {
            dispatch(getOrderDetail(currentOrder.bookingId)).then(() => {
                this.props.toggleChangeRoomModal();
                this.props.form.resetFields();
            });
        } else {
            this.props.toggleChangeRoomModal();
            this.props.form.resetFields();
        }
        this.changeHouseId()
    };

    renderRefundComFromMode = () => {
        return this.renderRefundableCom();
    };

    handleOk = e => {
        e.preventDefault();
        this.doOk();
    };

    doOk () {
        this.setState({ confirmVisible: true });
        const currentOrder = this.props.currentOrder;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(!this.state.isSearch){
                    message.error('如需更换房源，请查询房源是否存在！');
                    this.setState({ confirmVisible: false });
                    return
                }
                values['bookingId'] = currentOrder.bookingId;
                this.setState(
                    {
                        bookingId: values['bookingId']
                    },
                    () => this.handleCompensation(values)
                );
            }
            setTimeout(() => {
                this.setState({ confirmVisible: false });
            }, 2000);
        });
    }
    houseSearch = id => {
        if(id === '') {
            message.error('未填入房源编号！');
            this.changeHouseId()
            return
        }
        this.setState({
            searching: true
        });
        const params = {
            houseNo: id,
            pageNum: 1,
            pageSize: 10,
            houseStatusIn: '5,7,8'
        };
        houseCheckingService
            .getTable(params)
            .then(data => {
                const list = data.list;
                if (list.length === 0) {
                    this.setState({
                        searching: false,
                        haveHouse: false,
                        changeName: '无此房源'
                    });
                    message.error('未查询到此房源');
                } else {
                    this.setState({
                        searching: false,
                        haveHouse: true,
                        isSearch: true,
                        houseSourceId: list[0].houseSourceId,
                        changeName: `${list[0].title}`
                    });
                }
            })
            .catch(e => {
                this.setState({
                    searching: false
                });
                message.error('查询房源失败');
            });
    };
    changeHouseId = () => {
        this.setState({
            changeName: '',
            haveHouse: true,
            searching: false,
            isSearch: false
        });
    };
    renderRefundableCom = () => {
        const { houseNo,orderHouseView } = this.props.currentOrder;
        const { getFieldDecorator } = this.props.form;
        const { searching, changeName, haveHouse } = this.state;
        // 入住前可以修改时间
        /**
         * 订单状态：待入住 入住中 允许客人提前取消订单
         * 订单状态：入住中 允许客人提前离店
         * 其他订单状态不显示
         */
        return (
            <div>
                {
                    <FormItem
                        {...tailFormItemLayout}
                        label="原房源编号："
                    >
                        <p>{houseNo}</p>
                    </FormItem>
                }
                {
                    <FormItem
                        {...tailFormItemLayout}
                        label="原房源标题："
                    >
                        <p>{orderHouseView.title}</p>
                    </FormItem>
                }
                {
                    <FormItem {...tailFormItemLayout} label={'新房源编号：'}>
                        {
                            <Fragment>
                                {getFieldDecorator('houseNoName', {
                                    rules: [{ required: false, message: '新房源编号' }]
                                })(<Search enterButton onSearch={this.houseSearch} onChange={this.changeHouseId} />)}
                            </Fragment>
                        }
                    </FormItem>
                }
                {
                    <FormItem
                        {...tailFormItemLayout}
                        label="新房源标题："
                    >
                        {searching ? (
                            <Spin />
                        ) : (
                          <div className="newTitle">
                            {changeName !== '' &&
                              <p className={!haveHouse ? 'ant-span-red' : ''}>{changeName}</p>
                            }
                          </div>
                        )}
                        <p>注：换房后将根据房源的投资人归属变更钱包入账</p>
                    </FormItem>
                }
            </div>
        );
    };

    render = () => {
        const { visible } = this.props;
        const self = this;
        return (
            <Modal
                width={800}
                title={'变更房源'}
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={this.state.confirmVisible}
                onCancel={function () {
                    self.handleCancel(false);
                }}
            >
                <Form>{this.renderRefundComFromMode()}</Form>
            </Modal>
        );
    };
}
