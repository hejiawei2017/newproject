import React, { Component } from 'react'
import { Select, Spin } from 'antd'
import {goodsSellerService} from "../../services"
import PropTypes from 'prop-types'

const Option = Select.Option;

class SearchSelectSeller extends Component {

    static propTypes = {
        getSellerInfo: PropTypes.func,
        supplierId: PropTypes.string
    }

    constructor (props) {
        super(props)
        this.state = {
            sellerList: [],
            supplierId: props.supplierId || '',
            isSelected: false,
            fetching: false
        }
    }
    componentDidMount () {
        this.fetchSearchSeller()
    }
    handleSelectChange = (value) => {
        let obj = null;
        this.state.sellerList.forEach((item) =>{
            if(item.id === value){
                obj = item
            }
        })
        this.setState({
            fetching: false,
            supplierId: value
        })
        this.props.getSellerInfo(obj)

    }

    fetchSearchSeller = () => {
        // let keyword = (typeof(value) === "undefined" || value === null) ? '' : value.trim()
        this.setState({
            fetching: true
        })
        goodsSellerService.getTable({ pageSize: 40 }).then((e) => {
            this.setState({
                sellerList: e.list,
                fetching: false
            })
        })
    }

    render () {
        const {sellerList, supplierId, fetching} = this.state
        return (
            <Select
                value={supplierId}
                notFoundContent={fetching ? <Spin size="small" /> : '暂无供应商信息'}
                defaultActiveFirstOption={false}
                filterOption={false}
                onChange={this.handleSelectChange}
            >
                <Option key="请选择" value="">请选择</Option>
                {
                    sellerList.map((d) => <Option key={d.id}>{d.name}</Option>)
                }
            </Select>
        )
    }
}

export default SearchSelectSeller