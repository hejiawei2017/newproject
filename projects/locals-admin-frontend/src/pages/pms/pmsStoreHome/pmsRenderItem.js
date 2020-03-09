import React, {Component} from 'react'
import { Icon,List, Avatar,Skeleton} from 'antd'

class PmsRenderItem extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            items:this.props.items
        }
    }
    componentWillUpdate (nextProps){
       if(nextProps.items !== this.props.items){
            this.setState({
                items:nextProps.items
            })
       }
    }

    render () {
        let _self = this
        const {items} = this.state
        const data = items.list
        if(data.length > 0){
            return(
                <List itemLayout="horizontal"
                    dataSource={data}
                    renderItem= {function (item) {
                        return (
                            <List.Item onClick={function (){_self.props.onClick(item)}} actions={[<div>{items.id === 5 ? <div style={{height:32}}></div> : null }<Icon type="right"/></div>]}>
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.img} />}
                                        // title={items.id === 5 ? item.title : false}
                                        title={false}
                                        description={
                                            <div>
                                                <div>{item.type}</div>
                                                {
                                                    items.id === 5 ?
                                                        <div>
                                                            <div>入住时间</div>
                                                            <div>退房时间</div>
                                                            <div>特殊要求</div>
                                                        </div>
                                                        :
                                                        null
                                                }
                                            </div>
                                        }
                                    />
                                    <div style={{width:"40%",lineHeight:"32px",addingLeft:"15px",paddingRight:"15px"}}>
                                        {
                                            items.id !== 5 ?
                                                <div>{item.number}间有房 · {item.tem}位客人 · {item.nigth}晚</div>
                                                :
                                                <div>
                                                    <div style={{height:32}}></div>
                                                    <div>{item.startTime} · <span>已确认（免费）</span></div>
                                                    <div>{item.endTime}</div>
                                                    <div>{item.needs}</div>
                                                </div>
                                        }
                                    </div>
                                    <div style={{width:"20%",lineHeight:"32px",paddingLeft:"15px",paddingRight:"15px"}}>
                                        {
                                            items.id === 5 ?
                                                <div><div style={{height:32}}></div>{item.type}</div>
                                                :
                                                <div>{item.type}</div>
                                        }
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )
                    }}
                />
            )
        }else{
            return(
                <div style={{padding:"20px 10px",color:"#999999",fontWeight:500}}>暂无数据</div>
            )
        }
    }
}
export default PmsRenderItem