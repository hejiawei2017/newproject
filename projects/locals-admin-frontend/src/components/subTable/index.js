import React, { Component } from 'react'
import { Table, Button, notification, Popconfirm } from 'antd'
import { pageOption, dataFormat, checkType } from '../../utils/utils.js'
import filterChange from '../../utils/filterChange'
import EditLabelModal from "./editModal"
import './index.less'
/*
插件说明：
version：1.0.2

实例： <SubTable {...subTableItem} />
如提前增加 orderBy  需配合 在columns 增加sortOrder: 'descend'
外部调用renderTable 建议用getTableRender 会提前设置loading
参数：
    const columns = [{ // table 表头 和原ants table 类似
            title: 'title',
            dataIndex: 'key',
            width: 100, // 【必选】 如果设置width 表格会对不齐
            valIndex: 'conform', // 【可选】取值的key,会替代dataIndex
            dataType: 'select||time', // 【可选】多选值 select 需配置selectData || time 需配置fmt
            selectData: {...} // 【可选】多选值数组
            fmt: 'YYYY-MM-DD HH:mm:ss' // 转换的时间类型, 默认格式‘YYYY-MM-DD HH:mm:ss’，自定义格式参考moment
            sortOrder: 'descend', // 【可选】 初始化时间倒序，避免分页出现问题
            sorter: true //【可选】 排序 需 sorterKeys  配合使用
            render: this.renderItem // 【可选】不可直接写箭头函数,必须写成class中的方法
        }]
    // 【可选】 配合添加或者修改 基础弹出框
    const editKeys = {
        name: {
            key: 'name',
            label: '标签名称',
            rules:{   // 【可选】 添加修改时限制
                required: true // 必填
            },
            defaultValue:'',
            placeholder:'请输入'
            noVisible: true, // 【可选】底层传值，不显示在页面
        }
    }
    // 整个table 传参
    const subTableItem = {
        // 【必填】获取table数据接口 dataSource 替换接口的数据
        getTableService: articleService.getArticlesLabelTable,
        // 【可选】dataSource 替换接口的数据
        dataSource: dataSource,
        // 【必填】table header
        columns: columns,
        isClosePagination: false, //为true时关闭分页，默认开启
        //【可选】页面显示条数
        pageSize: 30,
        // 【可选】设置ref 可以获取子组件function
        refsTab: function (ref) {
            _this.tableThis = ref
        },
        // 【必填】table rowKey 不可重复，
        rowKey: "id",
        // 【可选】搜索条件 配合search 组件 传值至subtable
        searchFields: _state.searchFields,
         // 【可选】替换接口筛选条件
        getTableServiceData: {},
         // 【可选】排序 配置
        sorterKeys: [{
            key: 'createTime', // 触发columns key
            str: 'create_time' // 转换的 key
        }],
        // 【可选】获取table中的dataSource
        setDataSource = (dataSource) => {
            this.setState({dataSource})
        },
        // 【可选】antd 的 table 参数
        antdTableProps: {
            bordered: true
        },
        // 【可选】 antd的 列表项 是否可选择
        rowSelection: {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            }
        }
        // 【可选】操作按钮
        operatBtn: [{
            label: 'button | delete', // 【必填】button 类型
            size: "small", // 按钮大小
            type: "primary", // 按钮type
            className: 'mr10',
            //【可选】 按钮显示控制
            visible: (record) => record.name,
            onClick: (record) => articleService.deleteArticlesLabel(record.id),
            // 修改弹出框数据
            editKeys: {...editKeys,
                id:{
                    key: 'id',
                    noVisible: true,
                    defaultValue:''
                }},
            // Button 文本
            text: '编辑'
        }],
        operatBtnWidth：100, 【可选】 操作按钮 列 宽度
        operatBtnFixed： 'left | right', 【可选】操作那妞 列 悬浮
        // 【可选】修改按钮 fn
        editFNService: articleService.modifyArticlesLabel,
        // 【可选】修改额外参数
        // editExtraKeys: {key: 123},
        // 【可选】初始 排序 orderBy 字段
        orderBy: 'create_time desc',
        // 【可选】顶部标签Dom
        headerDom: {
            // 自定义其他dom元素，
            otherDom: null,
            // 添加按钮
            addButton:{
                name: '新增标签',
                // 增加弹窗keys
                addKeys: editKeys,
                // 增加额外参数
                extraKeys:{
                    // key: 123
                },
                // 增加fn
                addFN: articleService.addArticlesLabel
            }
        }
        onRow: antd onRow  // 【可选】同antd onRow
        // 【可选】true: 弹窗下使用，false: 普通页面中使用
        isModal: boolean(默认是false)
        // 【可选】 // 设置横向或纵向滚动, 如果 isModal 设置为true 则会被替换
        scroll: {
            x: 100,
            y: 100
        }
    }
*/

class TableForm extends Component {
    constructor (props){
        super(props)
        this.state = {
            loading:true,
            dataSource: [],
            pageNum: pageOption.pageNum,
            pageSize: !!props.pageSize ? props.pageSize : pageOption.pageSize,
            totalCount: 0,
            pageSizeOptions: pageOption.pageSizeOpts,
            orderBy: '',
            editType: 'add',
            modalEditForm: {},
            columns: {},
            operatBtn: {},
            headerDom: {},
            scroll: {},
            isShowTable: false,
            isTableAsync: true,
            isModal: false,
            isChangeScroll: true
        }
    }
    componentWillMount () {
        const { orderBy, refsTab } = this.props
        if(orderBy){
            this.setState({
                orderBy
            })
        }
        this.headerDom = null
        if (refsTab) {
            refsTab(this)
        }
    }
    componentDidMount () {
        this.tableItemEdit(this.props)
        this.tableTypeInit()
    }
    componentWillReceiveProps (nextProps) {
        // console.log('nextProps', nextProps)
        const { isTableAsync, isModal } = this.state
        if (!isTableAsync && !isModal) {
            this.tableTypeInit()
        }
        this.tableItemEdit(nextProps)
    }
    stateChange = (obj, fn) => {
        this.setState(obj, ()=> fn && fn())
    }
    tableTypeInit = () => {
        const { isModal, isTableAsync, isChangeScroll } = this.state
        if (!isModal && isChangeScroll) {
            if (isTableAsync) {
                setTimeout(() => this.setLocation(), 1000)
            } else {
                this.setLocation()
            }
        }
        // this.setState({ isTableAsync: false })
    }
    tableItemEdit = (props) => {
        const {
            columns,
            rowKey,
            searchFields,
            operatBtn,
            headerDom,
            operatBtnWidth,
            operatBtnFixed,
            isModal
            // scroll
            // dataSourceProd
        } = props
        // this.setState({scroll})
        const {
            columns : columns2,
            rowKey : rowKey2,
            searchFields : searchFields2,
            operatBtn : operatBtn2
            // dataSourceProd : dataSourceProd2
            // headerDom : headerDom2
            // columnsMerge: columnsMerge2
        } = this.state
        if (
            JSON.stringify(columns) !== JSON.stringify(columns2) ||
            JSON.stringify(searchFields) !== JSON.stringify(searchFields2) ||
            JSON.stringify(operatBtn) !== JSON.stringify(operatBtn2) ||
            // JSON.stringify(dataSourceProd) !== JSON.stringify(dataSourceProd2) ||
            rowKey !== rowKey2
        ) {
            let pageNum = JSON.stringify(searchFields) !== JSON.stringify(searchFields2) ? 1 : this.state.pageNum
            let columnsMerge = columns
            columnsMerge = this.columnsMerge(columnsMerge, operatBtn, operatBtnWidth, operatBtnFixed, isModal)
            // console.log('columnsMerge',columnsMerge)
            this.setState({
                columns,
                rowKey,
                searchFields,
                operatBtn,
                headerDom,
                columnsMerge,
                pageNum
            }, this.getTableRender)
        }
        headerDom && this.renderHeaderDom(headerDom)
    }
    renderHeaderDom = (headerDom) => {
        const _this = this
        const {addButton: addButtonToH, otherDom} = headerDom
        let addButton = addButtonToH && (
            <Button type="primary" onClick={function (){
                _this.setState({
                    editModalVisible:true,
                    editType: 'add',
                    modalEditForm: {...addButtonToH.addKeys}
                })
            }}
            >{addButtonToH.name}</Button>
        )
        let dom = (
            <div className="mb10 text-right">
                {otherDom && otherDom}
                {addButton}
            </div>
        )
        this.headerDom = dom
    }
    columnsMerge = (columnsMerge,operatBtn,operatBtnWidth,operatBtnFixed,isModal = false) => {
        // table columns 遍历
        const _this = this
        const columns = [...columnsMerge.map(item => {
            if(!item.render) {
                switch (item.dataType) {
                case 'time':
                    item.render = (v,o,i) => {
                        const val = o[item.valIndex || item.dataIndex]
                        const value = dataFormat(val, item.fmt ? item.fmt : 'YYYY-MM-DD HH:mm:ss')
                        return <span key={`table-render-time-${o.dataIndex}-${i}`} title={value}>{value}</span>
                    }
                    break;
                case 'datePicker':
                    item.render = (v,o,i) => {
                        const start = o[item.startIndex || item.dataIndex]
                        const end = o[item.endIndex || item.dataIndex]
                        const startVal = dataFormat(start, item.fmt)
                        const endVal = dataFormat(end, item.fmt)
                        return <span key={`table-render-datePicker-${o.dataIndex}-${i}`} title={startVal + ' - ' + endVal}>{startVal + ' - ' + endVal}</span>
                    }
                    break;
                case 'select':
                    item.render = (v,o,i) => {
                        const val = o[item.valIndex || item.dataIndex]
                        const value = item.selectData[val]
                        return <span key={`table-render-select-${o.dataIndex}-${i}`} title={value}>{value}</span>
                    }
                    break;
                default:
                    item.render = (v,o,i) =>{
                        const val = o[item.valIndex || item.dataIndex]
                        const value = typeof val === "string" ? val.substr(0,50) : val
                        return <div title={val} key={`table-render-button-${o.dataIndex}-${i}`}>{value}</div>
                    }
                    break;
                }
            }
            return item
        })]
        let boxW = document.getElementsByClassName('page-content')[0].offsetWidth - 20
        let tW = this.getTableWidth(columns), realFixed = ''
        if (isModal) {
            this.setState({
                isModal,
                isShowTable: true
            })
        } else {
            if (boxW >= tW) {
                realFixed = false
            } else {
                realFixed = operatBtnFixed
            }
        }
        if(operatBtn && checkType.isArray(operatBtn)){
            columns.push({
                title: "操作",
                width: operatBtnWidth || null,
                fixed: realFixed,
                render: (text, record, index) => (<div key={`operatBtn-${index}${text}`}>
                    {_this.renderButton(record, index, operatBtn)}
                </div>)
            })
        }
        // console.log(boxW, tW, realFixed)
        return columns
    }
    setLocation () { // 设置table scroll:{x, y}
        const { headerDom } = this.props
        const { columns } = this.state
        let scrollX, scrollY
        this.setState({
            isShowTable: true,
            isTableAsync:  false,
            isChangeScroll: false
        }, () => {
            let boxW = document.getElementsByClassName('page-content')[0].offsetWidth - 20
            let boxH = document.getElementsByClassName('page-content')[0].clientHeight + 24
            let tW = this.getTableWidth(columns)
            let tbh = 64 + 34 + 51 + 6
            headerDom && (tbh += 42)
            // console.log('boxW--->', boxW, tW)
            if (boxW >= tW) {
                scrollX = false
            } else {
                scrollX = tW
            }
            if (window.innerHeight <= boxH) {
                scrollY = window.innerHeight - this.getTableTop() - tbh
            } else {
                scrollY = false
            }
            this.setState({
                scroll: {
                    x: scrollX,
                    y: scrollY
                }
            })
        })
    }
    getTableWidth = (columns) => { // 获取 columns 每列的宽度，不设width 默认：100
        let fixedBtnW = (this.props.operatBtnWidth) ? this.props.operatBtnWidth : 0
        let arr = []
        if(columns && columns.length > 0){
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].children) {
                    for (let j = 0; j < columns[i].children.length; j++) {
                        if (columns[i].children[j].width) {
                            arr.push(columns[i].children[j].width)
                        } else {
                            arr.push(100)
                        }
                    }
                } else {
                    if (columns[i].width) {
                        arr.push(columns[i].width)
                    } else {
                        arr.push(100)
                    }
                }
            }
        }
        if (arr.length > 0) {
            return arr.reduce((prev, curr, idx, arr) => prev + curr) + fixedBtnW
        }
    }
    getTableTop = () => { // 获取table 距离顶部距离
        let obj = this.tableBox,
            top = obj.offsetTop,
            parent = obj.offsetParent
        while (parent) {
            top += parent.offsetTop + parent.clientTop
            parent = parent.offsetParent
        }
        return top
    }
    renderButton = (record, index,operatBtn) => {
        const recordData = record
        const _this = this
        // console.log('operatBtn',operatBtn)
        let buttonDom = operatBtn.map((item,i) => {
            const items = {...item}
            if(items.visible && (!items.visible(recordData))){
                return null
            }else{
                // 删除items 属性，避免加入Button
                delete items.visible
            }
            switch (items.label) {
            case 'button':
                let editKeys = items.editKeys
                delete items.editKeys
                return (
                    <Button {...items} onClick={function (){
                        if(items.onClick){
                            items.onClick(record)
                        }else{
                            const modalEditForm = {}
                            for (const key in editKeys) {
                                if (editKeys.hasOwnProperty(key)) {
                                    modalEditForm[key] = {...editKeys[key]}
                                    modalEditForm[key].defaultValue = record[key]
                                }
                            }
                            _this.setState({
                                editType: "edit",
                                editModalVisible: true,
                                editFrom: recordData,
                                modalEditForm
                            })
                        }
                    }} key={`tab-button-${index}-${i}`}
                    >{item.text}</Button>
                )
                break
            case 'delete':
                const onClick = () =>{
                    item.onClick(recordData).then(data => {
                        notification.success({
                            message: '删除成功！'
                        })
                        _this.getTableRender()
                    })
                }
                const buttonItem = {...item,onClick:null}
                return (
                    <Popconfirm title="确定删除?" key={`tab-popconfirm-${index}`} onConfirm={onClick} okText="确认" cancelText="取消">
                        <Button {...buttonItem} type="danger" key={`tab-delect-${index}`}>{item.text || '删除'}</Button>
                    </Popconfirm>
                )
                break
            case 'confirm':
                /**
                 * @author chenbaici
                 * @updateDate 2019-01-25
                 * @describe 增加操作confirm框
                 * */
                const onConfirm = () => {
                    item.onClick(recordData).then(data => {
                        notification.success({
                            message: item.message || '操作成功！'
                        })
                        _this.getTableRender()
                    })
                }
                return (
                    <Popconfirm title={item.title || '确定操作?'} key={`tab-operate-popconfirm-${index}-${item.confirmTitle}`} onConfirm={onConfirm} okText="确认" cancelText="取消">
                        <Button
                            size={item.size}
                            className={item.className}
                            type={item.type}
                            key={`tab-operate-${index}`}
                        >{item.text || '确定操作'}</Button>
                    </Popconfirm>
                )
                break
            default:
                return item.label
                break
            }
        })
        return buttonDom
    }
    getTableRender = () => {
        this.setState({
            loading: true
        }, this.renderTable)
    }
    renderTable = () => {
        const {pageNum, pageSize, orderBy, searchFields} = this.state
        const {getTableService, getTableServiceData, getServiceData, setDataSource} = this.props
        // if(dataSourceProd && dataSourceProd.length > 0 && dataSourceProd[0]){
        //     this.setState({
        //         dataSourceProd,
        //         loading: false
        //     })
        // }else
        if(getTableService){
            let params
            if(getTableServiceData){
                params = getTableServiceData
            }else{
                params = {
                    pageNum: pageNum,
                    pageSize: pageSize
                }
                if(searchFields){
                    searchFields.searchNum >= 0 && (searchFields.searchNum = null)
                    params = {
                        ...params,
                        ...searchFields,
                        urlData:getServiceData
                    }
                }
            }
            orderBy && (params.orderBy = orderBy)
            getTableService(params).then(data=>{
                // console.log('getTableService', this)
                if(data && this){
                    if(checkType.isArray(data)){
                        this.setState({
                            dataSource: data,
                            totalCount: Number(data.total) || 0,
                            loading: false
                        }, this.fixTableFixedCol)
                    }else if(data.list){
                        this.setState({
                            dataSource: data.list,
                            totalCount: Number(data.total) || 0,
                            loading: false
                        }, this.fixTableFixedCol)
                    }else{
                        this.setState({
                            dataSource: [],
                            totalCount: 0,
                            loading: false
                        }, this.fixTableFixedCol)
                    }
                    if (setDataSource) {
                        setDataSource(this.state.dataSource)
                    }
                }else{
                    this.setState({
                        dataSource: [],
                        totalCount: 0,
                        loading: false
                    }, this.fixTableFixedCol)
                }
            }).catch((data)=>{
                this.setState({
                    loading: false
                })
            })
        }else{
            this.setState({
                loading: false
            })
        }
    }
    fixTableFixedCol = () => {
        // 当图片加载完成后撑开列表，触发resize让Table的固定元素重新对齐
        setTimeout( function () {
            window.dispatchEvent(new Event('resize'))
        }, 1000)
    }
    modalEditSave = (value) => {
        // alert(JSON.stringify(value))
        const {editFNService, extraKeys} = this.props
        console.log('modalEditSave', value, editFNService)
        if(editFNService){
            editFNService({...value, ...extraKeys}).then(data=>{
                notification.success({
                    message: '修改成功'
                })
                this.getTableRender()
            }).catch((e) => {
                notification.error({
                    message: '修改失败'
                })
            })
        }
    }
    modalAddSave = (value) => {
        // console.log('modalAddSave', value)
        const {addFN, extraKeys} = this.props.headerDom.addButton
        if(addFN){
            addFN({...value, ...extraKeys}).then(data=>{
                notification.success({
                    message: '增加成功'
                })
                this.getTableRender()
            }).catch((e) => {
                notification.error({
                    message: '增加失败'
                })
            })
        }
    }
    sorterChange = (p, f, sorter) => {
        const keys = this.props.sorterKeys
        const filter = filterChange(this.state.orderBy,sorter, keys)
        if(filter !== false){
            this.setState({
                orderBy: filter,
                pageNum: 1
            }, this.getTableRender)
        }
    }
    render () {
        const { antdTableProps, rowSelection, isClosePagination } = this.props
        const _this = this
        const _state = _this.state
        const {
            dataSource,
            columnsMerge,
            loading,
            rowKey,
            totalCount,
            pageSize,
            pageSizeOptions,
            pageNum,
            isShowTable,
            scroll
        } = _state
        const { dataSource: dataSourceProd, onRow, sorterKeys } = this.props
        const pageObj = {
            total: dataSourceProd ? dataSourceProd.length : totalCount,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: pageSizeOptions,
            current: pageNum,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onShowSizeChange: (current, pageSize) => {
                this.setState({ 'pageNum': 1, pageSize }, this.getTableRender)
            },
            onChange: (value, pageSize) => {
                this.setState({ pageNum: value, pageSize }, this.getTableRender)
            }
        }
        const tableItem = {
            dataSource: dataSourceProd || dataSource,
            columns: columnsMerge,
            loading,
            rowKey,
            pagination: isClosePagination ? false : pageObj
        }
        sorterKeys && (tableItem.onChange = this.sorterChange)
        onRow && (tableItem.onRow = onRow)
        let setTableWidth = this.getTableWidth(columnsMerge)
        // console.log('render', columnsMerge, setTableWidth)
        // console.log('scroll--->', scroll)
        return (
            <div
                className="subTable-prod"
                ref={function (tableBox) {_this.tableBox = tableBox}}
                style={{display: isShowTable ? 'block' : 'none'}}
            >
                {this.headerDom}
                <Table
                    {...tableItem}
                    rowSelection={rowSelection}
                    scroll={scroll}
                    {...antdTableProps}
                >
                </Table>
                {_state.editModalVisible ?
                    <EditLabelModal
                        _data={_state.modalEditForm}
                        editType={_state.editType}
                        stateChange={_this.stateChange}
                        renderTable={_this.renderTable}
                        modalEditSave={_this.modalEditSave}
                        modalAddSave={_this.modalAddSave}
                    />
                    : null}
            </div>
        )
    }
}
export default TableForm
