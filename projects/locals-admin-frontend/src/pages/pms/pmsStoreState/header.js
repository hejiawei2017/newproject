
import React, {Component} from 'react'
import {Icon,Card} from 'antd'
import moment from 'moment'
const { Meta } = Card


class TableHeader extends React.Component {
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
    render () {
        const {item} = this.state
        return (
            <div>
                <div style={{paddingLeft:10,paddingBottom:10}}>
                    <div style={{fontSize:12,color:'#999999'}}>{moment(2323232323232).format('YYYY-MM')}</div>
                    <div style={{fontSize:12,color:'#666666'}}>{"星期" + "日一二三四五六".charAt(new Date(2323232323232).getDay())}</div>
                    <div style={{fontSize:12,color:'#999999'}}>{moment(2323232323232).format('DD')}</div>
                </div>
                <div style={{fontSize:12,color:'#999999',backgroundColor:'#f5f5f5',height:'40px',display:'flex',justifyContent:'center',alignItems:'center'}}>1/80</div>
            </div>
        )
    }
}
export default TableHeader