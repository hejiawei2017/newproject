import React, { Component } from 'react'
import { pmsService } from '../../../services'
import { Button,Icon,message } from 'antd'


const selectUIComSponent = (selected) => <div className = {selected ? 'ui-icon-selected' : 'ui-icon-unselected'}></div>
const facilitySwitchConfig = [
    {
        code:0,
        text:'全部'
    },
    {
        code:1,
        text:'只看路客设施'
    },
    {
        code:2,
        text:'只看airbnb设施'
    },
    {
        code:3,
        text:'只看途家设施'
    },
    {
        code:4,
        text:'只看booking设施'
    }
];
class PmsFacility extends Component {
    constructor (props) {
        super(props);
        this.state = {
            facilityList:[],
            selectedOptIdList:[],
            selectedSource:0,
            saveLoading: false,
            configSource:facilitySwitchConfig
        }
    }
    componentDidMount (){
        this.getConfig();
        this.updateStateInfo();
    }
    // 获取字典；
    getConfig (){
        pmsService.getFacilityDict().then(res=>{
            this.setState({
                facilityList:res
            })
        });
    }
    // 获取状态
    updateStateInfo (){
        const {storeId} = this.props;
        pmsService.getStoreFacility(storeId).then(res=>{
            this.setState({
                selectedOptIdList: res && res || []
            })
        })
    }
    // 处理勾选；
    handleSelected (code,ifSingle,conflictList){
        const self = this;
        return function () {
            const {selectedOptIdList} = self.state;
            let newSelectedList = [];
            if(selectedOptIdList.includes(code)){
                newSelectedList = selectedOptIdList.filter(val=>val !== code)
            }else{
                if(ifSingle){
                    newSelectedList = [code,...selectedOptIdList.filter(val=>!conflictList.includes(val))]
                }else {
                    newSelectedList = [code,...selectedOptIdList]
                }
            }
            self.setState({
                selectedOptIdList: newSelectedList
            })
        }
    }

    handleOk = () =>{
        if(this.state.selectedOptIdList.length < 8){
            message.info('上线airbnb，房源设施不能少于8个');
            return
        }
        this.setState({
            saveLoading: true
        })
        pmsService.saveStoreFacility(this.props.storeId,this.state.selectedOptIdList).then((res) => {
            this.setState({
                saveLoading: false
            })
            message.success('提交成功')
        }).catch(err => {
            this.setState({
                saveLoading: false
            })
        })
    }

    // 设施列表显示
    renderFacility (){
        return this.state.facilityList.map( (li,idx)=>{
            const isSingle = li.facilityItem.every(itemArr=> itemArr.every(item=> item.single));
            return <div className="flex-box flex-column ui-margin-left-8" key={`facility-item-${idx}`}>
                <div>
                    {li.categoryName}
                    {isSingle ? ' (单选)' : null }
                </div>
                <div className={`${isSingle ? 'ui-bg-grey-1 border-box inline-flex-box facility-item flex-column' : ''}`}>
                    {li.facilityItem.map((itemArr)=>{
                        return itemArr.map((item,index)=>{
                            return isSingle ? (
                                    <div
                                        className="flex-box"
                                        key={`f-${li.categoryCode}-${index}`}
                                    >
                                        <div
                                            className="flex-box ui-padding-item cursor-click margin-left-10"
                                            onClick={this.handleSelected(item.code,item.single,itemArr.map(val=>val.code))}
                                        >
                                            {selectUIComSponent(this.state.selectedOptIdList.includes(item.code))}
                                            <span className="ui-margin-left-8">{item.name}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="facility-item inline-flex-box"
                                        key={`f-${li.categoryCode}-${index}`}
                                    >
                                        <div
                                            className="flex-box ui-bg-grey-1 ui-padding-item margin-left-10 cursor-click border-box width-full"
                                            onClick={this.handleSelected(item.code,item.single,itemArr.map(val=>val.code))}
                                        >
                                            {selectUIComSponent(this.state.selectedOptIdList.includes(item.code))}
                                            <span className="ui-margin-left-8">{item.name}</span>
                                        </div>
                                    </div>
                                )
                            })
                        })
                    }
                </div>
            </div>
        })
    }
    selectSource (sourceCode){
        const self = this;
        return function () {
            const {selectedSource} = self.state;
            if(sourceCode !== selectedSource){
                self.setState({
                    selectedSource:sourceCode
                })
            }
        }
    }
    renderSource (){
        const {selectedSource,configSource} = this.state;
        return configSource.map(source=>{
            return <div className="inline-flex-box border-box ui-bg-pink ui-padding-item margin-left-10 cursor-click" onClick={this.selectSource(source.code)} key={`source-code-${source.code}`}>
                    {selectUIComSponent(source.code === selectedSource)}
                    <span className="ui-margin-left-8 text-color-white">{source.text}</span>
            </div>
        })
    }
    renderTips (){
        return <div className="ui-bg-pink inline-flex-box flex-column ui-padding-12">
            <p><Icon type="exclamation-circle" style={{ fontSize: '16px' }} /></p>
            <p>1、上线airbnb，房源设施不能少于8个</p>
            <p>2、上线途家，空调、热水这2项同类型不能重复选择</p>
        </div>
    }
    render (){
        return <div style={{marginBottom: 50,padding:20}}>
            <div style={{fontSize:"16px",fontWeight:600,flex:1}}>配套设施</div>
            <div className="flex-box flex-auto border-box ui-padding-12 ui-margin-bottom-16 ui-margin-top-16">{this.renderSource()}</div>
            <div>{this.renderFacility()}</div>
            <div className="tips text-align-center ">{this.renderTips()}</div>
            <div style={{
                width: '100%',
                // borderTop: '1px solid #e9e9e9',
                padding: '50px 20px 30px',
                display: 'flex',
                background: '#fff'}}
            >
                <div style={{flex:1}}></div>
                <Button onClick={this.handleOk} type="primary" style={{width:110}} loading={this.state.saveLoading ? true : false}>
                    {this.state.saveLoading ? '提交中' : '提交'}
                </Button>
            </div>
        </div>
    }
}
export default PmsFacility
