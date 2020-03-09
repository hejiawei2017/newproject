import React, { Component } from 'react';
import { AAIHouseManagementService } from '../../services';
import { Row, Col, Input, Form, Button, Select, message } from 'antd';
import { getFixNewImagePrefix } from '../../utils/utils.js'
import UploadImage from '../../components/uploadImage';
import {createUUID} from "../../utils/utils"
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea, Search } = Input;


class HandleStaff extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selectAssistCleanersList: [], //保洁员信息
            mainCleanerId: '',
            designerInfo: {}, // 设计师信息
            landlordInfo: {}, // 房东信息
            imageUrlList: [],
            isRepeat: false,
            cleanerList: [] // 当前房源范围内的保洁员列表
        };
    }

    componentDidMount () {
        this.getStaffInfo();
        this.getCleanerData();
    }

    getCleanerData = () => {
        const {houseId} = this.props;
        AAIHouseManagementService.getCleanerList(houseId).then(res => {
            this.setState({
                cleanerList: res ? res : []
            })
        })
    }

    getStaffInfo = () => {
        const {houseId} = this.props;
        AAIHouseManagementService.getMemberInfo(houseId).then(res=>{
           if(res){
               const {memberId, design, cleaners} = res;
               let mainCleanerId = '';
               let selectAssistCleanersList = [];
               if(cleaners && cleaners.length > 0) {
                   cleaners.forEach(item => {
                       if(item.level === 1) {
                           mainCleanerId = item.cleanerId;
                       }
                       if(item.level === 2) {
                           selectAssistCleanersList.push({
                               id: createUUID('xxxxxxxxxxxxxxxx',10),
                               cleanerId: item.cleanerId
                           })
                       }
                   })
               }
               this.setState({
                   designerInfo: design || {},
                   mainCleanerId,
                   selectAssistCleanersList
               }, () => {
                   AAIHouseManagementService.getLandLord(houseId,memberId).then(res=>{
                       if(res){
                           delete res.timeVersion;
                           delete res.version;
                           this.setState({
                               landlordInfo: res,
                               imageUrlList: [{
                                   url: res.avatar,
                                   uid: createUUID('xxxxxxxxxxxxxxxx',10)
                               }]
                           })
                       }
                   });
               });
           }else {
                this.setState({
                    designerInfo: {},
                    cleanersInfo: {}
                })
            }

           this.setState({loading: false})
        });
    }

    handleSubmit (e){
        e.preventDefault();
        console.log(this.state.form);
    }

    submitMemberInfo = async () => {

        this.props.form.validateFields((err, values) => {
            const { houseId } = this.props;
            const { designerInfo, cleanerList } = this.state;
            const { mainCleanerId, assistCleaner } = values;
            let params = {
                cleaners: [],
                design: {
                    designer: designerInfo.designer,
                    designdes: designerInfo.designdes,
                    designNameImage: designerInfo.designNameImage
                }
            }

            cleanerList.forEach(item => {
                // 主保洁
                if(mainCleanerId && mainCleanerId === item.cleanerId) {
                    params.cleaners.push({
                        houseSourceId: houseId,
                        userId: item.userId,
                        level: 1,
                        cleanerId: item.cleanerId,
                        cleanerName: item.name,
                        cleanerPhone: item.phone
                    })
                }
                // 副保洁
                if(assistCleaner) {
                    assistCleaner.forEach(assistItem => {
                        if(item.cleanerId === assistItem.cleanerId) {
                            params.cleaners.push({
                                houseSourceId: houseId,
                                userId: item.userId,
                                level: 2,
                                cleanerId: item.cleanerId,
                                cleanerName: item.name,
                                cleanerPhone: item.phone
                            })
                        }
                    })
                }
            });
            this.setState({isRepeat: true})
            AAIHouseManagementService.putMemberInfo(houseId, params).then(res => {
                this.setState({isRepeat: false});
                message.success('更新成功');
            }).catch(err => {
                this.setState({isRepeat: false});
            });
        });

    }

    searchDesigner (keyword){
        if(!keyword) return;
        AAIHouseManagementService.getDesignerInfo(keyword).then(res=>{
            const designerInfo = {
                designer: '',
                designdes: '',
                designNameImage: ''
            };
            if(res && res.list && res.list.length > 0){

                designerInfo.designer = res.list[0].accountName;
                designerInfo.designdes = res.list[0].introduce;
                designerInfo.designNameImage = res.list[0].signature;

            }else{
                message.warning('没有找到设计师信息');
            }
            this.setState({
                designerInfo
            })
        })
    }

    checkLandlordValid= (data)=>{
        let valid = true;
        const checkInfoKeys = ['nickName', 'label', 'introduce', 'houseSourceId','avatar'];
        checkInfoKeys.forEach(key=>{
           if(!data[key]){
               valid = false;
           }
        });
        return valid;
    };

    submitLandlordInfo = async () =>{
        const self = this;
        const {form,houseId} = self.props;
        const {landlordInfo,imageUrlList} = self.state;
        const postData = Object.assign({},landlordInfo);
        const currentNickName = form.getFieldValue('nickName');
        const currentLabel = form.getFieldValue('label');
        const currentIntroduce = form.getFieldValue('introduce');
        postData.nickName = currentNickName;
        postData.label = currentLabel;
        postData.introduce = currentIntroduce;
        postData.houseSourceId = houseId;
        postData.avatar = imageUrlList && imageUrlList[0].url || form.getFieldValue('avatar');
        if(self.checkLandlordValid(postData)){
            self.setState({isRepeat:true});
            await AAIHouseManagementService.putLandLord(postData);
            self.setState({
                landlordInfo: postData
            });
            self.setState({isRepeat:false});
            message.success('更新成功');
        }else {
            message.error('房东信息设置未完成');
        }
    }

    injectNextCb = async () => {
        const { nextCb } = this.props;
        this.setState({isRepeat:true});
        await this.submitMemberInfo();
        await this.submitLandlordInfo();
        this.setState({isRepeat:false});
        nextCb();
    }

    addCleanerInfo = () => {
        let { selectAssistCleanersList } = this.state;
        selectAssistCleanersList.push({
            id: createUUID('xxxxxxxxxxxxxxxx',10),
            cleanerId: ''
        });
        this.setState({
            selectAssistCleanersList
        })
    }

    deleteCleanerInfo = (index) => {
        let selectAssistCleanersList = JSON.parse(JSON.stringify(this.state.selectAssistCleanersList));
        let assistCleanerData = this.props.form.getFieldValue('assistCleaner');
        selectAssistCleanersList.splice(index, 1);
        this.setState({
            selectAssistCleanersList
        }, () => {
            assistCleanerData.splice(index, 1);
            this.props.form.setFieldsValue({
                'assistCleaner': assistCleanerData
            });
        })
    }

    render (){
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 4,
                    offset: 20
                }
            }
        };
        const {designerInfo, imageUrlList, landlordInfo, isRepeat, cleanerList, selectAssistCleanersList, mainCleanerId} = this.state;
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const that = this;
        return <div className="width-full">
            <div>人员设置</div>
            <hr/>
            <Form onSubmit={this.handleSubmit} layout={'vertical'}>
                <div className="border-box ui-padding-12">
                    <div style={{marginBottom: 20}}>房东信息设置</div>
                    <Row gutter={16}>
                        <Col span={12} >
                            <FormItem
                                {...formItemLayout}
                                label="昵称"
                            >
                                {getFieldDecorator('nickName', {
                                    rules: [ {
                                        required: true, message: '请输入昵称'
                                    }],
                                    initialValue:landlordInfo && landlordInfo.nickName
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="职业"
                            >
                                {getFieldDecorator('label', {
                                    rules: [ {
                                        required: true, message: '请输入职业'
                                    }],
                                    initialValue:landlordInfo && landlordInfo.label
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="房东简介"
                            >
                                {getFieldDecorator('introduce', {
                                    rules: [{
                                        required: true, message: '请输入房东简介'
                                    }],
                                    initialValue:landlordInfo && landlordInfo.introduce
                                })(
                                    <TextArea rows={5} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} >
                            <FormItem
                                {...formItemLayout}
                            >
                                {getFieldDecorator('avatar', {
                                })(
                                    <UploadImage
                                        imageUrlList={imageUrlList}
                                        imageLength={1}
                                        getImageInfo={function (fileList) {
                                            that.setState({
                                                imageUrlList: fileList
                                            })
                                        }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" onClick={this.submitLandlordInfo}>保存</Button>
                    </FormItem>
                </div>
                <div className="border-box ui-padding-12" style={{marginTop: 20}}>
                    <div style={{marginBottom: 20}}>设计师设置</div>
                    <Row gutter={16}>
                        <Col span={12} >
                            <FormItem
                                {...formItemLayout}
                                label="设计师电话"
                            >
                                {getFieldDecorator('designerPhone', {
                                    initialValue: designerInfo && designerInfo.designPhone
                                })(
                                    <Search
                                        placeholder="请输入手机号"
                                        onSearch={function (keyword) {
                                            that.searchDesigner(keyword);
                                        }}
                                        enterButton
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="设计师姓名"
                            >
                                <Input value={designerInfo.designer} disabled />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="简介"
                            >
                                <TextArea value={designerInfo.designdes} disabled />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="签名"
                            >
                                {designerInfo.designNameImage ?
                                    <img
                                        src={getFixNewImagePrefix(designerInfo.designNameImage)}
                                         style={{ display: 'inline-block', width: '180px', height: '130px' }}
                                        className="fake-transparent-bg"
                                        alt="加载失败..."
                                    /> : null}
                            </FormItem>
                        </Col>
                    </Row>
                    <div style={{marginBottom: 20}}>保洁人员设置</div>
                    <Row gutter={10}>
                        <Col span={13}>
                            <FormItem
                                {...formItemLayout}
                                label="主保洁员"
                            >
                                {getFieldDecorator(`mainCleanerId`, {
                                    initialValue: mainCleanerId || undefined
                                })(
                                    <Select placeholder="请选择保洁员" allowClear>
                                        {
                                            cleanerList && cleanerList.length > 0 ? cleanerList.map(optItem => {
                                                return (
                                                    <Option key={'main_' + optItem.cleanerId} value={optItem.cleanerId}>{optItem.name}({optItem.phone})</Option>
                                                )
                                            }) : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={13}>
                            {
                                selectAssistCleanersList.map((item,index) => {
                                    return (
                                        <FormItem
                                            key={'selectAssistCleanersList_' + item.id}
                                            {...formItemLayout}
                                            label="副保洁员"
                                        >
                                            <Row gutter={10}>
                                                <Col span={20}>
                                                    {getFieldDecorator(`assistCleaner[${index}].cleanerId`, {
                                                        initialValue: item.cleanerId ? item.cleanerId : undefined
                                                    })(
                                                        <Select key={'selectAssistCheck_' + item.id} placeholder="请选择保洁员" allowClear>
                                                            {
                                                                cleanerList && cleanerList.length > 0 ? cleanerList.map(optItem => {
                                                                    return (
                                                                        <Option key={item.id + optItem.cleanerId} value={optItem.cleanerId}>{optItem.name}({optItem.phone})</Option>
                                                                    )
                                                                }) : null
                                                            }
                                                        </Select>
                                                    )}
                                                </Col>
                                                <Col span={4}>
                                                    <Button onClick={function () {
                                                        that.deleteCleanerInfo(index)
                                                    }} type="danger" shape="circle" icon="delete"
                                                    />
                                                </Col>
                                            </Row>
                                        </FormItem>
                                    )
                                })
                            }
                        </Col>
                        <Col span={13}>
                            {
                                selectAssistCleanersList.length < 4 ? <Button type="primary" onClick={this.addCleanerInfo}>新增副保洁</Button> : null
                            }

                        </Col>
                    </Row>

                    <Row>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" loading={isRepeat} onClick={this.submitMemberInfo}>保存</Button>
                        </FormItem>
                    </Row>
                </div>
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
                <Button type="primary" loading={isRepeat} onClick={this.injectNextCb}>
                    保存并下一步
                </Button>
            </div>
        </div>
    }
}

export default Form.create()(HandleStaff)
