import React, { Component } from 'react'
import { Cascader } from 'antd'
import { houseMaintainService } from '../../services'

/**
 *
 * 国家省市区街道组件
 *
 * @props keyName 通过什么字段获取级联数据，默认值是code,  可选值  code, id 注： 若选择code,回调就返回code，若选择id,回调就返回id  注： 接口TM不支持ID搜索，放弃治疗吧~~
 * @props cascaderLength 级联数，默认5级
 * @props countryCode 默认值国家
 * @props provinceCode 默认值省
 * @props cityCode 默认值市
 * @props areaCode 默认值区域
 * @props streetCode 默认值街道
 * @props handleChangeValue: function(value,selectedOptions){} 回调
 *
 * */

/**
 * 这里有个很恶心的东西，就是房源地址数据，如果是直辖市的话，有些code不对应，所以，我在下面增加了一些多于的数据。
 * 为什么这个组件要调多次接口拿地址数据呢？
 * 是因为全部获取省市区街道的数据量太大，影响接口响应时间
 *
 * */
const municipality = {//直辖市code转换才能查询下一级
    '110000': '110100',
    '110100': '110100',
    '500000': '500100',
    '500100': '500100',
    '120000': '120100',
    '120100': '120100',
    '310000': '310100',
    '310100': '310100',
    '920196331756457984': '920196331756457984',
    '920196426799386624': '920196426799386624',
    '920196332402380800': '920196332402380800',
    '920196359489196032': '920196359489196032'
}
const municipalityName = {
    '110000': '北京城区',
    '110100': '北京城区',
    '920196331756457984': '北京城区',
    '500000': '重庆城区',
    '920196426799386624': '重庆城区',
    '500100': '重庆城区',
    '120000': '天津城区',
    '120100': '天津城区',
    '920196332402380800': '天津城区',
    '310000': '上海城区',
    '310100': '上海城区',
    '920196359489196032': '上海城区'
}

class CascaderAddress extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isEdit: false,
            loading: false,
            optionsData: [],
            fieldNames: {
                label: 'name',
                value: props.keyName || 'code'
            },
            keyName: props.keyName || 'code',
            countryCode: '',
            provinceCode: '',
            cityCode: '',
            areaCode: '',
            defaultSelectedValue: [], //默认选中的值
            cascaderLength: !!props.cascaderLength ? props.cascaderLength : 5 //需要级联级数，默认5级，最少1级
        }
    }
    componentWillMount () {
        this.getCountry()
    }

    componentWillReceiveProps (nextProps) {
        if(!!nextProps.countryCode && nextProps.countryCode !== this.state.countryCode && nextProps.countryCode !== this.state.countryCode
            && nextProps.countryCode !== this.state.countryCode && nextProps.countryCode !== this.state.countryCode) {
            this.defaultUpdateAddressData(nextProps)
        }
    }

    defaultUpdateAddressData = (nextProps) => {
        let arr = []
        nextProps.countryCode !== '' && arr.push(nextProps.countryCode)
        nextProps.provinceCode !== '' && arr.push(nextProps.provinceCode)
        nextProps.cityCode !== '' && arr.push(municipality[nextProps.cityCode] ? municipality[nextProps.cityCode] : nextProps.cityCode)
        nextProps.areaCode !== '' && arr.push(nextProps.areaCode)
        nextProps.streetCode !== '' && arr.push(nextProps.streetCode)
        this.setState({
            defaultSelectedValue: arr,
            countryCode: nextProps.countryCode,
            provinceCode: nextProps.provinceCode,
            cityCode: nextProps.cityCode,
            areaCode: nextProps.areaCode,
            streetCode: nextProps.streetCode
        }, () => {
            //当获取国家数据接口还在响应时，需要轮训调用当前函数
            if(this.state.loading) {
                setTimeout(() => {
                    this.defaultUpdateAddressData(nextProps)
                }, 1000)
            }else {
                if(this.state.optionsData.length > 0) {
                    //当有默认地址时，需要进行调用获取数据
                    if(this.state.countryCode !== '') {
                        let defaultSelectedOptions = []
                        this.state.optionsData.forEach(item => {
                            if(item[this.state.keyName] === this.state.countryCode){
                                defaultSelectedOptions.push(item)
                            }
                        })
                        this.setState({
                            loading: false,
                            isEdit: true
                        }, () => {
                            this.loadData(defaultSelectedOptions)
                        })
                    }
                }else {
                    this.getCountry()
                }
            }
        })

    }
    //获取国家数据
    getCountry = () => {
        this.setState({loading: true})
        houseMaintainService.fetchCascaderAddressData({
            areaLevel: 1
        }).then(res => {
            const list = this.addObjProperty(res.list)
            this.setState({
                optionsData: list,
                loading: false
            })
        }).catch(err => {

        })
    }

    getAddressData = async (params) => {
        return new Promise(resolve => {
            houseMaintainService.fetchCascaderAddressData(params).then(res => {
                resolve(res.list);
            }).catch(err => {
                resolve([])
            })
        })
    }
    //对象增加isLeaf，为了让组件检测到可往下级查询
    addObjProperty = (data) => {
        let list = []
        if(!!data) {
            data.forEach(item => {
                list.push({
                    ...item,
                    isLeaf: false
                })
            })
        }
        return list
    }

    loadData = async (selectedOptions) => {
        let targetOption = selectedOptions[selectedOptions.length - 1]
        if(!targetOption) {
            return
        }
        targetOption.loading = true
        if(selectedOptions.length === 1 && this.state.cascaderLength >= 2) { //获取省份 级联大于等于或等于2级时才进入搜索
            let res = await this.getAddressData({
                areaLevel: 2,
                parentCode: this.state.keyName === 'code' ? targetOption.code : undefined,
                parentId: this.state.keyName === 'id' ? targetOption.id : undefined,
                pageSize: 999
            })
            if(this.state.cascaderLength >= 3){
                res = this.addObjProperty(res)
            }

            //该次赋值已经在this.state.optionsData集合数组的原型链上
            targetOption.children = res || []
            targetOption.loading = false
            //更新state
            this.setState({
                optionsData: [...this.state.optionsData]
            }, () => {
                //有默认地址时，需要处理此处
                if(this.state.isEdit) {
                    if(this.state.provinceCode !== '') {
                        let defaultSelectedOptions = selectedOptions
                        res.forEach(item => {
                            if(item[this.state.keyName] === this.state.provinceCode) {
                                defaultSelectedOptions.push(item)
                            }
                        })
                        this.loadData(defaultSelectedOptions)
                    }
                    if(this.state.provinceCode === '' || this.state.cityCode === ''){
                        //当provinceCode为空时，关闭isEdit
                        this.setState({
                            isEdit: false
                        })
                    }
                }
            })
        }else if(selectedOptions.length === 2 && this.state.cascaderLength >= 3) { //获取市，级联大于等于或等于3级时才进入搜索
            const flag = !!municipality[targetOption[this.state.keyName]]
            let res = null
            if(flag) {
                //若是直辖市
                res = [{
                    code: municipality[targetOption[this.state.keyName]],
                    name: municipalityName[targetOption[this.state.keyName]],
                    isLeaf: false
                }]
            } else {
                res = await this.getAddressData({
                    areaLevel: 3,
                    parentCode: this.state.keyName === 'code' ? targetOption.code : undefined,
                    parentId: this.state.keyName === 'id' ? targetOption.id : undefined,
                    pageSize: 999
                })
                if(this.state.cascaderLength >= 4){
                    res = this.addObjProperty(res)
                }
            }
            targetOption.children = res || []

            targetOption.loading = false
            this.setState({
                optionsData: [...this.state.optionsData]
            }, () => {
                //有默认地址时，需要处理此处
                if(this.state.isEdit) {
                    if(this.state.cityCode !== '') {
                        let defaultSelectedOptions = selectedOptions
                        let cityCode = flag ? municipality[this.state.cityCode] : this.state.cityCode
                        res.forEach(item => {
                            if(item[this.state.keyName] === cityCode) {
                                defaultSelectedOptions.push(item)
                            }
                        })
                        //防止死循环
                        if(defaultSelectedOptions.length === 3) {
                            this.loadData(defaultSelectedOptions)
                        }
                    }
                    if(this.state.cityCode === '' || this.state.areaCode === ''){
                        //当cityCode或areaCode为空时，关闭isEdit
                        this.setState({
                            isEdit: false
                        })
                    }
                }
            })
        }else if(selectedOptions.length === 3 && this.state.cascaderLength >= 4) { //获取区域，级联为4级时才进入搜索区域
            let res = await this.getAddressData({
                areaLevel: 4,
                parentCode: this.state.keyName === 'code' ? targetOption.code : undefined,
                parentId: this.state.keyName === 'id' ? targetOption.id : undefined,
                pageSize: 999
            })
            if(this.state.cascaderLength >= 5){
                res = this.addObjProperty(res)
            }

            targetOption.children = res || []
            targetOption.loading = false
            this.setState({
                optionsData: [...this.state.optionsData]
            }, () => {
                //有默认地址时，需要处理此处
                if(this.state.isEdit) {
                    if(this.state.areaCode !== '') {
                        let defaultSelectedOptions = selectedOptions
                        res.forEach(item => {
                            if(item[this.state.keyName] === this.state.areaCode) {
                                defaultSelectedOptions.push(item)
                            }
                        })
                        if(defaultSelectedOptions.length === 4) {
                            this.loadData(defaultSelectedOptions)
                        }
                    }
                    if(this.state.streetCode === ''){
                        //当streetCode为空时，关闭isEdit
                        this.setState({
                            isEdit: false
                        })
                    }
                }
            })
        }else if(selectedOptions.length === 4 && this.state.cascaderLength === 5){
            let res = await this.getAddressData({
                areaLevel: 5,
                parentCode: this.state.keyName === 'code' ? targetOption.code : undefined,
                parentId: this.state.keyName === 'id' ? targetOption.id : undefined,
                pageSize: 20000
            })
            //街道没有code,需要把name赋值给code
            res && res.forEach(item => {
                item.code = item.name
            })
            targetOption.children = res || []
            targetOption.loading = false
            //最后一个级联，需要关闭isEdit
            this.setState({
                isEdit: false,
                optionsData: [...this.state.optionsData]
            })
        }
    }

    onChange = (value, selectedOptions) => {
        this.setState({
            defaultSelectedValue: value
        }, () => {
            //回调给父组件
            this.props.handleChangeValue(value,selectedOptions)
        })
    }
    render () {
        const { optionsData, fieldNames, defaultSelectedValue } = this.state
        const { placeholder } = this.props
        return (
            <div>
                <Cascader
                    disabled={this.props.disabled}
                    placeholder={placeholder}
                    value={defaultSelectedValue}
                    options={optionsData}
                    loadData={this.loadData}
                    onChange={this.onChange}
                    fieldNames={fieldNames}
                    changeOnSelect
                />
            </div>
        )
    }
}

export default CascaderAddress
