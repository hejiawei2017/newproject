import React, { Component } from 'react'
import PropTypes from 'prop-types'

let style = {
    tableWrapper: {
        overflow: 'hidden'
    },
    label: {
        borderRight: '1px solid #e8e8e8',
        padding: '10px',
        display: 'inline-block',
        minWidth: '120px',
        textAlign: 'right',
        fontWeight: 600
    },
    value: {
        padding: '10px',
        display: 'inline-block'
    },
    tableItem: {
        width: '50%',
        float: 'left',
        borderTop: '1px solid #e8e8e8',
        borderLeft: '1px solid #e8e8e8'
    }
}

export default class CustomTable extends Component {
    static propTypes = {
        dataSource: PropTypes.array.isRequired,
        column: PropTypes.number
    }

    static defaultProps = {
        dataSource: [], // 表格数据 key-value paras, e.g. {key: '支付订单', value: 123456}
        cols: 2 //  表格分为多少列
    }

    render = () => {
        const { dataSource, cols } = this.props

        let calStyle = {
            ...style,
            tableItem: {
                ...style.tableItem,
                width: `${100 / cols}%`
            }
        }

        return (
            <ul className="custom-table" style={calStyle.tableWrapper}>
                {
                    dataSource.map((item, index, data) => (
                        <li
                            key={(
                                item.key
                                    ?
                                    React.isValidElement(item.key)
                                        ? item.key.props.children[0]
                                        : item.key
                                    : index
                            )}
                            className="custom-table-list" style={{
                                ...calStyle.tableItem,
                                borderRight: (index + 1) % cols === 0 || index + 1 === data.length ? '1px solid #e8e8e8' : 'none', // 针对分列数设置对应数列的右边框
                                borderBottom: data.length - (index + 1) < cols ? '1px solid #e8e8e8' : 'none' // 根据列表项的数量设置底边框，
                            }}
                        >
                            <span className="custom-table-list__label" style={calStyle.label}>{
                                item.key
                            }</span>
                            <span className="custom-table-list__value" style={calStyle.value}>{
                                item.value
                            }</span>
                        </li>
                    ))
                }
            </ul>
        )
    }
}