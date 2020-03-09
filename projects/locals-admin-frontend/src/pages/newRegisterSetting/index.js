import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Popconfirm, message } from "antd";
import Search from "../../components/search";
import { SubTable } from "../../components";
import {
    newIncumbentSettingService,
    newPositionSettingService,
    newOrganizationService
} from "../../services";
import { checkType } from "../../utils/utils";
import { sexMap } from "../../utils/dictionary";
import { setArrayToData } from "../../utils/arrayTransform";
import IncumbentModal from "./modal";
const searchConfig = {
    items: [
        {
            type: "text",
            name: "姓名",
            key: "realName",
            searchFilterType: "string",
            defaultValue: "",
            placeholder: ""
        },{
            type: 'text',
            name: '电话',
            key: 'mobile',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        },{
            type: 'text',
            name: '身份证',
            key: 'idCard',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: ''
        }
    ]
};

const mapStateToProps = (state, action) => {
    return {};
};
class RegisterSetting extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addInfoVisible: false,
            searchFields: {},
            active: 2, // [激活状态]1- 已激活，2- 未激活,
            positionData: [],
            organizationData: []
        };
    }
    componentDidMount () {
        // this.getPositionList();
        // this.getTreeList();
    }
    onSearch = searchFields => {
        this.setState({
            pageNum: 1,
            searchFields: {
                realNameLike: searchFields.realName.value,
                mobile: searchFields.mobile.value,
                idCard: searchFields.idCard.value
            }
        }, this.renderTable);
    };
    changeState = obj => {
        this.setState(obj);
    };
    getPositionList = () => {
        newPositionSettingService
            .getTable({ pageNum: 1, pageSize: 20000 })
            .then(e => {
                let positionData = e.list;
                let positionSelectData = positionData.map(item => {
                    return { value: item.id, text: item.name };
                });
                this.setState({
                    positionData,
                    positionSelectData
                });
            });
    };
    getTreeList = () => {
        newOrganizationService
            .getTable({ pageNum: 1, pageSize: 20000, statusNotEqual: 0 })
            .then(e => {
                let organizationData = setArrayToData(
                    e.list,
                    "parentId",
                    "id",
                    "children",
                    this.changeItem
                );
                this.setState({
                    organizationData
                });
            });
    };
    activeEmployee = id => {
        newIncumbentSettingService
            .activeEmployee(id)
            .then(e => {
                message.success('激活成功')
                this.tableThis.renderTable();
            })
            .catch(e => {
                // message.error('激活失败')
                this.tableThis.renderTable();
            });
    };
    changeItem = item => {
        return {
            value: item.id,
            label: item.name
        };
    };
    submitInfoChangeTable = () => {
        this.setState(
            {
                addInfoVisible: false
            },
            () => {
                this.tableThis.renderTable();
            }
        );
    };
    render () {
        let _this = this;
        let _state = this.state;
        const columns = [
            {
                title: "员工编号",
                dataIndex: "memberCode",
                key: "memberCode",
                width: 100
            },
            {
                title: "姓名",
                dataIndex: "realName",
                key: "realName",
                width: 100
            },
            {
                title: "部门",
                dataIndex: "organizations",
                key: "organizations",
                width: 200,
                render: v => {
                    if (checkType.isArray(v)) {
                        return v.map((i, index) => {
                            return (
                                <p
                                    className="mb5"
                                    key={`organizations-${i.id}-${index}`}
                                >
                                    {i.fullName}
                                </p>
                            );
                        });
                    }
                }
            },
            {
                title: "工作地点",
                dataIndex: "workplace",
                key: "workplace",
                width: 100
            },
            {
                title: "职位",
                dataIndex: "positions",
                key: "positions",
                width: 100,
                render: v => {
                    if (checkType.isArray(v)) {
                        return v.map((i, index) => {
                            return (
                                <p
                                    className="mb5"
                                    key={`positions-${i.id}-${index}`}
                                >
                                    {i.name}
                                </p>
                            );
                        });
                    }
                }
            },
            {
                title: "性别",
                dataIndex: "sex",
                key: "sex",
                width: 80,
                dataType: "select",
                selectData: sexMap
            },
            {
                title: "身份证",
                dataIndex: "idCard",
                key: "idCard",
                width: 180
            },
            {
                title: "私人邮箱",
                dataIndex: "privateEmail",
                key: "privateEmail",
                width: 100
            },
            {
                title: "联系电话",
                dataIndex: "mobile",
                key: "mobile",
                width: 140
            },
            {
                title: "学历",
                dataIndex: "education",
                key: "education",
                width: 100
            },
            {
                title: "公司邮箱",
                dataIndex: "companyEmail",
                key: "companyEmail",
                width: 100
            },
            {
                title: "入职时间",
                dataIndex: "inductionTime",
                key: "inductionTime",
                width: 120,
                dataType: "time",
                fmt: "YYYY-MM-DD"
            },
            {
                title: "合同转正时间",
                dataIndex: "contractPositiveTime",
                key: "contractPositiveTime",
                width: 120,
                dataType: "time",
                fmt: "YYYY-MM-DD"
            },
            {
                title: "合同到期时间",
                dataIndex: "contractExpireTime",
                key: "contractExpireTime",
                width: 120,
                dataType: "time",
                fmt: "YYYY-MM-DD"
            },
            {
                title: "操作",
                dataIndex: "",
                key: "",
                fixed: "right",
                width: 100,
                render: (v, record) => {
                    if (!record.positions || record.positions.length === 0) {
                        record.positions = [{}];
                    }
                    if (
                        !record.organizations ||
                        record.organizations.length === 0
                    ) {
                        record.organizations = [{}];
                    }
                    return (
                        <Popconfirm
                            title="是否激活?"
                            key={`tab-popconfirm-${v}`}
                            onConfirm={function () {
                                _this.activeEmployee(record.id);
                            }}
                            okText="激活"
                            cancelText="取消"
                        >
                            <Button
                                className="mr10"
                                size="small"
                                type="primary"
                            >
                                激活
                            </Button>
                        </Popconfirm>
                    );
                }
            }
        ];
        const subTableItem = {
            getTableService: newIncumbentSettingService.getTableJobStatus,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref;
            },
            rowKey: "id",
            searchFields: {
                ..._state.searchFields,
                active: _state.active
            }
            // operatBtn: [{
            //     label: 'delete',
            //     size: "small",
            //     fixed: 'right',
            //     onClick: (record) => newIncumbentSettingService.activeEmployee(record.id),
            //     text: '激活'
            // }]
            // orderBy: 'create_time desc'
        };
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <SubTable {...subTableItem} />
                {_state.addInfoVisible && (
                    <IncumbentModal
                        editInfoData={_state.avtiveData}
                        addInfoVisible={_state.addInfoVisible}
                        positionData={_state.positionData}
                        organizationData={_state.organizationData}
                        changeState={this.changeState}
                        submitInfoChangeTable={this.submitInfoChangeTable}
                    />
                )}
            </div>
        );
    }
}

let NewRegisterSetting = Form.create()(RegisterSetting);
export default connect(mapStateToProps)(NewRegisterSetting);
