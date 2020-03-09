import React, {PureComponent, Fragment} from 'react'
import {Modal, Table, message, Checkbox } from 'antd'
import moment from 'moment'
import {landlordService} from '../../services'


class DetailModal extends PureComponent {
    constructor (props){
        super(props)
        this.state = {
            tableData: []
        }
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount () {
        const { examItems, examAnswer } = this.props.checkItem
        const { id } = examAnswer
        this.setState({
            loading: true
        })
        landlordService.getExamAnswer({
            examAnswerId: id
        }).then((data) =>{
            let totalItem = {
                desc: '总分',
                id: '441231412412414'
            }
            data.forEach((item) => {
                item.examItemAnswers.forEach((ite) => {
                    examItems.forEach((it) => {
                        if(ite.examItemId === it.id){
                            if(ite.reviewState === 1){
                                it.firstScore = ite.desc
                            }else if(ite.reviewState === 2){
                                it.secondScore = ite.desc
                            }
                        }
                    })
                })
                if(item.examItemAnswers[0].reviewState === 1){
                    totalItem.firstScore = item.totalScore
                }else if(item.examItemAnswers[0].reviewState === 2){
                    totalItem.secondScore = item.totalScore
                }
            })
            let examItemsAry = examItems.concat([totalItem])
            this.setState({
                tableData: examItemsAry,
                loading: false
            })
        }).catch((e)=>{
            message.error(e.errorDetail)
        })
    }
    onSubmit = () => {
        const {validateFields} = this.props.form
        validateFields((error, values) => {
            values.examId = this.state.examId
            this.props.onSubmit(values)
        })
    }
    render () {
        const self = this
        const { handleCancel, month, detailVisible, checkItem} = this.props
        const assistantName = checkItem.info.assistantName || '无'
        const realName = checkItem.examAnswer.realName || '无'
        const buName = checkItem.info.buName || '无'
        const houseTotal = checkItem.info.houseTotal || '0'
        const {tableData, loading} = this.state
        const columns = [
            {
                title: '评分维度',
                dataIndex: 'desc',
                width: '200px'
            },
            {
                title: '首次评分',
                dataIndex: 'firstScore'
            },
            {
                title: '追加评分',
                dataIndex: 'secondScore'
            }
        ]
        return (
            <Modal
                title="评分详情"
                width={1000}
                visible={detailVisible}
                onCancel={handleCancel}
                destroyOnClose
                footer={null}
            >
                <p style={{padding: '0 0 15px 15px', fontSize: '13px'}}>管家：{assistantName}&nbsp;&nbsp;&nbsp;&nbsp;管理{houseTotal}套房源&nbsp;&nbsp;&nbsp;&nbsp;所属BU：{buName}&nbsp;&nbsp;&nbsp;&nbsp;房东：{realName}&nbsp;&nbsp;&nbsp;&nbsp;{month}</p>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={tableData}
                    rowKey={function (record, index) {
                        return record.id + index
                    }}
                    pagination={false}
                />
            </Modal>
        )
    }
}

export default DetailModal
