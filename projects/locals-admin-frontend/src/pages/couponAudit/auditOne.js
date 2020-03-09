import React, { PureComponent,Fragment} from 'react'
import { SearchParent } from '../../components/index'
import {Table,Button,Popconfirm,message} from 'antd'
import OperateModal from './operateModal'
import {pageOption, dataFormat} from "../../utils/utils"
import {couponAuditerService} from '../../services'


const searchConfig = {
    items: [{
        type: 'text',
        name: '审核人姓名',
        key: 'name',
        searchFilterType: 'string',
        defaultValue: ''
    }]
}
class AuditOne extends PureComponent{
    constructor (props){
        super(props);
        this.state = {
            loading : false,
            visible:false,
            title:'',
            pageNum: pageOption.pageNum,
            pageSize: pageOption.pageSize,
            pageSizeOptions: pageOption.pageSizeOptions,
            total:0,
            nameLike:null,
            editContent:null
        }
        this.OperateModal = this.OperateModal.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSearch = this.onSearch.bind(this)
    }
    componentDidMount = () => {
      this.getAuditList()
    }
    OperateModal = (type,id) => () =>{
        this.setState({
            visible:true,
            title :'添加审核人',
            editContent:null
        })
    }
    update = (v) => () =>{
        this.setState({
            editContent:v,
            visible:true,
            title :'编辑审核人'
        })
    }
    onDetele = (id) => () =>{
        couponAuditerService.deleteAudit(id).then((data)=>{
            if(data === 1){
                message.success('删除成功')
                this.getAuditList()
            }
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    }
    onCancle = () =>{
        this.setState({
            visible:false
        })
    }
    onSubmit = (err,value) =>{
        let params = {
            grade:1,
            ...value
        }
        if(this.state.editContent === null){ //添加审核人
            couponAuditerService.addAudit(params).then((data)=>{
                if(data === 1){
                    this.setState({
                        visible:false
                    },()=>{
                        message.success('添加成功')
                        this.getAuditList()
                    })
                }
            }).catch(e=>{
                message.error(e.errorDetail)
            })
        }else{
            params.id = this.state.editContent.id
            couponAuditerService.putAudit(params).then((data)=>{
                if(data === 1){
                    this.setState({
                        visible:false
                    },()=>{
                    message.success('修改成功')
                    this.getAuditList()
                    })
                }
            }).catch(e=>{
                message.error(e.errorDetail)
            })
        }
    }
    onSearch = (value) =>{
        this.setState({
            nameLike:value.name.value
        },()=>{
            this.getAuditList()
        })
    }
    getAuditList = () =>{
        const params = {
            orderBy: 'create_time desc',
            pageNum:this.state.pageNum,
            pageSize:this.state.pageSize,
            nameLike:this.state.nameLike,
            grade:1
        }
        couponAuditerService.getAuditList(params).then((data)=>{
            this.setState({
                dataSource:data.list,
                total:data.total,
                loading:false
            })
        }).catch(e=>{
            message.error(e.errorDetail)
        })
    }
    render (){
        const colums = [{
            title:'userId',
            dataIndex:'userId'
        },{
            title:'手机号',
            dataIndex:'mobile'
        },{
            title:'姓名',
            dataIndex:'name'
        },{
            title:'添加人',
            dataIndex:'creator'
        },{
            title:'添加时间',
            render :(v,r)=>{
                return <span>{dataFormat(r.createTime)}</span>
            }
        },{
            title:'更改人',
            dataIndex:'updator'
        },{
            title:'更新时间',
            render :(v,r)=>{
                return <span>{dataFormat(r.timeVersion)}</span>
            }
        },{
            title:'操作',
            render: (v,record)=>{
                const commonBtn = {
                    className: 'mr-sm',
                    type: 'primary',
                    size: 'small'
                };
                return <Fragment>
                    <Button
                        {...commonBtn}
                        onClick={this.update(record)}
                    >编辑</Button>
                    <Popconfirm title="确认删除?" onConfirm={this.onDetele(record.id)} okText="确认" cancelText="取消">
                        <Button
                            {...commonBtn}
                            type="danger"
                        >删除</Button>
                    </Popconfirm>
                </Fragment>
            }
        }]
        const { pageSize, pageSizeOptions, pageNum ,total} = this.state;
        const pagination = {
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            onShowSizeChange: (current, pageSize) => {
                console.log(current,pageSize)
                this.setState({ pageNum: 1, pageSize:pageSize },()=>{ this.getAuditList()})
            },
            onChange: (value, pageSize) => {
                this.setState({
                    pageNum: value,
                    pageSize:pageSize
                },()=>{this.getAuditList()})
            }
        }
        return(
            <Fragment>
                <SearchParent
                    onSubmit={this.onSearch}
                    config={searchConfig}
                />
                <div className="pt10 mb10 text-right">
                    <Button
                        type="primary"
                        onClick={this.OperateModal()}
                    >创建新审核人</Button>
                </div>
                <Table
                    dataSource={this.state.dataSource}
                    columns={colums}
                    loading={this.state.loading}
                    rowKey={'userId'}
                    pagination={pagination}
                />
                <OperateModal
                    title = {this.state.title}
                    visible = {this.state.visible}
                    onCancel={this.onCancle}
                    onSubmit = {this.onSubmit}
                    editContent = {this.state.editContent}
                />
            </Fragment>
        )
    }
}

export default AuditOne