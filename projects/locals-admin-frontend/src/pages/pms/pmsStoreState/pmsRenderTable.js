import React, {Component} from 'react'
import { Form, InputNumber, Button, Spin, message, Popover, Row, Col} from 'antd'
import moment from 'moment'
import pmsService from "../../../services/pms-service";
import EditModal from './editModal'

const tableStyle = {
    height:44,
    alignItems:'center',
    borderBottom:'1px solid #f1f1f1',
    borderRight:'1px solid #f1f1f1'
};
const tableLeftStyle = {
    ...tableStyle,
    display:'flex',
    paddingLeft:20,
    justifyContent:'flex-start'
};
const tableRightStyle = {
    ...tableStyle,
    width:80,
    display:'flex',
    justifyContent:'center',
    position:"relative"
};

class PmsRenderTableForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            // items:this.props.items,
            // houseCalendarLists:this.props.items.houseCalendarList,
            // activeLists:this.props.items.activeLists,
            vision:[],
            dataSource: this.props.dataSource,
            editHouseData: this.props.editHouseData,
            _disable: [],
            stockSum: [],
            stockSum2: [],
            occupationsSum: [],
            initActive: false,
            scrollBegin: false,
            loading: false
            // height: 247 + 50 * this.props.items.activeLists.length
        };
    }
    componentDidMount () {
        let stockSum = [], disable = [], occupationsSum = [];
        this.props.dataSource.map((item1, index1) => {
            item1.calendars && item1.calendars.map((item2, index2) => {
                stockSum[index2] = (stockSum[index2] ? stockSum[index2] : 0) + item2.primitiveStock;
                return occupationsSum[index2] = (occupationsSum[index2] ? occupationsSum[index2] : 0) + (item2.occupations ? item2.occupations.length : 0)
            });
            return disable[index1] = false;
        });
        this.setState({
            _disable: disable,
            stockSum: stockSum,
            occupationsSum: occupationsSum,
            stockSum2: JSON.parse(JSON.stringify(stockSum))
        })
        setTimeout(() => {
            this.setState({
                headWidth: this.scrollBodyRef.clientWidth,
                leftHeight: this.scrollBodyRef.clientHeight
            })
        },200)
        window.onresize = () => {
            if(this.scrollBodyRef){
                this.setState({
                    headWidth: this.scrollBodyRef.clientWidth,
                    leftHeight: this.scrollBodyRef.clientHeight
                })
            }
        }
    }
    componentWillUpdate (nextProps){
        if(JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.dataSource)) {
            let stockSum = [], disable = [], occupationsSum = [];
            nextProps.dataSource.map((item1, index1) => {
                item1.calendars && item1.calendars.map((item2, index2) => {
                    stockSum[index2] = (stockSum[index2] ? stockSum[index2] : 0) + item2.primitiveStock;
                    return occupationsSum[index2] = (occupationsSum[index2] ? occupationsSum[index2] : 0) + (item2.occupations ? item2.occupations.length : 0)
                });
                return disable[index1] = false;
            });
            this.setState({
                dataSource: nextProps.dataSource,
                editHouseData: nextProps.editHouseData,
                _disable: disable,
                stockSum: stockSum,
                occupationsSum: occupationsSum,
                stockSum2: JSON.parse(JSON.stringify(stockSum))

            })
        }
    }

    initStyle = (startRadius,endRadius,color) =>{
        let style;
        let posiLeft = 0;
        let posiWidth = 72;
        let posiRight = 4;
        if(startRadius && !endRadius){
            posiLeft = 4;
            posiWidth = 76;
            posiRight = 0
        }else if(!startRadius && !endRadius){
            posiLeft = 0;
            posiWidth = 82;
            posiRight = 0
        }else if(startRadius && endRadius){
            posiLeft = 4;
            posiWidth = 72;
            posiRight = 4
        }

        style = {
            backgroundColor:color ,
            position:'absolute',
            borderTop:'1px solid #f1f1f1',
            top:10,
            left:posiLeft,
            right:posiRight,
            width:posiWidth,
            height:24,
            borderTopLeftRadius: startRadius ? 12 : 0,
            borderBottomLeftRadius: startRadius ? 12 : 0,
            borderTopRightRadius: endRadius ? 12 : 0,
            borderBottomRightRadius: endRadius ? 12 : 0
        };
        return style
    };

    initHeader = (data) => {
        const {stockSum, occupationsSum} = this.state;
        return (
            <div style={{whiteSpace: 'nowrap'}}>
                {data.map((item, index) => {
                    return(
                        <div key={index} style={{width: 80,display:'inline-block'}}>
                            <div style={{borderBottom:'1px solid #f1f1f1',borderTop:'1px solid #f1f1f1', alignItems: 'center', paddingLeft: 10, borderRight: this.getYearBorderRight(item.date, index, data) ? '1px solid #f1f1f1' : ''}}>
                                <div style={{fontSize:12,color:'#999',height:25, lineHeight: '25px'}}>{this.getHeaderYear(item.date, index, data)}</div>
                            </div>
                            <div style={{paddingLeft:10, height: 48, paddingTop: 6,borderRight:'1px solid #f1f1f1'}}>
                                <div style={{fontSize:12,color:'#666'}}>{"星期" + "日一二三四五六".charAt(new Date(item.date).getDay())}</div>
                                <div style={{fontSize:12,color:'#999'}}>
                                    {moment(item.date).format('DD')}
                                    {
                                        new Date(item.date).getDay() === 6 || new Date(item.date).getDay() === 0 ?
                                            <span style={{color:'red',fontSize:12,marginLeft:5}}>休</span>
                                            : null
                                    }
                                </div>
                            </div>
                            <div style={{fontSize:12,color:'#999',height:25, paddingLeft:10, lineHeight: '25px',borderTop:'1px solid #f1f1f1', borderRight:'1px solid #f1f1f1'}}>{occupationsSum[index]} / {stockSum[index]}</div>
                        </div>
                    )
                })}

            </div>
        )
    };

    initInput = (item,index,_i) =>{
        let that = this;
        return (
            <InputNumber
                style={{width:55,textAlgin:'center'}}
                size="small"
                disabled={!this.state._disable[_i] || !item.isOpen}
                min={1}
                max={10000}
                // defaultValue={item.sellCounts}
                value={item.primitiveStock}
                onChange={ function (value) {
                    that.onChangeInput(value,index,_i)
                }}
            />
        )
    };

    onChangeInput = (value,index,_i) =>{
        const {dataSource, stockSum} = this.state;
        stockSum[index] = stockSum[index] + (value - dataSource[_i].calendars[index].primitiveStock);
        dataSource[_i].calendars[index].primitiveStock = value;
        this.setState({dataSource: dataSource})
    };

    initSellBgColor = (initItem,index,data) =>{
        let startRadius = true, occupations = 0, BgColor;
        if(index === 0){
            startRadius = true
        }else if(
            (initItem.primitiveStock > 0 && data[index - 1].primitiveStock > 0)
            ||
            initItem.primitiveStock < -1 && data[index - 1].primitiveStock < -1
        ){
            startRadius = false
        }

        let endRadius = true;
        if(index === data.length - 1 || data[index + 1] === undefined){
            endRadius = true
        }else if(
            (initItem.primitiveStock > 0 && data[index + 1].primitiveStock > 0)
            ||
            initItem.primitiveStock <= 0 && data[index + 1].primitiveStock <= 0
        ){
            endRadius = false
        }
        if(initItem.occupations !== null) {
            occupations = initItem.occupations.length
        }
        if(initItem.primitiveStock < occupations || initItem.primitiveStock === occupations) {
            BgColor = '#e84358'
        }else {
            BgColor = '#8ec073'
        }
        if(initItem.isOpen === false) {
            BgColor = '#e84358'
        }
        let style = this.initStyle(startRadius,endRadius, BgColor );
        return <div style={style}/>
    };

    getHeaderYear = (date, index, data) => {
        if (index === 0) {
            return (moment(date).format("YYYY-MM"))
        } else if (moment(data[index - 1].date).format("YYYY-MM") !== moment(date).format("YYYY-MM")) {
            return (moment(date).format("YYYY-MM"))
        }
    };

    getYearBorderRight = (date, index, data) => {
        let endBorder = false;
        if (data.length === index + 1) {
            return endBorder = true
        }
        if (moment(data[index + 1].date).format("YYYY-MM") !== moment(date).format("YYYY-MM")) {
            endBorder = true
        }
        return endBorder
    };

    initRightTable = (data, _i) =>{
        return (
            <div style={{whiteSpace: 'nowrap'}}>
                {data && data.map((item,index) => {
                    return (
                        <div key={index} style={{width:80, borderTop:'1px solid #f1f1f1',display: 'inline-block'}}>
                            <div style={tableRightStyle}>
                                {this.initSellBgColor(item,index,data)}
                            </div>
                            <div style={tableRightStyle}>
                                {this.initInput(item,index,_i)}
                            </div>
                            <div style={tableRightStyle}>
                                {item.occupations ? item.occupations.length : 0}
                            </div>
                            <div style={tableRightStyle}>
                                {item.price}
                            </div>
                            {/*{this.initActive(index,item)}*/}
                        </div>
                    )
                })}
            </div>

        )
    };

    editHouseSellCounts = (item, _i) => {
        this.setState({
            visible: true,
            editType: 'stock',
            currentItem: item
        })
    }
    editPrice = (item, _i) => {
        this.setState({
            visible: true,
            editType: 'price',
            currentItem: item
        })
    }
    cancelSellCounts = (_i) => {
        const {editHouseData, stockSum2, _disable} = this.state;
        _disable[_i] = !this.state._disable[_i];
        this.setState({
            dataSource: JSON.parse(JSON.stringify(editHouseData)),
            stockSum: JSON.parse(JSON.stringify(stockSum2))
        });
    };
    handleBodyScroll = (e) => {
        this.scrollLeftRef.scrollTop = e.target.scrollTop;
        this.scrollHeadRef.scrollLeft = e.target.scrollLeft;
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    onSubmit = (val) => {
        const {currentItem, editHouseData, dataSource, stockSum, stockSum2} = this.state
        this.setState({
            loading: true
        })
        const {hotelId} = this.props
        let start = val.dateRange[0].valueOf()
        let end = val.dateRange[1].valueOf()
        let days = (end - start) / 3600 / 24000 + 1
        let editHouseItem = []
        for (let i = 0; i < days; i++){
            editHouseItem = editHouseItem.concat({
                date: moment(start + i * 3600 * 24000).format("YYYY-MM-DD"),
                primitiveStock: val.primitiveStock
            })
        }
        currentItem.calendars.map((item, index) => {
                if((item.occupations ? item.occupations.length : 0) > item.primitiveStock) {
                   return message.error('可售房量只能>=订单数');
                }
                if(item.date >= start && item.date <= end){
                    item.primitiveStock = val.primitiveStock
                }
            return index
        });
        let params = {
            houseSourceId: currentItem.houseSourceId,
            hotelId: hotelId,
            calendars: editHouseItem
        };
        pmsService.putPmsStock(params).then((res) => {
            this.setState({
                loading: false,
                visible: false,
                editHouseData: JSON.parse(JSON.stringify(dataSource)),
                stockSum2: JSON.parse(JSON.stringify(stockSum))
            })
        }).catch((e) => {
            console.log(e);
            this.setState({
                loading: false,
                visible: false,
                dataSource: JSON.parse(JSON.stringify(editHouseData)),
                stockSum: JSON.parse(JSON.stringify(stockSum2))
            });
            message.error('访问出错');
        })
    }
    onSubmitPrice = (val) => {
        const {currentItem, editHouseData, dataSource, stockSum, stockSum2} = this.state
        this.setState({
            loading: true
        })
        let start = val.dateRange[0].valueOf()
        let end = val.dateRange[1].valueOf()
        let days = (end - start) / 3600 / 24000 + 1
        let editHouseItem = []
        for (let i = 0; i < days; i++){
            editHouseItem.push(moment(start + i * 3600 * 24000).format("YYYY-MM-DD"))
        }
        currentItem.calendars.map((item, index) => {
            if((item.occupations ? item.occupations.length : 0) > item.primitiveStock) {
                return message.error('可售房量只能>=订单数');
            }
            if(item.date >= start && item.date <= end){
                item.price = val.price
            }
            return index
        });
        let params = {
            houseSourceId: currentItem.houseSourceId,
            price: val.price,
            dates: editHouseItem
        };
        pmsService.putPmsPrice(params).then((res) => {
            this.setState({
                loading: false,
                visible: false,
                editHouseData: JSON.parse(JSON.stringify(dataSource)),
                stockSum2: JSON.parse(JSON.stringify(stockSum))
            })
        }).catch((e) => {
            console.log(e);
            this.setState({
                loading: false,
                visible: false,
                dataSource: JSON.parse(JSON.stringify(editHouseData)),
                stockSum: JSON.parse(JSON.stringify(stockSum2))
            });
            message.error('访问出错');
        })
    }
    render () {
        const {dataSource, _disable, loading, currentItem , visible, editType} = this.state;
        const { dateStartDefault, dateEndDefault } = this.props
        let that = this;
        return(
            <div className={'container'} style={{width:"100%" ,borderRadius:4, height: '100%', paddingBottom: 50}}>
                {loading && <div className={'spinStyle'}>
                    <Spin />
                </div>}
                <Row>
                    <Col span={4}>
                        <div style={{backgroundColor:'#ffffff', border:'1px solid #f1f1f1'}}>
                            <div className={'titleHouse'} style={{lineHeight: '99px',fontSize:20,paddingLeft:20,borderRight:'1px solid #f1f1f1'}}> {'总房量'}</div>
                        </div>
                    </Col>
                    <Col span={20} style={{overflow:'hidden'}}>
                        <div className="scroll-top" style={{width:that.state.headWidth}} ref={function (c) {that.scrollHeadRef = c}}>
                            {this.initHeader(dataSource[0].calendars)}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={4} style={{overflow:'hidden'}}>
                        <div className="scroll-left" style={{height:that.state.leftHeight}} ref={function (c) {that.scrollLeftRef = c}}>
                            {dataSource.map((item, _i) => {
                                return(
                                    <div key={_i} style={{backgroundColor:'#ffffff',borderTop:'1px solid #f1f1f1',borderLeft:'1px solid #f1f1f1', marginBottom: 5}}>
                                        <Popover placement="topLeft" arrowPointAtCenter content={<p>{item.title && item.title}</p>}>
                                            <div style={tableLeftStyle}> {item.houseNo }{item.title && item.title.substr(0,7) + '...'}</div>
                                        </Popover>
                                        <div style={tableLeftStyle}>
                                            可售房量 <Button type="primary" size="small" className={'ml10'} onClick={function () {that.editHouseSellCounts(item,_i)}}>{_disable[_i] ? '完成' : '编辑'}</Button>
                                            {_disable[_i] && <Button type="primary" size="small" className={'ml10'} onClick={function () {that.cancelSellCounts(_i)}}>{'取消'}</Button>}
                                        </div>
                                        <div style={tableLeftStyle}>有效预定间夜数</div>
                                        <div style={tableLeftStyle}>价格
                                            <Button type="primary" size="small" className={'ml10'} onClick={function () {that.editPrice(item,_i)}}>编辑</Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Col>
                    <Col span={20}>
                        <div className="scroll-body" ref={function (c) {that.scrollBodyRef = c}} onScrollCapture={function (e){ that.handleBodyScroll(e)}}>
                            {dataSource.map((item, _i) => {
                                return(
                                    <div key={_i} >
                                        <div style={{marginBottom: 5}}>
                                            {this.initRightTable(item.calendars, _i)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Col>
                </Row>
                {
                    currentItem &&
                    <EditModal currentItem={currentItem} visible={visible} confirmLoading={loading} type={editType} dateStartDefault={dateStartDefault} dateEndDefault={dateEndDefault} handleCancel={that.handleCancel} onSubmit={that.onSubmit} onSubmitPrice={that.onSubmitPrice}/>
                }
            </div>
        )
    }
}
let PmsRenderTable = Form.create()(PmsRenderTableForm);
export default PmsRenderTable
