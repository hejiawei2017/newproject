import Search from '../../components/search'
import React, { PureComponent } from 'react'
import {promotionReportService} from '../../services'

class SearchList extends PureComponent{
    constructor (props){
        super(props);
        this.state = {
            channelList:[{value:'全部',text:'全部'}],
            groupList:[{value:'全部',text:'全部'}],
            deapartList:[{value:'全部',text:'全部'}]
        }
    }
    componentDidMount (){
        this.fetchData()
    }
    fetchData = () =>{
        this.getChannel();
        this.getGroup();
        this.etDeapartment();
    }
    getChannel = () => {
        promotionReportService.getPromotionTable().then((data) => {
            let channelList = [];
            for(let i in data){
                channelList.push(data[i].promotionName)
            }
            const list = [...new Set(channelList)]
            for(let j in list){
                this.state.channelList.push({value: list[j], text:  list[j]})
            }
        });
    }
    getGroup = () =>{
        promotionReportService.getGroup().then((data) => {
            for(let i in data){
                this.state.groupList.push({value:data[i].groupName,text:data[i].groupName})
            }
        })
    }
    etDeapartment = () =>{
        promotionReportService.getDeapartmentTable().then((data)=>{
            for(let i in data){
                this.state.deapartList.push({ value:data[i].departmentName,text:data[i].departmentName})
            }
        })
    }
    onSearch = (searchFields) => {
        this.props.getParams(searchFields)
    }
    render (){
        const searchConfig = {
            items: [...this.props.searchConfig.items,
                {
                    type: 'select',
                    name: '推广部门',
                    key: 'deparmentName',
                    selectData: this.state.deapartList,
                    searchFilterType: 'select',
                    placeholder:'请选择推广部门',
                    defaultValue:'全部'
                },
                {
                    type: 'select',
                    name: '推广分组',
                    key: 'grounpName',
                    selectData: this.state.groupList,
                    searchFilterType: 'select',
                    placeholder:'请选择推广分组',
                    defaultValue:'全部'
                },
                {
                    type: 'select',
                    name: '推广渠道',
                    key: 'channelName',
                    selectData:this.state.channelList,
                    searchFilterType: 'select',
                    placeholder:'请选择推广渠道',
                    defaultValue:'全部'
                }
            ]
        }
        return(
            <Search onSubmit={this.onSearch} config={searchConfig} />
        )
    }

}

export default SearchList