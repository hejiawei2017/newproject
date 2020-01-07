import React from 'react'
import './index.css'
import validator from 'validate-form-p'
import Select from 'react-select'
import { provinces, citys } from '../../../common/address.data'
const ACTIVE_ID = '1908291049343'
const { postJoin } = require('../server')

const provincesOptions = provinces.map(province => ({
  value: province,
  label: province
}))
class App extends React.Component {
  constructor () {
    super()
    this.state = {
      name: '',
      phone: '',
      houseNum: '',
      province: '',
      city: '',
      citiesOptions: []
    }
    this.changeName = this.changeName.bind(this)
    this.changeHouseNum = this.changeHouseNum.bind(this)
    this.changePhone = this.changePhone.bind(this)
    this.submit = this.submit.bind(this)
    this.setProvincesSelectedOption = this.setProvincesSelectedOption.bind(this)
    this.setCitySelectedOption = this.setCitySelectedOption.bind(this)
    this.handleProvinceChange = this.handleProvinceChange.bind(this)
    this.handleCityChange = this.handleCityChange.bind(this)
  }
  changeName (e) {
    this.setState({
      name: e.currentTarget.value
    })
  }
  changeHouseNum (e) {
    this.setState({
      houseNum: e.currentTarget.value
    })
  }
  changePhone (e) {
    this.setState({
      phone: e.currentTarget.value
    })
  }
  handleProvinceChange (selectedOption) {
    this.setCitiesOptions(
      citys[selectedOption.value].map(city => ({
        label: city,
        value: city
      }))
    )
    this.setProvincesSelectedOption(selectedOption)
    this.setCitySelectedOption(null)
  }
  handleCityChange (selectedOption) {
    this.setCitySelectedOption(selectedOption)
  }
  async submit () {
    const { name, phone, houseNum, province, city } = this.state
    console.log(name, phone, houseNum)
    const rules = [
      ['name', 'require', '姓名填写错误'],
      ['houseNum', 'require', '数量填写错误'],
      ['phone', 'phone', '手机号码填写错误'],
      ['province', 'require', '请选择省'],
      ['city', 'require', '请选择市']
    ]

    const params = {
      name,
      phone: Number(phone),
      houseNum,
      province: (province && province.value) || '',
      city: (city && city.value) || ''
    }

    console.log(params)

    if (validator.setData(params).validate(rules)) {
      const res = await postJoin({
        activity_id: ACTIVE_ID,
        payload: JSON.stringify(params)
      })
      const { success, errorCode, errorMsg } = res
      if (errorCode === 0) {
        window.alert('路客工作人员会尽快与您联系，非常感谢您的耐心等待。')
      } else {
        window.alert('提交失败, ' + errorMsg)
      }
    } else {
      window.alert(Object.values(validator.getError()).join('，'))
    }
  }
  setProvincesSelectedOption (e) {
    this.setState({
      province: e
    })
  }
  setCitiesOptions (e) {
    this.setState({
      citiesOptions: e
    })
  }
  setCitySelectedOption (opt) {
    this.setState({
      city: opt
    })
  }
  render () {
    const { name, phone, houseNum, province, city, citiesOptions } = this.state
    return (
      <div className="container">
        {/* <img src={icon} className='icon' /> */}
        <div className="title">联系我们</div>
        <div className="form_wrapper">
          <div className="form_item__label">
            姓名 <span className="red">*</span>
          </div>
          <div className="form_item__value">
            <input
              value={name}
              type="text"
              className="form_item__input"
              placeholder="请输入您的姓名"
              onChange={this.changeName}
            />
          </div>
          <div className="form_item__label">
            您的电话 <span className="red">*</span>
          </div>
          <div className="form_item__value">
            <input
              type="text"
              value={phone}
              className="form_item__input"
              placeholder="请输入您的电话号码"
              onChange={this.changePhone}
            />
          </div>
          <div className="form_item__label">
            房源数量 <span className="red">*</span>
          </div>
          <div className="form_item__value">
            <input
              value={houseNum}
              type="text"
              className="form_item__input"
              placeholder="请输入您的公司名称"
              onChange={this.changeHouseNum}
            />
          </div>
          <div className="form_item__label">
            所在城市 <span className="red">*</span>
          </div>
          <div className="form_item__value select">
            <Select
              value={province}
              onChange={this.handleProvinceChange}
              options={provincesOptions}
              placeholder="请选择"
            />
            <Select
              value={city}
              onChange={this.handleCityChange}
              options={citiesOptions}
              placeholder="请选择"
            />
          </div>
          <div className="form_submit" onClick={this.submit}>
            提交信息
          </div>
        </div>
      </div>
    )
  }
}

export default App
