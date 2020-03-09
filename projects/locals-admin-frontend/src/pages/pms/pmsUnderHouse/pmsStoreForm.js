import React, {Component} from 'react'
import {Form,Radio,Divider} from 'antd'
const RadioGroup = Radio.Group;

class PmsStoreFormForm extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            forms: this.props.forms
        }
    }
    componentWillUpdate (nextProps){
       if(nextProps.forms !== this.props.forms){
            this.setState({
                forms: nextProps.forms
            })
       }
    }
    render () {
        const {forms} = this.state
        let positions = forms.longitude + ' , ' + forms.latitude
        const data = [{
            label:'门店名称',
            codetag:'hotelName',
            value: forms.hotelName
        },{
            label:'En',
            value: forms.hotelEnName
        },{
            label:'门店地址',
            value: forms.address
        },{
            label:'En',
            value: forms.enAddress
        },
        {
            label:'门店位置',
            remarks:"（中国查高德，中国以外查Coogle）",
            value: positions
        },
        {
            label:'门店类型',
            radios: [
                { label: '酒店', value: 1 },
                { label: '公寓', value: 2 },
                { label: '客栈', value: 3 },
                { label: '民宿', value: 4 }
            ],
            value: forms.hotelType
        },
        {
            label:'项目编码',
            value: forms.hotelNo
        }]
        return (
            <div style={{padding: "20px"}}>
                <div className="padder-vb-md" style={{fontSize:"16px",fontWeight:600}}>门店信息</div>
                {
                    data.map((item,index) => {
                        return(
                            <div key={index}>
                                <div style={{display:"flex",alginItms:'center'}}>
                                    <div style={{width:96,lineHeight:'21px'}}>
                                        {item.label}
                                    </div>
                                    {
                                        item.radios ?
                                            <div>
                                                <RadioGroup disabled options={item.radios} value={item.value} />
                                            </div>
                                            :
                                            <div style={{lineHeight:'21px'}}>
                                                {item.value}
                                            </div>
                                    }
                                    <div style={{flex:1,paddingLeft:20,color:"#666666",fontSize:13,fontWeight:400,lineHeight:'21px'}}>
                                        {item.remarks && item.remarks}
                                    </div>
                                </div>
                                <Divider style={{margin: '12px 0'}}/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
let PmsStoreForm = Form.create()(PmsStoreFormForm)
export default PmsStoreForm
