import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import {bannerService} from '../../services'
import { Button } from 'antd'
import Search from '../../components/search'
import SubTable from '../../components/subTable/index'
import {dataFormat, getNewImagePrefix} from '../../utils/utils.js'
import { bannerPlatform, adsType, bannerLocation } from '../../utils/dictionary'
import './index.less'

let platformOptions = []
for (const key in bannerPlatform) {
    platformOptions.push({value: key, text: bannerPlatform[key]})
}
const searchConfig = {
    items: [
        {
            type: 'text',
            name: '标题名称',
            key: 'titleLike',
            searchFilterType: 'string',
            defaultValue: '',
            placeholder: '请输入标题名称'
        }, {
            type: 'select',
            name: '平台类型',
            key: 'platformIn',
            defaultValue: platformOptions[0].value,
            selectData: platformOptions,
            renderSelectData: bannerPlatform,
            searchFilterType: 'select',
            placeholder: '请输入平台类型'
        }
    ],
    export: {
        name: 'banner列表'
    }
}

class BannerList extends Component {
    constructor (){
        super()
        this.state = {
            searchFields: {
                platformIn: 'APP3,APP,MINI,H5,PC'
            }
        }
    }
    renderTable = () => {
        this.tableThis.renderTable()
    }
    onSearch = (searchFields) => {
        this.setState({
            searchFields:{
                titleLike: searchFields.titleLike.value,
                platformIn: searchFields.platformIn.value,
                searchNum: (this.state.searchFields.searchNum || 0) + 1
            }
        }, this.renderTable)
    }
    render () {
        const _this = this
        const columns = [{
            title: '标题',
            width: 200,
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '广告图片',
            dataIndex: 'imagePath',
            key: 'imagePath',
            width: 200,
            render: val => <img className="adsImg" src={getNewImagePrefix(val)} alt="加载失败..." />
        },{
            title: '广告类型',
            dataIndex: 'type',
            width: 200,
            render: val => <span>{adsType[val]}</span>
        },{
            title: '平台类型',
            dataIndex: 'platform',
            width: 200,
            render: val => <span>{bannerPlatform[val]}</span>
        },{
            title: '位置',
            dataIndex: 'location',
            width: 200,
            render: val => <span>{bannerLocation[val]}</span>
        },{
            title: '关联图文ID',
            dataIndex: 'articleId',
            width: 200,
            key: 'articleId'
        }, {
            title: '关联链接',
            dataIndex: 'url',
            key: 'url',
            width: 200
        }, {
            title: '描述',
            dataIndex: 'description',
            width: 200,
            key: 'description'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 200,
            sorter: true,
            render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>
        }]
        const subTableItem = {
            getTableService: bannerService.getActAds,
            searchFields: this.state.searchFields,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "id",
            operatBtn: [{
                label: 'button',
                size: "small",
                className: 'mt10 mr5',
                type: "primary",
                onClick: record => {
                    return _this.props.history.push(`/application/activityList/edit/${record.id}`);
                },
                text: '修改'
            },{
                label: 'delete',
                size: "small",
                className: 'mt10',
                type: "delete",
                onClick: record => {
                    return bannerService.deleteActAds(record.id)
                },
                text: '删除'
            }],
            operatBtnWidth: 150
        }

        return (
            <div className="banner-list">
                <Search onSubmit={this.onSearch} config={searchConfig} />
                <div className="text-right pt10 mb10">
                    <Link to="/application/activityList/add">
                        <Button type="primary">新增</Button>
                    </Link>
                </div>
                <SubTable {...subTableItem} />
            </div>
        )
    }
}
export default withRouter(BannerList)
