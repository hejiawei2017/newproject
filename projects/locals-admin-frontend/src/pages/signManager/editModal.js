import React, { Component } from 'react'
import { Input, Modal, Form, Select, Divider, Checkbox, Button, Popconfirm, DatePicker } from 'antd'
import moment from 'moment'
import Upload from './upload'
const Option = Select.Option

const FormItem = Form.Item

const STATUS_DICTIONARY = {
    '-1': '不通过',
    '0': '待审',
    '1': '通过'
}

const SIGNTYPE_DICTIONARY = {
    '0': '个人',
    '1': '团队',
    '2': '公司'
}

const BOOLEAN_OPTIONS = {
    '0': '否',
    '1': '是'
}
let ORDER_STATUS = {};

class EditModal extends Component {
    constructor () {
        super()
        this.state = {
            signature: null,
            resume: null,

            id: null,
            isPersonal: false,
            isTeam: false,
            isCompany: false,

            isDesigner: false,
            isPhotographer: false,
            isPM: false,
            isCleaner: false,
            isAid: false,

            editModalVisible: true
        }
        this.handleCancel = this.handleCancel.bind(this)
        this.onModalOk = this.onModalOk.bind(this)
        this.uploadCallBack = this.uploadCallBack.bind(this)
    }
    componentDidMount () {
        this.setState({...this.props._data});
        this.initBoolean();
    }

    uploadCallBack (imgs) {
        if ( this.state.isDesigner ){
            return this.props.form.setFieldsValue({ signature: imgs});
        }
        this.props.form.setFieldsValue({ resume: imgs });
    }
    initBoolean () {
        let { contractType, signType } = this.props._data;
        console.log('contractType:',contractType, contractType.includes('助理房东'));

        this.setState({
            isDesigner: contractType.includes('设计师'),
            isPM: contractType.includes('项目经理'),
            isPhotographer: contractType.includes('摄影师'),
            isCleaner: contractType.includes('保洁'),
            isAid: contractType.includes('助理房东')
        }, () => {
            if(this.state.isDesigner || this.state.isCleaner){
                const dictionary = SIGNTYPE_DICTIONARY[signType] || '' // by changezhen@locals.com
                this.setState({
                    isPersonal: dictionary.includes('个人'),
                    isTeam: dictionary.includes('团队') ,
                    isCompany: dictionary.includes('公司')
                })
            }
        })
    }

    onModalOk (_status) {
        let that = this

        that.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(that.props.editType === 'add'){
                    that.submitForm(values,that.props.editType)
                }else{
                    Object.keys(STATUS_DICTIONARY).forEach(i => {
                        if (values.status === STATUS_DICTIONARY[i]) {
                            return values.status = i;
                        }
                    })
                    Object.keys(ORDER_STATUS).forEach(i => {
                        if (values.orderStatus === ORDER_STATUS[i]) {
                            return values.orderStatus = i;
                        }
                    })
                    Object.keys(SIGNTYPE_DICTIONARY).forEach(i => {
                        if (values.signType === SIGNTYPE_DICTIONARY[i]) {
                            return values.signType = i;
                        }
                    })
                    Object.keys(BOOLEAN_OPTIONS).forEach(i => {
                        if (values.hasStrategy === BOOLEAN_OPTIONS[i]) {
                            values.hasStrategy = i;
                        }
                        if (values.hasEdge === BOOLEAN_OPTIONS[i]) {
                            values.hasEdge = i;
                        }
                        if (values.hasSpeed === BOOLEAN_OPTIONS[i]) {
                            values.hasSpeed = i;
                        }
                        if (values.hasDesign === BOOLEAN_OPTIONS[i]) {
                            values.hasDesign = i;
                        }
                    })

                    if(_status !== 'undefined' && typeof _status === 'string'){
                        values.status = _status;
                    }

                    values['id'] = that.state.id
                    values.contractType = that.state.contractType;
                    console.log('values:',values);

                    that.submitForm(values,that.props.editType)
                }
            }
        })
    }
    submitForm (val,type) {
        this.props.labelModalSave(val,type)
    }
    handleCancel () {
        this.setState({
            editModalVisible: false
        }, ()=>{
            this.props.stateChange({editModalVisible: false})
        })
    }
    render () {
        let _state = this.state;
        let { status } = _state;
        const { getFieldDecorator } = this.props.form
        //configs
        let { contractType, signType, orderStatus } = this.props.configs;
        ORDER_STATUS = orderStatus;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 }
            }
        }

        const handleContractTypeChange = v => {
            this.setState({ isDesigner: false, isPhotographer: false, isPM: false, isCleaner: false, isAid: false});
            Object.values(contractType).forEach(i => {
                if(i === v){
                    if(v.includes('设计师')){
                        this.setState({ isDesigner: true });
                    } else if (v.includes('摄影师')) {
                        this.setState({ isPhotographer: true });
                    } else if(v.includes('项目经理')){
                        this.setState({ isPM: true });
                    } else if(v.includes('保洁')){
                        this.setState({ isCleaner: true});
                    } else if(v.includes('助理房东')){
                        this.setState({ isAid: true});
                    }
                }
            })
        }
        const handleSignTypeChange = v => {
            this.setState({ isPersonal: false, isTeam: false});
            Object.values(signType).forEach(i => {
                if(i === v && i.includes('个人')){
                    this.setState({ isPersonal: true});
                }else if(i === v && i.includes('团队')){
                    this.setState( { isTeam: true});
                }else if(i === v && i.includes('公司')){
                    this.setState( { isCompany: true});
                }
            })
        }

        const rBaseFormItem = (key, text, disabled = false) => {
            let { isDesigner, isPhotographer, isPM, isCleaner,isAid, isPersonal, isTeam } = this.state;
            let finalKey = key + text;
            let required = true;
            let rules = [{ required, message: `请输入${text}` }];

            if (key === 'companyName' && (isPhotographer || isPM)){
                rules[0].required = false;
            }
            if (key === 'referee' || key === 'refereePhone') {
                rules[0].required = false;
            }
            if (key === 'orderQuantity') {
                rules[0].required = false;
            }
            if (isCleaner) {
                if (key === 'signDistrict'){
                    rules[0].required = false;
                }
                if (key === 'email' && (isPersonal || isTeam)){
                    rules[0].required = false;
                }
            }
            if (isAid){
                let aidNoReqireArr = ['otherChannel', 'openBank', 'accountNumber', 'accountName'];
                if(aidNoReqireArr.includes(key)){
                    rules[0].required = false;
                }
            }
            if (key === 'score'){
                rules.push({
                    pattern: new RegExp(/^(?:0|[1-9][0-9]?|100)$/),
                    message: `有效评分值为0-100的整数`
                })
            }
            return (
                <FormItem
                    {...formItemLayout}
                    label={text}
                    key={finalKey}
                >
                    {getFieldDecorator(key, {
                        initialValue: _state[key],
                        rules
                    })(
                        <Input placeholder={text} disabled={disabled}/>
                    )}
                </FormItem>
            )
        }
        const rSelectFormItem = (key, text, disabled = false) => {
            let middle = this.props.configs[key];
            if(middle === '{}') return;
            let dataset = Object.values(middle);
            /* 若传值用非中文再考虑这段 {Object.keys(dataset).map(k=>{
                return <Option key={k}>{dataset[k]}</Option>
            })} */
            let initialValue = _state[key];
            const rOptions = () => {
                return dataset.map(i => <Option key={i}>{i}</Option>)
            }
            if (key === 'signType') {
                initialValue = SIGNTYPE_DICTIONARY[_state.signType];
            }
            if (key === 'orderStatus') {
                initialValue = ORDER_STATUS[_state.orderStatus];
            }
            if (key === 'hasStrategy' || key === 'hasEdge' || key === 'hasSpeed' || key === 'hasDesign') {
                initialValue = BOOLEAN_OPTIONS[_state[key]];
            }
            const searchSelect = {
                showSearch: true,
                optionFilterProp: "children",
                filterOption: (input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            }

            return (
                <FormItem
                    {...formItemLayout}
                    label={text}
                    key={key}
                >
                    {getFieldDecorator(key, {
                        initialValue,
                        rules: [{ required: true, message: `请选择${text}` }]
                    })(
                        key === 'contractType'//签约类型
                            ? <Select disabled={disabled} onChange={handleContractTypeChange}>{rOptions()}</Select>
                            : key === 'signType'//签约方式
                                ? <Select disabled={disabled} onChange={handleSignTypeChange}>{rOptions()}</Select>
                                : <Select disabled={disabled} {...searchSelect}>{rOptions()}</Select>
                    )}
                </FormItem>
            )
        }
        const rDatePickerFormItem = (key, text, disabled = false) => {
            let finalKey = key + text;
            let rules = [{ required: false, message: `请输入${text}` }];
            return (
                <FormItem
                    {...formItemLayout}
                    label={text}
                    key={finalKey}
                >
                    {getFieldDecorator(key, {
                        initialValue: _state[key] ? moment(_state[key]) : null,
                        rules
                    })(
                        <DatePicker placeholder={text} disabled={disabled}/>
                    )}
                </FormItem>
            )
        }
        const rTextArea = (key, text, disabled = false) => {
            return (
                <FormItem
                    {...formItemLayout}
                    label={text}
                    key={key}
                >
                    {getFieldDecorator(key, {
                        initialValue: _state[key],
                        rules: [{ required: key !== 'remark' && true, message: `请输入${text}` }]
                    })(
                        <Input.TextArea placeholder={`请输入${text}`} autosize={{ minRows: 2 }} disabled={disabled}/>
                    )}
                </FormItem>
            )
        }
        const rUploadComponent = (key, text, disabled) => {
            let uploadConfig = {
                imgs: _state[key],
                uploadCallBack: this.uploadCallBack,
                disabled
            }
            return (
                <FormItem
                    {...formItemLayout}
                    label={text}
                    key={key}
                >
                    {getFieldDecorator(key, {
                        initialValue: _state[key],
                        rules: [{ required: true, message: `请上传${text}` }]
                    })(
                        <Upload {...uploadConfig}/>
                    )}
                </FormItem>
            )
        }
        const rReferee = (disabled = false) => {
            return (
                <div key="referee">
                    <h3 className="form-title">推荐人信息</h3>
                    {rBaseFormItem('referee', '推荐人姓名', disabled)}
                    {rBaseFormItem('refereePhone', '联系方式', disabled)}
                    <Divider key="divider-pay" />
                </div>
            )
        }
        const rPayee = (disabled = false, ...key) => {
            let hasAlipay = key.includes('alipay');
            let hasBank = key.includes('bank');
            let res = [];
            res = res.concat(rTitle('payee-info', '收款账号信息'));
            if(hasAlipay){
                res = res.concat(
                    rBaseFormItem('payeeName', '收款人真实姓名', disabled),
                    rBaseFormItem('alipayNumber', '支付宝账号', disabled)
                )
            }
            if(hasBank){
                res = res.concat(
                    rBaseFormItem('openBank', '开户行', disabled),
                    rBaseFormItem('accountName', '收款方', disabled),
                    rBaseFormItem('accountNumber', '收款账号', disabled)
                )
            }
            res = res.concat(<Divider key="payee-bottom"/>);
            return res;
        }
        const rTitle = (key, text) => {
            return (
                <h3 className="form-title" key={key}>{text}</h3>
            )
        }
        const rAgreeButton = (_jobs) => {
            let href;
            switch (_jobs) {
                case 'designer':
                    href = "http://qy.localhome.com.cn/locals/temp/onlineContract/Locals房屋室内软装设计业务合作协议-个人及团队.png";
                    break;
                case 'photographer':
                    href = "http://qy.localhome.com.cn/locals/temp/onlineContract/Locals路客签约摄影师合同.png";
                    break;
                case 'PM':
                    href = "http://qy.localhome.com.cn/locals/temp/onlineContract/Locals路客签约项目经理合同.png";
                    break;
                case 'aid':
                    href = "http://qy.localhome.com.cn/locals/temp/onlineContract/Locals路客签约助理房东服务合同.png"
                    break;
                case 'cleaner':
                    href = "http://locals-house-prod.oss-cn-shenzhen.aliyuncs.com/upload/190408/F5BSY190408172141923.jpeg";
                    break;
                default:
                    break;
            }
            return (
                <FormItem {...formItemLayout} label="" key="agreement">
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                        initialValue: true,
                        rules: [{ required: true, message: `请阅读并勾选协议` }]
                    })(
                        <Checkbox>我同意
                            {
                                <a href={href} target="_blank">{_jobs !== 'cleaner' ? href.match(/Locals(\S*)\.png/)[1] : '路客签约保洁合同'}</a>
                            }
                        </Checkbox>
                    )}
                </FormItem>
            )
        }
        const rContractStatus = () => {
            return (
                <FormItem
                    {...formItemLayout}
                    label={'审核状态'}
                    key="status"
                >
                    {getFieldDecorator('status', {
                        initialValue: STATUS_DICTIONARY[_state.status]
                    })(
                        <Input disabled/>
                    )}
                </FormItem>
            )
        }
        const rBaseWorkerInfo = (jobs, disabled = false) => {
            //default: pm and photographer
            let base = [
                rTitle('worker-info', '个人信息'),
                rBaseFormItem('name', '姓名（乙方）', disabled),
                rBaseFormItem('idCard', '身份证', disabled),
                rBaseFormItem('phone', '联系电话', disabled),
                rBaseFormItem('email', '邮箱', disabled),
                rBaseFormItem('wechat', '微信', disabled),
                rBaseFormItem('address', '地址', disabled),
                rSelectFormItem('workStatus', '工作状态', disabled),
                rSelectFormItem('workAge', '工作年限', disabled)
            ];
            const designerExtra = rBaseFormItem('companyName', '所属公司/工作室/自由', disabled);
            if(jobs === 'designer' || jobs === 'aid'){
                let idx = 0;
                base.forEach((i, index) => {
                    if (i.key.includes('idCard')) idx = index
                })
                base.splice(idx, 0 ,designerExtra);
            }
            return base;
        }
        const rAidOther = (disabled = false) => {
            return ([
                rTitle('aid-other', '其它信息'),
                rBaseFormItem('staffType', '人员类型', disabled),
                rBaseFormItem('fromChannel', '来源渠道', disabled),
                rBaseFormItem('otherChannel', '其它来源渠道', disabled),
                rBaseFormItem('urgentContact', '紧急联系人', disabled),
                rBaseFormItem('urgentContactPhone', '紧急联系人电话', disabled)
            ])
        }

        const rFooter = (_status) => {
            let res = [];
            const rButton = (type = 'defatult', text) => <Button type={type}>{text}</Button>
            let getPopConfig = (targetStatus, key = 'resolve_key') => {
                return {
                    key,
                    title: '确定操作',
                    okText: '确定',
                    cancelText: '取消',
                    onConfirm: () => {
                        return this.onModalOk(targetStatus);
                    }
                }
            }

            switch (_status) {
                case -1:
                    res = res.concat(
                        <Popconfirm {...getPopConfig('0', 'resolve_-1_0')}>{rButton('primary', '提交')}</Popconfirm>
                    )
                    break;
                case 0:
                    res = res.concat(
                        <Popconfirm {...getPopConfig('1', 'resolve_0_1')}>{rButton('primary', '审核通过')}</Popconfirm>,
                        <Popconfirm {...getPopConfig('-1', 'reject_0_-1')}>{rButton('danger', '审核不通过')}</Popconfirm>
                    )
                    break;
                case 1:
                    res = res.concat(
                        <Popconfirm {...getPopConfig()}>{rButton('primary', '修改接单状态')}</Popconfirm>,
                        <Popconfirm {...getPopConfig('-1', 'reject_1_-1')}>{rButton('danger', '取消签约')}</Popconfirm>
                    )
                    break;
                default:
                    break;
            }
            return footer = res;
        }
        const rMainBlocksByStatus = (_status) => {
            // 待审，已审状态时：除了接单状态，备注，评分外其他全都不可修改！
            let items = [];
            let { isDesigner, isPhotographer, isPM, isCleaner, isAid, isPersonal, isTeam, isCompany } = _state;
            let disabled = _status === -1 ? false : true;
            if (isDesigner) {
                items = items.concat(
                    rSelectFormItem('signType', '签约方式', disabled)
                )
                // if (isPersonal) {
                //     items = items.concat(
                //         rSelectFormItem('signCity', '接单城市', disabled),
                //         rBaseWorkerInfo('designer', disabled),
                //         rPayee(disabled, 'bank'),
                //         rTextArea('introduce', '设计师介绍', disabled),
                //         rUploadComponent('signature', '设计师签名', disabled),
                //         rReferee(disabled),
                //         rBaseFormItem('score', '考核分数', true),
                //         rBaseFormItem('rating', '评分'),
                //         rSelectFormItem('orderStatus', '接单状态'),
                //         rTextArea('remark', '备注')
                //     )
                // } else if (isTeam) {
                //     items = items.concat(
                //         rBaseFormItem('teanName', '团队名称', disabled),
                //         rSelectFormItem('signCity', '接单城市', disabled),
                //         rTitle('worker-info', '个人信息'),
                //         rBaseFormItem('name', '姓名（乙方）', disabled),
                //         rSelectFormItem('workStatus', '工作状态', disabled),
                //         rSelectFormItem('workAge', '工作年限', disabled),
                //     )
                // }
                items = [].concat(
                    // items,
                    rSelectFormItem('signCity', '接单城市', disabled),
                    rBaseWorkerInfo('designer', disabled),
                    rPayee(disabled, 'bank'),
                    rTextArea('introduce', '设计师介绍', disabled),
                    rUploadComponent('signature', '设计师签名', disabled),
                    rReferee(disabled),
                    rTextArea('remark', '备注'),
                    <h3 key={'CooperativeInformation'} className="form-title">合作信息</h3>,
                    rSelectFormItem('hasStrategy', '是否战略合作'),
                    rSelectFormItem('hasEdge', '是否新锐合作'),
                    rSelectFormItem('hasSpeed', '是否速优合作'),
                    rSelectFormItem('hasDesign', '是否设计执行'),
                    <h3 key={'Results'} className="form-title">项目评分</h3>,
                    rBaseFormItem('rating', '基础分'),
                    rBaseFormItem('score', '考核分数（今年）', true),
                    rBaseFormItem('hisScore', '考核分数（历史）'),
                    <h3 key={'AppState'} className="form-title">审批状态</h3>,
                    rSelectFormItem('orderStatus', '接单状态'),
                    rDatePickerFormItem('recentOrderTime', '最近接单时间'),
                    rBaseFormItem('orderQuantity', '接单数量'),
                    rDatePickerFormItem('recentTrainingTime', '最近培训时间'),
                    rAgreeButton('designer')
                )
            } else if (isPhotographer) {
                items = items.concat(
                    rSelectFormItem('signCity', '区域-城市', disabled),
                    rBaseWorkerInfo('photographer', disabled),
                    rPayee(disabled, 'bank'),
                    rBaseFormItem('score', '考核分数', true),
                    rBaseFormItem('rating', '评分'),
                    rSelectFormItem('orderStatus', '接单状态'),
                    rTextArea('remark', '备注'),
                    rAgreeButton('photographer')
                )
            } else if (isPM) {
                items = items.concat(
                    rSelectFormItem('signCity', '区域-城市', disabled),
                    rBaseWorkerInfo('PM', disabled),
                    rPayee(disabled, 'bank'),
                    rBaseFormItem('score', '考核分数', true),
                    rAgreeButton('PM')
                )
            } else if (isCleaner) {
                items = items.concat(
                    rSelectFormItem('signType', '签约方式', disabled),
                    rSelectFormItem('signCity', '接单城市', disabled),
                    rBaseFormItem('signDistrict', '接单区域', disabled)
                )
                if (isPersonal || isTeam) {
                    items = items.concat(
                        rTitle('worker-info', '个人信息'),
                        rBaseFormItem('name', '姓名（乙方）', disabled),
                        rBaseFormItem('companyName', '所属公司/工作室/自由', disabled),
                        rBaseFormItem('idCard', '身份证', disabled),
                        rBaseFormItem('phone', '联系电话', disabled),
                        rBaseFormItem('email', '邮箱', disabled),
                        rBaseFormItem('wechat', '微信', disabled),
                        rBaseFormItem('address', '常住地址', disabled),
                        rPayee(disabled, 'bank'),
                        rAgreeButton('cleaner')
                    )
                }else if (isCompany) {
                    items = items.concat(
                        rTitle('company-info', '公司信息'),
                        rBaseFormItem('companyName', '公司名（乙方）', disabled),
                        rBaseFormItem('companyPhone', '公司联系电话', disabled),
                        rUploadComponent('companyLicense', '营业执照', disabled),
                        rBaseFormItem('email', '公司邮箱', disabled),
                        rTitle('worker-info', '对接人信息'),
                        rBaseFormItem('name', '业务对接人', disabled),
                        rBaseFormItem('idCard', '身份证', disabled),
                        rBaseFormItem('phone', '业务对接人联系电话', disabled),
                        rBaseFormItem('wechat', '业务对接人微信', disabled),
                        rPayee(disabled, 'bank'),
                        rAgreeButton('cleaner')
                    )
                }

            } else if (isAid) {
                console.log('this.props._data:',JSON.stringify(this.props._data));
                items = items.concat(
                    rSelectFormItem('signCity', '接单城市', disabled),
                    rBaseWorkerInfo('aid', disabled),
                    rPayee(disabled, 'alipay', 'bank'),
                    rAidOther(),
                    rReferee(disabled),
                    rAgreeButton('aid')
                )
            }
            form = <Form>
                    {rContractStatus()}
                    {rSelectFormItem('contractType', '签约类型', disabled)}
                    {items}
                </Form>
        }

        let form = null;
        let footer = null;
        rMainBlocksByStatus(status);
        rFooter(status);

        return (
            <Modal
                visible={_state.editModalVisible}
                title={this.props.editType === 'add' ? '新增' : '编辑'}
                width="700px"
                wrapClassName="scroll-center-modal"
                style={{ top: 0 }}
                // onOk={this.onModalOk}
                onCancel={this.handleCancel}
                // cancelText="关闭"
                // okText="保存"
                footer={footer}
            >
                {form}
            </Modal>
        )
    }
}

EditModal = Form.create()(EditModal)
export default EditModal