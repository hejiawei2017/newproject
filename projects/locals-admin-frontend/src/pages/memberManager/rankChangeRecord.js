import React, { Component } from 'react'
import { aummerActivityService } from '../../services'
import { SubTable } from '../../components'
import { memberLevelMap } from '../../utils/dictionary'
import { dataFormat } from '../../utils/utils'
import './index.less'
class rankModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
            conform: null,
            dateString: null,
            num:0
        }
    }
    cancelModal = () =>{}
    submitModal = () =>{}
    render () {
        const _this = this
        const {editFrom} = this.props
        const {
            userId
        } = editFrom
        const columns = [
            {
                title: '会员等级',
                dataType: 'select',
                dataIndex: 'memberCardCode',
                selectData: memberLevelMap,
                width: 200
            }, {
                title: '升级时间',
                dataIndex: 'timeVersion',
                render: val => <span>{dataFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
                width: 200
            }, {
                title: '变更有效期',
                dataIndex: 'validTimeStart',
                startIndex: 'validTimeStart',
                endIndex: 'validTimeEnd',
                dataType: 'datePicker',
                fmt: 'YYYY-MM-DD',
                width: 200
            }, {
                title: '操作者',
                dataIndex: 'updator',
                width: 200
            }
        ]
        const subTableItem = {
            getTableService: aummerActivityService.getRankRecord,
            getTableServiceData: userId,
            columns: columns,
            refsTab: function (ref) {
                _this.tableThis = ref
            },
            antdTableProps: {
                bordered: true
            },
            rowKey: "id"
            // operatBtnWidth: 64,
            //orderBy: 'timeVersion desc'
        }
        return (
            <div className="rankChangeRecord">
                <SubTable
                    {...subTableItem}
                />
            </div>
        )
    }
}
export default rankModal