import React, { Component } from 'react';
import moment from 'moment';
import { AAIHouseManagementService } from '../../services';
import { Row, Col,Form,Button,Icon,DatePicker,InputNumber,message } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const selectUIComSponent = (selected) => <div className = {selected ? 'ui-icon-selected' : 'ui-icon-unselected'}></div>;
function disabledDate (current) {
    // Can not select days before today
    return current && current < moment().startOf('day');
}
const config = [{
    apiKey:'acceptAge',
    apiValue:1,
    text:'儿童',
    listId:'child'
},{
    apiKey:'acceptAge',
    apiValue:2,
    text:'老人',
    listId:'elder'
},{
    apiKey:'acceptAge',
    apiValue:3,
    text:'外宾',
    listId:'foreigner'
},{
    apiKey:'acceptSex',
    apiValue:1,
    text:'男性',
    listId:'man'
},{
    apiKey:'acceptSex',
    apiValue:2,
    text:'女性',
    listId:'woman'
}];
class HandleBooking extends Component {
    constructor (props) {
        super(props);
        this.state = {
            airbnbBookingSetting: {},
            tujiaBookingSetting: {},
            stayProductList: [
                // {
                //     listId: +new Date() // 手动添加数据id
                // }
            ],
            dirty:false,
            productMaximum: 10,
            tujiaOpts:config,
            selectedOpts:[],
            isRepeat:false
        }
    }
    componentDidMount (){
       this.updateInfo();
    }
    updateInfo (){
        const {houseId} = this.props;
        const {tujiaOpts} = this.state;
        AAIHouseManagementService.getBookingSetting(houseId).then(res=>{
            console.log('getBookingSetting',res);
            if(res){
                this.setState({
                    airbnbBookingSetting: res.airbnbBookingSetting,
                    tujiaBookingSetting: res.tujiaBookingSetting,
                    stayProductList:res.tujiaBookingSetting.stayProductList.map((val,index)=>{
                        val.listId = +new Date() + index;
                        return val
                    }),
                    selectedOpts: [...res.tujiaBookingSetting.acceptAge.split(',').map(apiValue=>{
                        const item = tujiaOpts.find(opt=>(opt.apiKey === 'acceptAge' && +opt.apiValue === +apiValue));
                        return item && item.listId
                    }),
                        ...res.tujiaBookingSetting.acceptSex.split(',').map(apiValue=>{
                            const item = tujiaOpts.find(opt=>(opt.apiKey === 'acceptSex' && +opt.apiValue === +apiValue))
                            return item && item.listId
                        })
                    ]
                })
            }
        })
    }
    addProduct (){
        const self = this;
        const {productMaximum} = this.state;
        return function () {
            const {stayProductList} = self.state;
            if(stayProductList.length < productMaximum){
                self.setState({
                    stayProductList:[...stayProductList,{listId: +new Date()}]
                })
            }
        }
    }
    removeProduct (pid){
        const self = this;
        return function () {
            console.log(pid);
            const {stayProductList} = self.state;
            const newList = stayProductList.filter(val=>val.listId !== pid);
            self.setState({
                stayProductList: newList
            })
        }
    }
    timeRangeChange (field){
        const self = this;
        return function (dates,timeString) {
            const {stayProductList} = self.state;
            const newList = stayProductList.map(val=>{
                if(+val.listId === +field){
                    val.bookingDateRangeStartDate = timeString[0];
                    val.bookingDateRangeEndDate = timeString[1];
                }
                return val
            });
            self.setState({
                stayProductList: newList
            })
        }
    }
    renderProductList (){
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        };
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const { stayProductList} = this.state;
        return stayProductList.map(product=>(
            <div className="flex-box flex-align-center" key={`product-list-${product.listId}`}>
                <span className="ui-padding-12 ui-margin-bottom-16 no-wrap">最少住 </span>
                <span>
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator(`stayDays-${product.listId}`, {
                        rules: [{
                            required: true, message: '请输入最少住天数'
                        }],
                        initialValue: product.stayDays
                    })(
                        <InputNumber
                            min={1}
                            // max={30}
                            precision={0}
                        />
                    )}
                </FormItem>
            </span>
                <span className="ui-padding-12 ui-margin-bottom-16 no-wrap">天（晚），即可享房费+清洁费的</span>
                <span>
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator(`discountRatio-${product.listId}`, {
                        rules: [{
                            required: true, message: '请输入折扣'
                        }],
                        initialValue: product.discountRatio
                    })(
                        <InputNumber
                            min={70}
                            max={100}
                        />
                    )}
                </FormItem>
            </span>
                <span className="ui-padding-12 ui-margin-bottom-16 no-wrap">%折扣；适用时间</span>
                <span>
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator(`time-${product.listId}`, {
                        rules: [{
                            required: true, message: '请输入时间段'
                        }],
                        initialValue:[moment(product.bookingDateRangeStartDate),moment(product.bookingDateRangeEndDate)]
                    })(
                        <RangePicker
                            disabledDate={disabledDate}
                            onChange={this.timeRangeChange(`${product.listId}`)}
                        />
                    )}
                </FormItem>
            </span>
                <span className="ui-padding-12 ui-margin-bottom-16">
                    <Button onClick={this.removeProduct(product.listId)}><Icon type="delete" /></Button>
                </span>
            </div>
        ))
    }
    selectOpt (listId){
        const self = this;
        return function () {
            const {selectedOpts} = self.state;
            if(selectedOpts.some(val=>val === listId)){
                self.setState({
                    selectedOpts:selectedOpts.filter(val=>val !== listId)
                })
            }else {
                self.setState({
                    selectedOpts:selectedOpts.concat(listId)
                })
            }
        }
    }
    renderTujiaOpts (key,span = 12){
        const {tujiaOpts,selectedOpts} = this.state;
        return tujiaOpts.map(opt=>opt.apiKey === key && (
            <Col key={`tujia-opt-${opt.listId}`} span={span}>
                <div
                    onClick={this.selectOpt(opt.listId)}
                    className="border-box ui-bg-grey-1 flex-box ui-padding-item margin-left-10 cursor-click ui-margin-bottom-16"
                >
                    {selectUIComSponent(selectedOpts.some(val=>val === opt.listId))}
                    <span className="ui-margin-left-8">{opt.text}</span>
                </div>
            </Col>
        ))
    }
    renderTips (){
        return <div className="ui-bg-pink inline-flex-box flex-column ui-padding-12">
            <p><Icon type="exclamation-circle" style={{ fontSize: '16px' }} /></p>
            <p>途家规定</p>
            <p>【儿童】和【老人】必须2选1，或全选</p>
            <p>【男性】和【女性】同上</p>
        </div>
    }
    serialPostData (){
        const {form} = this.props;
        const {stayProductList,selectedOpts,tujiaOpts} = this.state;
        const res = {};
        res.tujiaBookingSetting = {
            minRequiredDays: form.getFieldValue('minRequiredDays'),
            acceptAge:tujiaOpts.filter(opt=>(opt.apiKey === 'acceptAge') && selectedOpts.includes(opt.listId)).map(opt=>opt.apiValue).join(','),
            acceptSex:tujiaOpts.filter(opt=>(opt.apiKey === 'acceptSex') && selectedOpts.includes(opt.listId)).map(opt=>opt.apiValue).join(','),
            stayProductList: stayProductList.map(val=>{
                console.log(val);
                const res = Object.assign({},val);
                res.stayDays = form.getFieldValue(`stayDays-${val.listId}`);
                res.discountRatio = form.getFieldValue(`discountRatio-${val.listId}`);
                delete res.listId;
                return res;
            }).filter(val=>{
                let validate = true;
                for(let i in val){
                    if(!val[i]){
                        validate = false;
                    }
                }
                return validate
            })
        };
        res.airbnbBookingSetting = {
            defaultMinNights: form.getFieldValue('defaultMinNights'),
            defaultWeekendMinNights: form.getFieldValue('defaultWeekendMinNights'),
            monthlyPriceFactor: form.getFieldValue('monthlyPriceFactor'),
            weeklyPriceFactor: form.getFieldValue('weeklyPriceFactor')
        };
        return res;
    }
    async updateSettingInfo (houseId,info){
            await AAIHouseManagementService.putBookingSetting(houseId,info);
    }
    injectNextCb (){
        const self = this;
        return async function () {
            const {nextCb,houseId} = self.props;
            const postData = self.serialPostData();
            console.log(postData);
            const valid = self.checkDataValidate(postData);
            if(valid.isValid){
                self.setState({isRepeat:true});
                await self.updateSettingInfo(houseId,postData);
                self.setState({isRepeat:false});
                message.success('更新成功');
                nextCb()
            }else {
                message.error(valid.errmsg.join(','))
            }
        }
    }
    checkDataValidate (data){
        // data is post data;
        const res = {
            isValid: true,
            errmsg: []
        };
        if(!data.tujiaBookingSetting.acceptAge.split(',').some(val=>['1','2'].includes(val))){
            res.isValid = false;
            res.errmsg.push('老人，儿童必须至少选一个')
        }
        if(!data.tujiaBookingSetting.acceptSex.split(',').some(val=>['1','2'].includes(val))){
            res.isValid = false;
            res.errmsg.push('男性，女性必须至少选一个')
        }
        return res;
    }
    renderTujia (){
        const {form} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        };
        const { getFieldDecorator } = form;
        const {stayProductList,productMaximum,tujiaBookingSetting} = this.state;
        return <div>
            {/*<Row><b>【途家】预定设置</b></Row>*/}
            {/*<Row>最少入住天（房晚）数</Row>*/}
            {/*<Row type="flex" align="middle">*/}
                {/*<Col span={4}>*/}
                    {/*<FormItem*/}
                        {/*{...formItemLayout}*/}
                    {/*>*/}
                        {/*{getFieldDecorator('minRequiredDays', {*/}
                            {/*rules: [{*/}
                                {/*required: true, message: '请输入最少入住天数'*/}
                            {/*}],*/}
                            {/*initialValue: isNaN(+tujiaBookingSetting.minRequiredDays) ? null : (+tujiaBookingSetting.minRequiredDays || null)*/}
                        {/*})(*/}
                            {/*<InputNumber*/}
                                {/*min={1}*/}
                                {/*max={30}*/}
                                {/*precision={0}*/}
                            {/*/>*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                {/*</Col>*/}
                {/*<Col span={2}>*/}
                    {/*<div className="ui-margin-bottom-16 ui-padding-12">房晚</div>*/}
                {/*</Col>*/}
            {/*</Row>*/}
            {/*<Row>连住优惠</Row>*/}
            {/*<Row><em>*优惠折扣框，可填70~100的整数值，最低只能设置70%（7折）优惠；*例70%即指可享受房费+清洁费的7折优惠。</em></Row>*/}
            {/*<Row>{this.renderProductList()}</Row>*/}
            {/*<Row>*/}
                {/*<Button onClick={this.addProduct()}>*/}
                    {/*{stayProductList.length ?*/}
                        {/*stayProductList.length < productMaximum ?*/}
                            {/*<span><Icon type="plus" />继续添加</span> :*/}
                            {/*<span>最多{productMaximum}个，无法继续添加</span> :*/}
                        {/*<span><Icon type="plus" />添加</span>}*/}
                {/*</Button>*/}
            {/*</Row>*/}
            <Row>选择可接待房客类型</Row>
            <Row><em>*【儿童】和【老人】必须选择1项</em></Row>
            <Row gutter={16}>{this.renderTujiaOpts('acceptAge',5)}</Row>
            <Row>选择可接待房客性别</Row>
            <Row ><em >*【男性】和【女性】必须选择1项</em ></Row >
            <Row gutter={16}>{this.renderTujiaOpts('acceptSex',5)}</Row>
        </div>
    }
    renderAirbnb (airbnbBookingSetting){

        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 0 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        };
        const {form} = this.props;
        const { getFieldDecorator } = form;
        return <div>
            <div><b>【Airbnb】预定设置</b></div>
            <div className="text-color-warning"><em>只有【房源描述】中Airbnb标题填写成功后，以下的Airbnb预定设置项才会生效，显示在【房源审批】等各模块中</em></div>
            <div>最少入住天（房晚）数</div>
            <Row type="flex" align="middle">
                <Col span={4}>
                    <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('defaultMinNights', {
                            rules: [{
                                required: true, message: '请输入最少入住天（房晚）数'
                            }],
                            initialValue:airbnbBookingSetting.defaultMinNights || null
                        })(
                            <InputNumber
                                min={1}
                                precision={0}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={2}>
                    <div className="ui-margin-bottom-16 ui-padding-12">房晚</div>
                </Col>
            </Row>
            <div>周末最短入住天（房晚）数</div>
            <Row type="flex" align="middle">
                <Col span={4}>
                    <FormItem
                        {...formItemLayout}
                    >
                        {getFieldDecorator('defaultWeekendMinNights', {
                            rules: [{
                                required: true, message: '请输入周末最短入住天（房晚）数'
                            }],
                            initialValue:airbnbBookingSetting.defaultWeekendMinNights || null
                        })(
                            <InputNumber
                                min={1}
                                precision={0}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={2}>
                    <div className="ui-margin-bottom-16 ui-padding-12">房晚</div>
                </Col>
            </Row>
            <div><em>*针对包含星期五和星期六的预定</em></div>
            <Row>
                <Col span={12}>
                    <Row type="flex" align="middle">
                        <Col span={24}>周连住优惠</Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label=""
                            >
                                {getFieldDecorator('monthlyPriceFactor', {
                                    rules: [{
                                        required: true, message: '请输入周连住优惠'
                                    }],
                                    initialValue:airbnbBookingSetting.monthlyPriceFactor
                                })(
                                    <InputNumber
                                        min={70}
                                        max={100}
                                        precision={0}
                                    />
                                )}
                            </FormItem>

                        </Col>
                        <Col span={12}>
                            <div className="ui-margin-bottom-16 ui-padding-12">%折扣优惠</div>
                        </Col>
                    </Row>

                </Col>
                <Col span={12}>
                    <Row type="flex" align="middle">
                        <Col span={24}>月连住优惠</Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('weeklyPriceFactor', {
                                    rules: [{
                                        required: true, message: '请输入月连住优惠'
                                    }],
                                    initialValue:airbnbBookingSetting.weeklyPriceFactor
                                })(
                                    <InputNumber
                                        min={70}
                                        max={100}
                                        precision={0}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <div className="ui-margin-bottom-16 ui-padding-12">%折扣优惠</div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div><em>
                <p>*【周连住优惠】是指7天（房晚）及以上的预定；【月连住优惠】是指28天（房晚）及以上的预定；</p>
                <p>*该折扣针对的是总房费+清洁费</p>
                <p>*优惠折扣框，可填70~100任意数值，最低只能设置70%（7折）优惠；例：70%是指房费+清洁费打7折</p>
            </em></div>
        </div>
    }
    render (){
        const {airbnbBookingSetting,isRepeat} = this.state;
        return <div className="width-full" style={{marginBottom: 50}}>
            <div>预定设置</div>
            <hr/>
            <Form>
                {this.renderTujia()}
                {/*{this.renderAirbnb(airbnbBookingSetting)}*/}
            </Form>
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
                <Button type="primary" loading={isRepeat} onClick={this.injectNextCb()}>
                    保存并下一步
                </Button>
            </div>
        </div>
    }
}

export default Form.create()(HandleBooking)
