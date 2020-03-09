import React, {PureComponent, Fragment} from 'react'
import {Modal, Form, Row, Col, Input, Button, Radio, Select, Popconfirm, message, Checkbox, InputNumber} from 'antd'
import {houseListService, tagManageService} from '../../services'
import moment from "../landlordSatisfaction/configModal";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item

class TagManageModal extends PureComponent {
    constructor (props){
        super(props)
        this.state = {
            imageListM: [],
            selectTagList: [],
            selectTag:'风格特色'
        }
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount () {
        const {checkItem, prodCustomTagList} = this.props
        houseListService.houseImage(checkItem.houseSourceId).then((data) => {
            this.setState({
                imageListM: data
            })
        })
        tagManageService.customerTagMap({houseId: checkItem.houseSourceId}).then((data) => {
            this.setState({
                selectTagList: data
            })
        })
    }
    onSubmit = () => {
        const {cacheSalesList} = this.props
        const {validateFields} = this.props.form
        let tagIds = []
        validateFields((error, values) => {
            cacheSalesList.map(item => {
                values.checkboxGroup.map(ite => {
                    if(item.name === ite){
                        tagIds.push(item.id)
                    }
                    return true
                })
                return true
            })
            this.props.onSubmit(tagIds)
        })
    }
    handleChange = (value) => {
        this.setState({
            selectTag: value
        })
    }
    render () {
        const self = this
        const { handleCancel, prodCustomTagList, cacheSalesList, visible, checkItem} = this.props
        const {imageListM, selectTag, selectTagList} = this.state
        const {getFieldDecorator} = this.props.form
        const selectTagListAry = selectTagList.map(item => item.tagName)
        return (
            <Modal
                title="房源标签管理"
                width={1200}
                visible={visible}
                onCancel={handleCancel}
                onOk={self.onSubmit}
                destroyOnClose
            >
                <div style={{paddingBottom: '20px'}}>
                    房源名称：
                    {checkItem.title}
                </div>
                <div style={{height: '550px'}}>
                    <Row type="flex" justify="space-around" style={{height: '100%'}}>
                        <Col span={17} className="mr20" style={{height: '100%', overflow: 'auto'}}>
                            <div className="ant-masonry">
                                { imageListM.length > 0 ? imageListM.map(function (item,index) {
                                    return <div className="ant-masonry-item" key={index}>
                                        <img className="wsm-full ant-masonry-cell" style={{width:'100%',height:'100%'}} src={item.imgPath} alt="加载失败..." />
                                    </div>
                                }) : <div style={{padding:"20px"}}>暂无房源图片</div>
                                }
                            </div>
                        </Col>
                        <Col span={6} style={{height: '100%', overflow: 'auto'}}>
                            <Row className="mb20">
                                <span className="mr20">标签类型：</span>
                                <Select defaultValue={selectTag} style={{ width: 120 }} onChange={this.handleChange}>
                                    {
                                        prodCustomTagList.map((item, index) => {
                                            return <Option key={item.categoryId} value={item.categoryName}>{item.categoryName}</Option>
                                        })
                                    }
                                </Select>
                            </Row>
                            <Form>
                                <FormItem>
                                    {getFieldDecorator('checkboxGroup', {
                                        initialValue: selectTagListAry
                                    })(
                                        <CheckboxGroup style={{width:"100%"}}>
                                            <Row type="flex" justify="start">
                                                {cacheSalesList.map(item=>{
                                                    return (
                                                        <Col span={12} key={item.id} style={{display: selectTag === item.categoryName ? 'block' : 'none'}}>
                                                            <Checkbox className="mb10" value={item.name}>{item.name}</Checkbox>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </CheckboxGroup>
                                    )}
                                </FormItem>
                            </Form>

                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}

TagManageModal = Form.create()(TagManageModal)

export default TagManageModal
