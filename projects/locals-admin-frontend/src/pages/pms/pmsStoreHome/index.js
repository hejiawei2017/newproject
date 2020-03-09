import React, { Component } from 'react'
import {pmsService} from '../../../services'
import { withRouter } from 'react-router-dom'
import {Collapse} from 'antd'
// import PmsNav from '../components'
import PmsRenderItem from './pmsRenderItem'
const Panel = Collapse.Panel
class PmsStoreHome extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
        // this.storeId = props.match.params.id
        // this.storeName = props.match.params.name
        this.storeId = this.props.hotelId
    }

    componentDidMount () {
        // this.getComment()
    }

    // getComment (){
    //     this.setState({
    //         loading:true
    //     })
    //     let params = {...this.state.searchFields,
    //         pageNum: this.state.pageNum,
    //         pageSize: this.state.pageSize
    //     }
    //     pmsService.getCommentTable(params).then((res) => {
    //         let data = res.list
    //         this.setState({
    //             dataSource: data,
    //             totalCount: Number(res.total) || 0,
    //             loading:false
    //         })
    //     }).catch((e) => {
    //         this.setState({
    //             loading:false
    //         })
    //     })
    // }

    // routerPaths = (e) =>{
    //     console.log("/pms/" + e + this.storeName + "/" + this.storeId)
    //     this.props.history.push({ pathname:"/pms/" + e + "/" + this.storeName + "/" + this.storeId,state: { name:'1222'}})
    // }

    onClickItem = (data) =>{
        console.log(data,'data')
    }
    //主体
    render () {
        const _self = this
        const data = [
            {
              title: 'Ant Design Title 1',
              img:'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/logo.png',
              number:1,
              tem:1,
              nigth:1,
              type:"豪华大床房"
            },
            {
              title: 'Ant Design Title 2',
              img:'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/logo.png',
              number:1,
              tem:1,
              nigth:1,
              type:"豪华大床房"
            },
            {
              title: 'Ant Design Title 3',
              img:'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/logo.png',
              number:1,
              tem:1,
              nigth:1,
              type:"豪华大床房"
            },
            {
              title: 'Ant Design Title 4',
              img:'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/logo.png',
              number:1,
              tem:1,
              nigth:1,
              type:"豪华大床房",
              startTime:'11:00 - 12:00',
              endTime:'14:00 - 14:00',
              needs:'需要接机'
            }
          ];
        const dataSource = [{
            id:1,
            title: "当日预订，当日入住",
            icon: "icon1",
            iconColor: "rgb(104,151,204)",
            list:data
        },
        {
            id:2,
            title: "新的订单",
            icon: "icon2",
            iconColor: "#1F38D8",
            list:data
        },
        {
            id:3,
            title: "离店",
            icon: "icon3",
            iconColor: "#80807F",
            list:data
        },
        {
            id:4,
            title: "抵达",
            icon: "icon4",
            iconColor: "#4378C9",
            list:data
        },
        {
            id:5,
            title: "客人的请求",
            icon: "icon5",
            iconColor: "#9EC787",
            list:data
        },
        {
            id:6,
            title: "评语",
            icon: "icon6",
            iconColor: "#B8963C",
            list:data
        }]

        return (
            <div>
                {/*<PmsNav current={'pmsStoreHome'} routerPath={this.routerPaths} storeTitle={this.storeName} />*/}
                <Collapse className="pmsOrderList" defaultActiveKey={['1']}>
                    {
                        dataSource.map(function (item,index){
                            return(
                                <Panel showArrow={false}
                                       key={item.id}
                                       forceRender
                                       header={
                                             <div>
                                                <img alt="" style={{width:18,height:18,marginRight:5,marginBottom:3}} src={require("../../../images/pms/" + item.icon + ".png")} />
                                                <span style={{fontSize:14,lineHeight:"16px",fontWeight:"400",flex:1}}>{item.title}</span>
                                            </div>
                                        }
                                >
                                    <PmsRenderItem items={item} key={index} onClick={_self.onClickItem}/>
                                </Panel>
                            )
                        })
                    }
                </Collapse>
            </div>
        )
    }
}

export default withRouter(PmsStoreHome)
