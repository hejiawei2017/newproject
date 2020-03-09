import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Input,
    Form,
    Modal,
    Radio,
    DatePicker,
    Select,
    Switch,
    Cascader,
    Tabs,
    message
} from "antd";
import { newIncumbentSettingService, newRoleService } from "../../services";

import { setArrayToData, getArrayToparent } from "../../utils/arrayTransform";
import { SubTable } from "../../components";
import { moveTypeList } from "../../utils/dictionary";
import moment from "moment";
import "moment/locale/zh-cn";
import "./index.less";

moment.locale("zh-cn");

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const TextArea = Input.TextArea;

const mapStateToProps = (state, action) => {
    return {};
};
class IncumbentModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addInfoVisible: false,
            confirmLoading: false,
            // moveDivVisible: true,
            siteData: [],
            oSiteData: [],
            positionData: [],
            organizationData: [],
            roleData: [],
            siteDataArr: [],
            newOrganizations: [{}]
        };
    }
    componentDidMount () {
        this.getSiteTable();
        // this.getRoleList()
        // this.getPositionList()
        // this.getTreeList()
        let {
            addInfoVisible,
            editInfoData,
            positionData,
            organizationData
        } = this.props;
        let items = {
            editInfoData,
            positionData,
            organizationData
        };
        console.log("items", items);
        if (addInfoVisible) {
            this.setState({
                ...items,
                addInfoVisible
            });
        }
    }
    getSiteTable = () => {
        newIncumbentSettingService
            .getSiteTable({ pageNum: 1, pageSize: 20000 })
            .then(e => {
                let siteData = setArrayToData(
                    e.list,
                    "parentCode",
                    "code",
                    "children",
                    this.changeArray,
                    this.isChildren,
                    2
                );
                this.setState({
                    siteData,
                    oSiteData: e.list
                });
                this.getSiteDataArr();
            });
    };
    getRoleList = () => {
        newRoleService.getTable({ pageNum: 1, pageSize: 20000 }).then(e => {
            let roleData = e.list;
            this.setState({
                roleData
            });
        });
    };
    getSiteDataArr = () => {
        let { siteDataArr, oSiteData } = this.state;
        if (siteDataArr.length > 0) {
        } else {
            let value = this.props.editInfoData.workplace;
            let code;
            oSiteData.map(item => {
                if (item.name === value) {
                    code = item.code;
                }
                return item;
            });
            let arr = getArrayToparent(oSiteData, "parentCode", "code", code);
            this.setState({
                siteDataArr: arr
            });
        }
    };
    putEmployee = values => {
        let oSiteData = this.state.oSiteData;
        if (values.workplace && values.workplace.length > 0) {
            let workplaceCode = values.workplace[values.workplace.length - 1];
            oSiteData.map(item => {
                if (item.code === workplaceCode) {
                    values.workplace = item.name;
                }
                return item;
            });
        } else {
            values.workplace = null;
        }
        let params = {
            id: values.id,
            realName: values.realName,
            sex: values.sex,
            idCard: values.idCard,
            privateEmail: values.privateEmail,
            companyEmail: values.companyEmail,
            mobile: values.mobile,
            education: values.education,
            inductionTime: values.inductionTime,
            contractPositiveTime: values.contractPositiveTime,
            contractExpireTime: values.contractExpireTime,
            workplace: values.workplace,
            isDepartmentPrincipal: values.isDepartmentPrincipal
        };
        newIncumbentSettingService
            .putEmployee(params)
            .then(() => {
                message.success("激活成功！");
                this.setState({ confirmLoading: false });
                this.props.submitInfoChangeTable();
            })
            .catch(() => {
                this.setState({ confirmLoading: false });
            });
    };
    activeEmployee = values => {
        this.setState({ confirmLoading: true });
        newIncumbentSettingService
            .activeEmployee(values.id)
            .then(e => {
                this.putEmployee(values);
            })
            .catch(() => {
                this.setState({ confirmLoading: false });
            });
    };
    changeItem = item => {
        return {
            value: item.id,
            label: item.name
        };
    };
    changeArray = item => {
        return {
            value: item.code,
            label: item.name
        };
    };
    isChildren = item => {
        return item.name === "市辖区";
    };
    changeState = obj => {
        this.setState(obj);
    };
    searchEmployee = value => {
        newIncumbentSettingService.getTable({ search: value }).then(e => {
            if (e.total > 0 && e.list[0]) {
                let item = e.list[0];
                this.props.form.setFieldsValue({
                    handoverEmployeeName: item.realName,
                    handoverEmployeeId: item.id
                });
            }
        });
    };
    addOrganizations = () => {
        let newOrganizations = this.state.newOrganizations;
        newOrganizations.push({});
        this.setState({
            newOrganizations
        });
    };
    handleEditInfoSubmit = e => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //   console.log('Received values of form: ', values);
                this.activeEmployee(values);
            }
        });
    };
    renderpositionOption = () => {
        let positionData = this.state.positionData;
        return positionData.map(item => (
            <Option key={item.id}>{item.name}</Option>
        ));
    };
    render () {
        let _this = this;
        let _state = this.state;
        let {
            addInfoVisible,
            siteData,
            editInfoData,
            siteDataArr,
            organizationData,
            confirmLoading
        } = _state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        return (
            <div className="newIncumbentSetting-page--modal">
                {addInfoVisible && (
                    <Modal
                        title="激活人员"
                        visible={addInfoVisible}
                        confirmLoading={confirmLoading}
                        className="newIncumbentSetting-modal"
                        onCancel={function () {
                            _this.changeState({ addInfoVisible: false });
                            _this.props.changeState({ addInfoVisible: false });
                        }}
                        onOk={this.handleEditInfoSubmit}
                    >
                        <Form>
                            <FormItem
                                {...formItemLayout}
                                label="id"
                                style={{ display: "none" }}
                            >
                                {getFieldDecorator("id", {
                                    initialValue: editInfoData.id
                                })(<Input placeholder="" disabled />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="员工编号">
                                {getFieldDecorator("memberCode", {
                                    initialValue: editInfoData.memberCode,
                                    rules: [
                                        {
                                            required: false,
                                            message: "请输入员工编号!"
                                        }
                                    ]
                                })(<Input placeholder="员工编号" disabled />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="姓名">
                                {getFieldDecorator("realName", {
                                    initialValue: editInfoData.realName,
                                    rules: [
                                        {
                                            required: false,
                                            message: "请输入姓名!"
                                        }
                                    ]
                                })(<Input placeholder="姓名" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="性别">
                                {getFieldDecorator("sex", {
                                    initialValue: editInfoData.sex.toString(),
                                    rules: [
                                        {
                                            required: false,
                                            message: "请选择性别!"
                                        }
                                    ]
                                })(
                                    <RadioGroup>
                                        <RadioButton value="1">男</RadioButton>
                                        <RadioButton value="0">女</RadioButton>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="身份证号码">
                                {getFieldDecorator("idCard", {
                                    initialValue: editInfoData.idCard,
                                    rules: [
                                        {
                                            required: false,
                                            message: "请输入身份证号码!"
                                        }
                                    ]
                                })(<Input placeholder="身份证号码" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="私人邮箱">
                                {getFieldDecorator("privateEmail", {
                                    initialValue: editInfoData.privateEmail,
                                    rules: [
                                        {
                                            required: false,
                                            message: "请输入私人邮箱!"
                                        }
                                    ]
                                })(<Input placeholder="私人邮箱" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="联系电话">
                                {getFieldDecorator("mobile", {
                                    initialValue: editInfoData.mobile,
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入联系电话!"
                                        }
                                    ]
                                })(<Input placeholder="联系电话" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="学历">
                                {getFieldDecorator("education", {
                                    initialValue: editInfoData.education,
                                    rules: [
                                        {
                                            required: false,
                                            message: "请输入学历!"
                                        }
                                    ]
                                })(<Input placeholder="学历" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="公司邮箱">
                                {getFieldDecorator("companyEmail", {
                                    initialValue: editInfoData.companyEmail,
                                    rules: [
                                        {
                                            required: false,
                                            message: "请输入公司邮箱!"
                                        }
                                    ]
                                })(<Input placeholder="公司邮箱" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="入职日期">
                                {getFieldDecorator("inductionTime", {
                                    initialValue: editInfoData.inductionTime
                                        ? moment(editInfoData.inductionTime)
                                        : null,
                                    rules: [
                                        {
                                            required: false,
                                            type: "object",
                                            message: "请选择入职日期!"
                                        }
                                    ]
                                })(<DatePicker format="YYYY-MM-DD" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="合同转正日期">
                                {getFieldDecorator("contractPositiveTime", {
                                    initialValue: editInfoData.contractPositiveTime
                                        ? moment(
                                              editInfoData.contractPositiveTime
                                          )
                                        : null,
                                    rules: [
                                        {
                                            required: false,
                                            type: "object",
                                            message: "请选择合同转正日期!"
                                        }
                                    ]
                                })(<DatePicker format="YYYY-MM-DD" />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="合同到期日期">
                                {getFieldDecorator("contractExpireTime", {
                                    initialValue: editInfoData.contractExpireTime
                                        ? moment(
                                              editInfoData.contractExpireTime
                                          )
                                        : null,
                                    rules: [
                                        {
                                            required: false,
                                            type: "object",
                                            message: "请选择合同到期日期!"
                                        }
                                    ]
                                })(<DatePicker format="YYYY-MM-DD" />)}
                            </FormItem>
                            {(editInfoData.positions &&
                            editInfoData.positions.length > 0
                                ? editInfoData.positions
                                : [{}]
                            ).map((item, index) => {
                                return (
                                    <div
                                        className="word"
                                        key={`editInfoData-word-${index}`}
                                    >
                                        <div className="title">工作岗位</div>
                                        <FormItem
                                            {...formItemLayout}
                                            label="部门"
                                        >
                                            {getFieldDecorator(
                                                `organizations[${index}]`,
                                                {
                                                    initialValue: [
                                                        (
                                                            editInfoData
                                                                .organizations[
                                                                index
                                                            ] || { id: "" }
                                                        ).fullName
                                                    ],
                                                    rules: [
                                                        {
                                                            required: false,
                                                            type: "array",
                                                            message:
                                                                "请输入部门!"
                                                        }
                                                    ]
                                                }
                                            )(
                                                <Cascader
                                                    options={organizationData}
                                                    placeholder="请选择"
                                                />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="职位"
                                        >
                                            {getFieldDecorator(
                                                `positions[${index}]`,
                                                {
                                                    initialValue: item.name,
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message:
                                                                "请输入职位!"
                                                        }
                                                    ]
                                                }
                                            )(
                                                <Select placeholder="请选择">
                                                    {this.renderpositionOption()}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </div>
                                );
                            })}
                            <FormItem {...formItemLayout} label="工作地点">
                                {getFieldDecorator("workplace", {
                                    initialValue: siteDataArr,
                                    rules: [
                                        {
                                            required: false,
                                            type: "array",
                                            message: "请输入工作地点!"
                                        }
                                    ]
                                })(
                                    <Cascader
                                        options={siteData}
                                        placeholder="请选择"
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="是否部门负责人"
                            >
                                {getFieldDecorator(`isDepartmentPrincipal`, {
                                    initialValue:
                                        editInfoData.isDepartmentPrincipal,
                                    rules: [
                                        {
                                            required: false,
                                            message: "请输入是否部门负责人!"
                                        }
                                    ]
                                })(<Switch />)}
                            </FormItem>
                            {/* <div className="flex"><Button>增加工作岗位</Button></div> */}
                        </Form>
                    </Modal>
                )}
            </div>
        );
    }
}

let NewincumbentModal = Form.create()(IncumbentModal);
export default connect(mapStateToProps)(NewincumbentModal);
