import React, {Component} from 'react'
import {pmsService} from '../../../services'
import {withRouter} from 'react-router-dom'
import {Collapse, Table, DatePicker, Spin, Row, Menu, Dropdown, Button, message} from 'antd'
import moment from 'moment'
import PmsRenderTable from './pmsRenderTable'
import './index.less'

class PmsStoreState extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchFields: {
                houseSourceIds: props.houseIds,
                startDate: '',
                endDate: '',
                isShowEmptyHouse: false
            },
            menuTitle: '所有房客',
            menuData: [
                // {value: '所有房客'},
                // {value: '大床房'},
                // {value: '标准房'}
            ],
            dateStartValue:moment(new Date()).format("YYYY-MM-DD"),
            dateEndValue: moment(new Date()).add(30,'day').format('YYYY-MM-DD'),
            dataSource: [],
            // editHouseData: [],
            loading: false
        };
        // this.hotelId = props.match.params.id;
        // this.storeName = props.match.params.name
        this.hotelId = this.props.hotelId
    }

    componentDidMount () {
        setTimeout(() =>{
            this.getComment()
        },1000)
    }

    componentWillUnmount () {
    }

    getComment = () => {
        const {dateStartValue, dateEndValue, loading} = this.state;
        if(loading) {
            return
        }
        this.setState({loading: true});
        let params = {
            // hotelId: '1090821151458717698',
            hotelId: this.hotelId,
            beginDate: dateStartValue,
            endDate: dateEndValue
        };
        pmsService.getStoreStateTable(params).then((res) => {
            if (res) {
                this.setState({
                    dataSource: res.houseSources,
                    // editHouseData: JSON.parse(JSON.stringify(res.calendars)),
                    loading: false
                })
            } else {
                this.setState({loading: false});
                message.error('访问出错');
            }
        }).catch((e) => {
            console.log(e);
            this.setState({loading: false});
            message.error('访问出错');
        })
    };

    routerPaths = (e) => {
        // console.log("/pms/" + e + this.storeName + "/" + this.storeId)
        this.props.history.push({
            pathname: "/pms/" + e + "/" + this.storeName + "/" + this.hotelId
            // state: {name: '1222'}
        })
    };

    renderMenu = () => {
        const {menuData} = this.state;
        let that = this;
        return (
            <Menu>
                {menuData.map((item, index) => {
                    return (
                        <Menu.Item key={index}>
                            <a onClick={function () {that.setState({menuTitle: item.value})}}>{item.value}</a>
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
    };

    datePickerStartOnChang = (date, dateString) => {
        this.setState({dateStartValue: dateString})
    };

    datePickerEndOnChang = (date, dateString) => {
        this.setState({dateEndValue: dateString})
    };

    //主体
    render () {
        const {dataSource, menuTitle, dateStartValue, dateEndValue, loading} = this.state;
        return (
            <div className="pmsStoreState">
                <Row>
                    {/*<Dropdown overlay={this.renderMenu()} placement="bottomCenter">*/}
                        {/*<Button style={{width: 100}}>{menuTitle}</Button>*/}
                    {/*</Dropdown>*/}
                    {/*<br/>*/}
                    <div>
                        <DatePicker defaultValue={moment(dateStartValue, 'YYYY-MM-DD')} onChange={this.datePickerStartOnChang}/>{' 至 '}
                        <DatePicker defaultValue={moment(dateEndValue, 'YYYY-MM-DD')} onChange={this.datePickerEndOnChang}/>
                        <Button className="ml10" onClick={this.getComment} type="primary" icon="search" htmlType="submit" />
                    </div>
                </Row>
                <div style={{display: 'flex', padding: '10px 0'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{background: '#8ec073', width: 12, height: 12, marginRight: 5}}/>
                        <span style={{fontSize: 12}}>可预定</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                        <div style={{background: '#e84358', width: 12, height: 12, marginRight: 5}}/>
                        <span style={{fontSize: 12}}>已关闭</span>
                    </div>
                    <div style={{flex: 1}}/>
                </div>
                <div>
                    {loading && <div className={'spinStyle'}>
                        <Spin/>
                    </div>}
                    {dataSource !== null && dataSource.length !== 0 && <PmsRenderTable hotelId={this.hotelId} editHouseData={JSON.parse(JSON.stringify(dataSource))} dataSource={dataSource} dateStartDefault={dateStartValue} dateEndDefault={dateEndValue}/>}
                    {dataSource === null && <div className={'spinStyle'}>暂无数据</div>}
                </div>
            </div>
        )
    }
}

export default withRouter(PmsStoreState)
