import React, { Component } from 'react';
import { AAIHouseManagementService } from '../../services';
import { Button,Icon,message } from 'antd';
const selectUIComSponent = (selected) => <div className = {selected ? 'ui-icon-selected' : 'ui-icon-unselected'}></div>;
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
class HandleFacility extends Component {
    constructor (props) {
        super(props);
        this.state = {
            facilityList:[],
            selectedOptIdList:[],
            selectedSource:0,
            configSource:facilitySwitchConfig
        }
    }
    componentDidMount (){
        this.getConfig();
        this.updateStateInfo();
    }
    // 获取字典；
    getConfig (){
        AAIHouseManagementService.getFacilityDict().then(res=>{
            // console.log(res);
            this.setState({
                facilityList:res
            })
        });
    }
    // 获取状态
    updateStateInfo (){
        const {houseId} = this.props;
        AAIHouseManagementService.getFacilityInfo(houseId).then(res=>{
            // console.log(res.facilities.split(','));
            this.setState({
                selectedOptIdList:res.facilities.split(',')
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
                selectedOptIdList:newSelectedList
            }, ()=>{
                // console.log(self.state.selectedOptIdList.join(','));
                if(self.state.selectedOptIdList.length < 8){
                    message.info('上线airbnb，房源设施不能少于8个');
                }
                AAIHouseManagementService.putFacilityInfo(self.props.houseId,{facilities:self.state.selectedOptIdList.join(',')})
            })
        }
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
                        // console.log(itemArr);
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
        const { nextCb } = this.props;
        return <div style={{marginBottom: 50}}>
            <div>配套设施</div>
            <hr/>
            {/*<div className="flex-box flex-auto border-box ui-padding-12 ui-margin-bottom-16 ui-margin-top-16">{this.renderSource()}</div>*/}
            <div>{this.renderFacility()}</div>
            <div className="tips  text-align-center ">{this.renderTips()}</div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e8e8e8',
                    padding: '10px 16px',
                    textAlign: 'right',
                    left: 0,
                    background: '#fff',
                    borderRadius: '0 0 4px 4px'
                }}
            >
                <Button
                    style={{
                        marginRight: 8
                    }}
                    onClick={this.props.onCloseDrawer}
                >
                    取消
                </Button>
                <Button type="primary" onClick={ nextCb }>
                    保存并下一步
                </Button>
            </div>
        </div>
    }
}
export default HandleFacility
