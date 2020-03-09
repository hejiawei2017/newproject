
import React, {Component} from 'react'
import {Icon,Card,message,Button} from 'antd'
import {pmsService} from "../../../services";
const { Meta } = Card

class PmsStorwHouseItem extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            item:this.props.item
        }
    }
    componentWillUpdate (nextProps){
       if(nextProps.item !== this.props.item){
            this.setState({
                item:nextProps.item
            })
       }
    }

    delItem = () =>{
        let arr = []
        const _this = this
        arr.push(_this.props.item.id)
        const parms = {houseSourceIds : arr}
        pmsService.delStoreUnderHouse(_this.props.hotelId,JSON.stringify(parms)).then(res=>{
            this.props.delItem(this.props.item.id)
            message.success('删除成功！')
        }).catch(err => {})
    }
    render () {
        const {item} = this.state
        return (
            <Card
                hoverable
                style={{ width:218,marginRight:15,marginBottom:15,position: "relative",borderRadius: 4}}
                cover={
                    <div className="pms-houseItem">
                        <div style={{height:120}}>
                            <img alt="NO ImgPath" style={{width:216,height:120}} src={item.imgPath} />
                        </div>
                        <div className="pms-houseItemFlex">
                            <div className="pms-houseItemFlex-title">{item.title}</div>
                            <div className="pms-houseItemFlex-no">{item.houseNo}</div>
                        </div>
                    </div>
                }
            >
                <Meta
                    style={{padding:5}}
                    title={"标准入住人数：" + item.tenantNumber + " 位成人"}
                    description={"该类型数量：" + item.stock}
                />
                <div style={{paddingTop:10,paddingLeft:5}}><Button type="dashed" size="small" onClick={this.delItem}>删除</Button></div>
            </Card>
        )
    }
}
export default PmsStorwHouseItem
