import React, { Component } from 'react'
import { articleManageService } from '../../../services'
import Search from '../../../components/search'
import { Table, Button, message ,Spin} from 'antd'
import { pageOption } from '../../../utils/utils.js'
import EditLabelModal from './editModal'
import moment from 'moment'



const searchConfig = {
    expand: false,
    items: [
        {
            type: 'text',
            name: '素材名称',
            key: 'name',
            defaultValue: '',
            placeholder: '请输入关键字'
        },
        {
            type: 'text',
            name: '素材标题',
            key: 'title',
            defaultValue: "",
            placeholder: '请输入关键字'
        },
        {
            type: 'text',
            name: '作者',
            key: 'author',
            defaultValue: "",
            placeholder: '请输入关键字'
        }

    ]
}

class articleManage extends Component {
    constructor() {
        super()
        this.state = {
            tableData: [],
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            total: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            categoryId: '',
            status: '',
            isSearch: '',
            termOfValidity: '',
            name: '',
            editModalVisible: false,
            editFrom: {},
            searchFields: {},
            orderBy: '',
            curDataSource: [],
            selectTarget: {},
            labelList:[],//标签列表
            selectItems: [],//选中的标签
        }
        this.tableThis = null
        this.modalEditSave = this.modalEditSave.bind(this)
    }
    componentDidMount() {
        //1.加载文章列表
        this.getMaterialsList()
         //2.加载标签列表
        this.getLabelsNoloading()
    }
    getMaterialsList = () => {
        this.setState({loading:true})
        const { pageNum, pageSize, name,title,author } = this.state;
        let params = {
            pageNum: pageNum,
            pageSize: pageSize
        }
     
        name && (params.name = name)
        title && (params.title = title)
        author && (params.author = author)
        articleManageService.getMaterialsList(params).then((data) => {
            this.setState({
                pageNum: data.pageNum,
                tableData: data.list,
                total: data.total,
                loading: false
            })
            this.setState({loading:false})
        }).catch((e) => {
            message.error(e.errorDetail)
            this.setState({loading:false})
        })
    }
    getLabelsNoloading(){
        if(this.state.labelList.length>0){
            return
        }
        articleManageService.getLabels().then((data) => {
            let arr = data.list.map((item) => {
                return {
                    id: item.id,
                    name: item.name
                }
            })
            this.setState({
                labelList: arr||[]
            })
          
        }).catch((e) => {
            message.error(e.errorDetail)
        })
    }
    getLabels = (callback) => {
        if(this.state.labelList.length>0){
            return
        }
        this.setState({loading:true})
        articleManageService.getLabels().then((data) => {
            let arr = data.list.map((item) => {
                return {
                    id: item.id,
                    name: item.name
                }
            })
            this.setState({
                labelList: arr||[],
                loading:false
            },()=>{
                if(callback){
                    callback(()=>{
                        this.setState({loading:false})
                    });
                }
            })
          
        }).catch((e) => {
            message.error(e.errorDetail)
            this.setState({loading:false})
        })
    }
    onSearch = (searchFields) => {
        console.log(searchFields, "searchFields")
        this.setState({
            pageNum: 1,
            author: searchFields.author.value,
            title: searchFields.title.value,
            name: searchFields.name.value
        }, () => { this.getMaterialsList() })
    }
    handleCancel = (bol) => {
        this.setState({
            editModalVisible: bol
        })
    }
    modalEditSave = (values) => {
        //提交发送素材
        articleManageService.postSelectItems(this.state.selectTarget,values).then(()=>{
            this.setState({editModalVisible:false})
            this.getMaterialsList()
        }).catch((e)=>{
            message.error(e.errorDetail)
            this.setState({editModalVisible:false})
        })
    }

    editOperate = (selectTarget) => {//打开弹框
         //2取得已经发布的标签
        //测试数据选中的列表
        let selectItems = [{ id: 1 }, { id: 2 }];
        if(this.state.labelList.length==0){

            this.getLabels((fn)=>{
                this.setState({
                    editModalVisible: true,
                    curDataSource: [...this.state.labelList],
                    selectItems: [...selectItems],
                    selectTarget: selectTarget
                },()=>{
                    fn && fn()
                })
            });
        }else{
            this.setState({
                editModalVisible: true,
                curDataSource: [...this.state.labelList],
                selectItems: [...selectItems],
                selectTarget: selectTarget
            })
        }
    }

    render() {
        const _this = this
        const _state = this.state
        const { pageSize, pageSizeOptions, pageNum, total } = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ pageNum: 1, pageSize: pageSize }, () => { this.getMaterialsList() })
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize: pageSize
                }, () => { this.getMaterialsList() })
            }
        }
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                width: 150
            },
            {
                title: '标题',
                dataIndex: 'title',

                width: 150
            },
            {
                title: '作者',
                dataIndex: 'author',
                width: 150
            },
            {
                title: '摘要',
                dataIndex: 'digest',
                width: 150
            },
            // {
            //     title: '图片',
            //     dataIndex: 'url',
            //     width: 150,
            //     render:function(text,record){
            //         return <img class="article-item-img" src={text}></img>

            //     }
            // },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                render: function (text, record) {
                    return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
                },
                width: 200
            }, {
                title: '操作',
                dataIndex: 'operate',
                width: 100,
                render: (text, record) => <Button className="editoperate-btn" type="primary" onClick={function () { _this.editOperate(record) }}>{'选择标签发送'}</Button>
            }]
        return (
            <Spin spinning={this.state.loading} delay={500}>
            <div>
                {
                     <Search onSubmit={this.onSearch} config={searchConfig} />
                }
                <div className="mb10 text-right">
                </div>
                <Table
                    columns={columns}
                    dataSource={_state.tableData}
                    pagination={pagination}
                    rowKey="id"
                />
                <EditLabelModal
                    editModalVisible={_state.editModalVisible}
                    handleCancel={this.handleCancel}
                    labelItems={this.state.curDataSource}
                    selectItems={this.state.selectItems}
                    modalEditSave={_this.modalEditSave}
                    selectTarget={_this.state.selectTarget}

                />
            </div>
            </Spin>
        )
    }
}

export default articleManage
