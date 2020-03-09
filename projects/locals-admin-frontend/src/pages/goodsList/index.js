import React, {Component} from 'react'
import SubTable from '../../components/subTable'
import {goodsListService} from '../../services'
import {dataFormat, envConfig} from "../../utils/utils";
import TableTooltip from '../../components/tableTooltip'
import {Button, Switch} from 'antd'
import {connect} from "react-redux"
import EditModal from './editModal'
import SettingModal from './settingModal'
import Global from '../../utils/Global'
import {message} from "antd/lib/index";
import downloadImageFile from '../../utils/downloadFile'
import {createUUID} from "../../utils/utils";

import Search from '../../components/search'

const mapStateToProps = (state, action) => {
    return {
        wxAccessToken: state.wxAccessToken
    }
}

const defaultFormParams = {
    title: null,
    supplierPrice: null,
    id: null,
    retailPrice: null,
    orginalPrice: null,
    pictureUrl: null,
    detailUrlList: null,
    stickType: 0,
    supplierId: null,
    goodsImageList: [],
    goodsStatus: 1 //1为下架，2为上架
}
const defaultSettingFormParams = {
    channel: '',
    way: '',
    levelOne: true,
    levelTwo: true,
    levelOnePrice: 0,
    levelTwoPrice:  0,
    calculate:  '',
    goodsId: ''
}

let searchConfig = {
    items: [
        {
            type: 'text',
            name: '商品名称',
            key: 'title',
            searchFilterType: 'string',
            placeholder: '请输入商品名称'
        },
        {
            type: 'text',
            name: '供应商名称',
            key: 'name',
            searchFilterType: 'string',
            placeholder: '请输入供应商名称'
        }
    ],
    export: {
        name: '商品列表数据'
    }
}
class GoodsList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            formParams: null,
            formSettingParams: JSON.parse(JSON.stringify(defaultSettingFormParams)),
            dataSource: null,
            currentGoodsInfo: null,
            editModalVisible: false,
            settingModalVisible: false,
            searchFields: {},
            settingType: 'profits', // value = 'profits' or 'personalized'
            editType: 'add', // value = 'add' or 'edit'
            userInfo: Global.userInfo || {
                userName: ''
            }
        }
        this.onChangeSwitch = this.onChangeSwitch.bind(this)

    }

    stateChange = (obj, fn) => {
        this.setState(obj, () => fn && fn())
    }
    onSearch = (searchFields) => {
        try {
            this.setState({
                searchFields:{
                    title: searchFields.title.value,
                    name: searchFields.name.value,
                    searchNum: (this.state.searchFields.searchNum || 0) + 1
                }
            }, () => {
                this.renderTable()
            })
        }catch (e) {
            console.log(e)
        }

    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    handleSubmit = (data) => {
        try {
            let that = this;
            let detailUrlList = [];
            data.detailUrlList && data.detailUrlList.forEach((item,index) => {
                detailUrlList.push({
                    imgUrl: item.url,
                    displayPriority: index
                })
            });
            const obj = {
                goods: {
                    title: data.title,
                    supplierPrice: data.supplierPrice,
                    retailPrice: data.retailPrice,
                    pictureUrl: data.pictureUrl,
                    supplierId: data.supplierId,
                    orginalPrice: data.orginalPrice,
                    stickType: data.stickType !== 0 ? data.stickType : null
                },
                detailUrlList
            };

            if (that.state.editType === 'add') {
                let goodList = [];
                goodList.push(obj);
                goodsListService.add({
                    goodList
                }).then((e) => {
                    message.success('添加成功！')
                    that.setState({
                        editModalVisible: false
                    }, () => {
                        that.renderTable();
                    })
                })
            } else {

                let goodList = [];
                obj.goods.id = data.id;
                obj.goods.inventory = data.inventory;
                obj.goods.goodsStatus = data.goodsStatus;
                obj.goods.updator = data.updator;

                goodList.push(obj);
                console.log(goodList)
                goodsListService.update({
                    goodList
                }).then((e) => {
                    message.success('修改成功！')
                    that.setState({
                        editModalVisible: false
                    }, () => {
                        that.renderTable()
                    })
                })
            }
        }catch (e) {
            console.log(e)
        }
    }
    //提交设置
    handleSettingSubmit = (data) => {
        let that = this;
        goodsListService.setProfits(data).then((e) => {
            message.success('设置成功！');
            that.setState({
                settingModalVisible: false
            }, () => {
                that.renderTable()
            })
        })

    }

    //获取商品利润分成信息
    getGoodsDividedData = (res,goodsId) => {
        let params = JSON.parse(JSON.stringify(defaultSettingFormParams))
        if(res !== null){
            params.levelOne = res.levelOne !== null && res.levelOne === 1
            params.levelTwo = res.levelTwo !== null && res.levelTwo === 1
            params.levelOnePrice = res.levelOnePrice !== null ? res.levelOnePrice : ''
            params.levelTwoPrice = res.levelTwoPrice !== null ? res.levelTwoPrice : ''
            params.calculate = res.calculate !== null ? res.calculate : ''
            params.channel = res.channel !== null ? res.channel : ''
            params.way = res.way !== null ? res.way : ''
        }
        params.goodsId = goodsId
        return params

    }
    onChangeSwitch = (record) => {
        if(!record.profits){
            message.warning('请设置商品利润分成再进行操作', 3);
            return;
        }
        let data = {
            title: record.title,
            supplierPrice: record.supplierPrice,
            id: record.id,
            retailPrice: record.retailPrice,
            pictureUrl: record.pictureUrl,
            supplierId: record.supplierId,
            inventory: record.inventory,
            goodsStatus: record.goodsStatus === 1 ? 2 : 1,
            updator: this.state.userInfo.username,
            detailUrlList: record.imgList,
            orginalPrice: record.orginalPrice,
            stickType: record.stickType
        }
        this.setState({
            editType: 'edit'
        },() => {
            this.handleSubmit(data)
        })
    }
    handleAddGoodsParams = () => {
        this.stateChange({
            editModalVisible: true,
            editType: 'add',
            formParams: JSON.parse(JSON.stringify(defaultFormParams))
        })
    }

    render () {
        let that = this
        const columns = [
            {title: '商品名称', dataIndex: 'title', key: 'title', render:(v) =>{
                return <TableTooltip content={v} width={150}/>
            }},
            {title: '供应商名称', dataIndex: 'name', key: 'name'},
            {title: '供应商电话', dataIndex: 'phone', key: 'phone'},
            {title: '实际售价', dataIndex: 'retailPrice', key: 'retailPrice'},
            {title: '原价', dataIndex: 'orginalPrice', key: 'orginalPrice'},
            {title: '供应价', dataIndex: 'supplierPrice', key: 'supplierPrice'},
            {title: '标识', dataIndex: 'stickType', key: 'stickType', width: '5%', render: (val,record) => {
                let str = '';
                if(val === 11) {
                    str = 'new';
                }else if(val === 22) {
                    str = 'hot';
                }
                return <span>{str}</span>
            }},
            {title: '最新修改时间', dataIndex: 'timeVersion', exportType: 'date', key: 'timeVersion', width: '7%', render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>},
            {title: '状态', dataIndex: 'goodsStatus', exportType: 'none', width: '7%', render: (val,obj) =>
                <Switch
                    checkedChildren={obj.goodsStatus === 2 ? '上' : ''}
                    unCheckedChildren={obj.goodsStatus === 1 ? '下' : '' }
                    checked={obj.goodsStatus === 2}
                    onChange={function () {
                        that.onChangeSwitch(obj)
                    }}
                />
            }
        ];
        searchConfig.columns = columns
        const subTableItem = {
            getTableService: goodsListService.getTable,
            searchFields: this.state.searchFields,
            columns: columns,
            antdTableProps: {
                scroll: {
                    x: 1200
                }
            },
            refsTab: function (ref) {
                that.tableThis = ref
            },
            setDataSource: (dataSource) => {
                dataSource = JSON.parse(JSON.stringify(dataSource))
                dataSource.forEach((item, index)=>{
                    item.length = index + 1
                })
                this.setState({dataSource})
            },
            rowKey: "id",
            operatBtn: [
                {
                    label: 'button',
                    size: "small",
                    className: 'mt10 mr10',
                    type: "primary",
                    onClick: record => {
                        let detailUrlList = [];
                        record.imgList.forEach((item,index) => {
                            detailUrlList.push({
                                uid: index,
                                url: item.imgUrl
                            })
                        });
                        let goodsImageList = [];
                        goodsImageList.push({
                            uid: createUUID('xxxxxxxxxxxxxxxx',10),
                            url: record.pictureUrl
                        })
                        that.setState({
                            editModalVisible: true,
                            editType: 'edit',
                            formParams: {
                                title: record.title,
                                supplierPrice: record.supplierPrice,
                                id: record.id,
                                retailPrice: record.retailPrice,
                                pictureUrl: record.pictureUrl,
                                orginalPrice: record.orginalPrice,
                                supplierId: record.supplierId,
                                inventory: record.inventory,
                                goodsStatus: record.goodsStatus,
                                stickType: record.stickType !== null ? record.stickType : 0,
                                detailUrlList: detailUrlList,
                                goodsImageList: goodsImageList
                            }
                        })
                    },
                    text: '修改'
                }, {
                    label: 'button',
                    size: "small",
                    className: 'mt10 mr10',
                    type: "primary",
                    onClick: (record) => {
                        goodsListService.getProfits(record.id).then((res) => {
                            let params = that.getGoodsDividedData(res,record.id);
                            that.setState({
                                settingModalVisible: true,
                                settingType: 'profits',
                                currentGoodsInfo: record,
                                formSettingParams: params
                            })
                        })
                    },
                    text: '利润分成设置'
                }, {
                    label: 'button',
                    size: "small",
                    className: 'mt10 mr10',
                    type: "primary",
                    onClick: (record) => {
                        goodsListService.getProfits(record.id).then((res) => {
                            let params = that.getGoodsDividedData(res,record.id);

                            that.setState({
                                settingModalVisible: true,
                                settingType: 'personalized',
                                currentGoodsInfo: record,
                                formSettingParams: params
                            })
                        })
                    },
                    text: '个性化配置'
                },
                {
                    label: 'button',
                    size: "small",
                    className: 'mt10 mr10',
                    type: "primary",
                    onClick: (record) => {
                        goodsListService.getWechatQRCode({
                            appId: 'wx8df08cff87adcc4b',
                            secret: '4dc526e9bbbde92445d87ab2970485c6',
                            scene: 'goodsId=' + record.id,
                            page: 'pages/purchase/index',
                            width: 450,
                            autoColor: false,
                            lineColor: {"r":"0","g":"0","b":"0"},
                            isHyaline: false
                        }).then((res) => {
                            let imgUrl = envConfig.newImagePrefix + res
                            downloadImageFile.download(imgUrl,'路客扫码购小程序二维码（' + record.title + '）')
                        })
                    },
                    text: '下载二维码'
                },
                {
                    label: 'delete',
                    size: "small",
                    className: 'mt10 mr10',
                    type: "primary",
                    onClick: record => {
                        return goodsListService.del(record.id)
                    },
                    text: '删除'
                }],
            operatBtnWidth: 200
        };
        return (
            <div>
                <Search onSubmit={this.onSearch} config={searchConfig} dataSource={this.state.dataSource}/>
                <div className="text-right padder-v-sm">
                    <Button type="primary"
                            onClick={this.handleAddGoodsParams}
                    >新增商品</Button>
                </div>
                <SubTable
                    {...subTableItem}
                />
                {this.state.editModalVisible ?
                    <EditModal
                        handleSubmit={this.handleSubmit}
                        stateChange={this.stateChange}
                        formParams={this.state.formParams}
                        editType={this.state.editType}
                        editModalVisible={this.state.editModalVisible}

                    /> : null
                }
                {this.state.settingModalVisible ?
                    <SettingModal
                        settingType={this.state.settingType}
                        formSettingParams={this.state.formSettingParams}
                        settingModalVisible={this.state.settingModalVisible}
                        currentGoodsInfo={this.state.currentGoodsInfo}
                        handleSettingSubmit={this.handleSettingSubmit}
                        stateChange={this.stateChange}
                    /> : null
                }
            </div>
        )
    }
}


export default connect(mapStateToProps)(GoodsList)
