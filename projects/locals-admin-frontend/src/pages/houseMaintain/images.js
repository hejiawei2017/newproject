import React, {Component} from 'react'
import { Form, Divider, Row, Col, Button, Alert } from 'antd'
import { houseMaintainService } from '../../services'
import ComponentUploadImage from '../../components/uploadImage'
import {message} from "antd/lib/index"

const FormItem = Form.Item
class HouseImages extends Component {
    constructor () {
        super()
        this.state = {
            localsMainImage: [],
            showDefaultMainImage: [],
            balanceImage: [],
            showDefaultBalanceImage: [],
            tipsDate: new Date('2019-04-24 00:00:00').getTime()
        }
    }
    componentDidMount () {
        this.getLocalsMainImage()
        this.getBalanceImage()
        console.log(this.props.houseInfo)
    }

    //获取路客主图
    getLocalsMainImage = () => {
        houseMaintainService.fetchHouseMainImages(this.props.houseSourceId).then(res => {
            this.setState({
                localsMainImage: res,
                showDefaultMainImage: this.packImageObject(res)
            })
        })
    }
    //获取横图
    getBalanceImage = () => {
        houseMaintainService.fetchHouseHorizontalImages(this.props.houseSourceId).then(res => {
            this.setState({
                balanceImage: res,
                showDefaultBalanceImage: this.packImageObject(res)
            })
        })
    }
    //路客主图上传
    addLocalsMainImage = (fileList, moduleName) => {
        let images = []
        //这里需要进行一次倒叙，因为在提交的时候，数组的顺序变了，可能是fetch对参数进行转换的时候影响的
        fileList.sort((a, b) => {return a.orderNumber - b.orderNumber})
        fileList.forEach(item => {
            images.push({
                imgPath: item.url,
                description: item.description
            })
        })
        let params = {
            module: moduleName,
            images: images
        }
        houseMaintainService.addHouseMainImages(this.props.houseSourceId, params).then(res => {
            this.getLocalsMainImage()
            message.success('更新成功')
        })
    }
    //删除路客主图
    deleteLocalsMainImage = (moduleName, operateIndex) => {
        let id = ''
        this.state.localsMainImage.forEach(item => {
            if(item.module === moduleName) {
                id = item.images[operateIndex].id
            }
        })
        houseMaintainService.deleteHouseMainImages(this.props.houseSourceId, id).then(res => {
            this.getLocalsMainImage()
            message.success('删除成功')
        }).catch(err => {
            this.setState({
                showDefaultMainImage: this.packImageObject(this.state.localsMainImage)
            })
        })
    }
    //修改主图描述
    editLocalsMainDescription = (fileList, moduleName, operateIndex) => {
        const changeFile = fileList[operateIndex]
        let originalFile = {}
        this.state.localsMainImage.forEach(item => {
            if(item.module === moduleName) {
                originalFile = item.images[operateIndex]
            }
        })
        let params = {
            module: moduleName,
            description: changeFile.description
        }
        if(changeFile.description !== originalFile.description) {
            houseMaintainService.editHouseMainImages(this.props.houseSourceId, changeFile.uid, params).then(res => {
                this.getLocalsMainImage()
                message.success('修改成功')
            })
        }
    }

    //路客横图上传
    addBalanceImage = (fileList, moduleName) => {
        let images = []
        //这里需要进行一次倒叙，因为在提交的时候，数组的顺序变了，可能是fetch对参数进行转换的时候影响的
        fileList.sort((a, b) => {return a.orderNumber - b.orderNumber})
        fileList.forEach(item => {
            images.push({
                imgPath: item.url,
                description: item.description
            })
        })
        let params = {
            module: moduleName,
            images: images
        }
        houseMaintainService.addHouseBalanceImages(this.props.houseSourceId, params).then(res => {
            this.getBalanceImage()
            message.success('更新成功')
        })
    }
    //删除路客横图
    deleteBalanceImage = (moduleName, operateIndex) => {
        let id = ''
        this.state.balanceImage.forEach(item => {
            if(item.module === moduleName) {
                id = item.images[operateIndex].id
            }
        })
        houseMaintainService.deleteHouseBalanceImages(this.props.houseSourceId, id).then(res => {
            this.getBalanceImage()
            message.success('删除成功')
        }).catch(err => {
            this.setState({
                showDefaultBalanceImage: this.packImageObject(this.state.balanceImage)
            })
        })
    }

    //修改横图描述
    editBalanceDescription = (fileList, moduleName, operateIndex) => {
        const changeFile = fileList[operateIndex]
        let originalFile = {}
        this.state.balanceImage.forEach(item => {
            if(item.module === moduleName) {
                originalFile = item.images[operateIndex]
            }
        })
        let params = {
            module: moduleName,
            description: changeFile.description
        }
        if(changeFile.description !== originalFile.description) {
            houseMaintainService.editHouseBalanceImages(this.props.houseSourceId, changeFile.uid, params).then(res => {
                this.getBalanceImage()
                message.success('修改成功')
            })
        }
    }

    //封装上传图片可用
    packImageObject = (list) => {
        if(!!list) {
            let transList = JSON.parse(JSON.stringify(list))
            transList.forEach(item => {
                let arr = []
                item.images.forEach(itemImage => {
                    arr.push({
                        uid: itemImage.id,
                        url: itemImage.imgPath,
                        description: itemImage.description,
                        orderNumber: itemImage.orderNumber
                    })
                })
                item.images = arr
            })
            return transList
        }
        return list
    }

    handleSubmit = () => {
        this.props.nextCb();
    }

    render () {
        const that = this
        const { showDefaultMainImage, showDefaultBalanceImage } = this.state;

        let localsImageCount = 0;
        let balanceImageCount = 0;
        const houseCreateTime = this.props.houseInfo && new Date(this.props.houseInfo.createTime).getTime();
        // 当房源创建时间大于tipsDate 这个时间时，上传图片才做需要的限制
        const isFreshHouse = houseCreateTime > this.state.tipsDate;

        showDefaultMainImage.forEach(item => {
            localsImageCount = item.images.length + localsImageCount
        })
        showDefaultBalanceImage.forEach(item => {
            balanceImageCount = item.images.length + balanceImageCount
        })
        return (
            <div className="house-maintain">
                <Form>
                    <Divider orientation="left">
                        <span>路客图片上传</span>
                        <span style={{marginLeft: 10}}>共<span style={{color: 'red'}}>{localsImageCount}</span>张图</span>
                    </Divider>
                    {
                        showDefaultMainImage.map((item, index) => {
                            return (
                                <FormItem
                                    key={item.module + '_main_formItem_' + index}
                                    colon={false}
                                    label={
                                        <span>
                                            {
                                                item.module === '主图(横图)' ? '主图（横图尺寸：宽1920px * 高1280px）' : `${item.module}（竖图尺寸：宽1280px * 高1920px）`
                                            }
                                        </span>
                                    }
                                >
                                    {
                                        item.module === '主图(横图)' ?
                                            <Row>
                                                <Col span={13}>
                                                    <ComponentUploadImage
                                                        showDescription
                                                        imageUrlList={item.images}
                                                        imageLength={1}
                                                        minFileSize={500}
                                                        maxFileSize={2048}
                                                        minSizeWidth={1920}
                                                        maxSizeWidth={1920}
                                                        minSizeHeight={1280}
                                                        maxSizeHeight={1280}
                                                        handleType="balance"
                                                        getImageInfo={function (fileList, operateType, operateIndex) {
                                                            if(operateType === 'add') {
                                                                that.addLocalsMainImage(fileList, item.module)
                                                            }else if(operateType === 'delete') {
                                                                that.deleteLocalsMainImage(item.module, operateIndex)
                                                            }else if(operateType === 'edit') {
                                                                that.editLocalsMainDescription(fileList, item.module, operateIndex)
                                                            }

                                                        }}
                                                    />
                                                </Col>
                                                <Col span={11}>
                                                    <Alert showIcon
                                                       type="warning"
                                                       message={
                                                           <div>
                                                               <p style={{fontSize: '16px', fontWeight: 'bold'}}>路客图片上传注意点</p>
                                                               1、请将【主图】模块的图片，修改为竖图<br />
                                                               2、除【封面图】外，其他模块需上传竖图<br />
                                                               3、卧室含独立卫生间的，请将独立卫生间的图片上传至对应的【卧室】模块
                                                               4、按住 ctrl(Windows)/command(MacBook) 可选择多个文件，鼠标按住图片可拖动排序
                                                           </div>
                                                       }
                                                    />
                                                </Col>
                                            </Row>
                                             :
                                            <ComponentUploadImage
                                                multiple
                                                showDescription
                                                isDragSort
                                                handleType="vertical"
                                                imageLength={500}
                                                imageUrlList={item.images}
                                                minFileSize={500}
                                                maxFileSize={2048}
                                                minSizeWidth={1280}
                                                maxSizeWidth={1280}
                                                minSizeHeight={1920}
                                                maxSizeHeight={1920}
                                                getImageInfo={function (fileList, operateType, operateIndex) {
                                                    if(operateType === 'add') {
                                                        that.addLocalsMainImage(fileList, item.module)
                                                    }else if(operateType === 'delete') {
                                                        that.deleteLocalsMainImage(item.module, operateIndex)
                                                    }else if(operateType === 'edit') {
                                                        that.editLocalsMainDescription(fileList, item.module, operateIndex)
                                                    }
                                                }}
                                            />
                                    }

                                </FormItem>
                            )
                        })
                    }
                    <Divider orientation="left">
                        <span>横图上传</span>
                        <span style={{marginLeft: 10}}>共<span style={{color: 'red'}}>{balanceImageCount}</span>张图</span>
                    </Divider>
                    {
                        showDefaultBalanceImage.map((item, index) => {
                            return (
                                <FormItem
                                    key={item.module + '_balance_formItem_' + index}
                                    colon={false}
                                    label={
                                        <span>
                                            {
                                            `${item.module}（横图尺寸为：宽1920px * 高1280px）`
                                            }
                                        </span>
                                    }
                                >
                                    {
                                        item.module === '主图' ?
                                            <Row>
                                                <Col span={13}>
                                                    <ComponentUploadImage
                                                        showDescription
                                                        imageUrlList={item.images}
                                                        handleType="balance"
                                                        minFileSize={500}
                                                        maxFileSize={2048}
                                                        minSizeWidth={1920}
                                                        maxSizeWidth={1920}
                                                        minSizeHeight={1280}
                                                        maxSizeHeight={1280}
                                                        getImageInfo={function (fileList, operateType, operateIndex) {
                                                            if(operateType === 'add') {
                                                                that.addBalanceImage(fileList, item.module)
                                                            }else if(operateType === 'delete') {
                                                                that.deleteBalanceImage(item.module, operateIndex)
                                                            }else if(operateType === 'edit') {
                                                                that.editBalanceDescription(fileList, item.module, operateIndex)
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={11}>
                                                    <Alert showIcon
                                                       type="warning"
                                                       message={
                                                           <div>
                                                               <p style={{fontSize: '16px', fontWeight: 'bold'}}>横图上传注意点</p>
                                                               1、该模块图片用于airbnb、booking、途家等API平台；全部需为横图<br />
                                                               2、图片尺寸必须为：宽1920px * 高1280px <br />
                                                               3、上线airbnb的房源，图片数量不能少于10张；上线途家的房源，图片数量不能少于6张
                                                           </div>
                                                       }
                                                    />
                                                </Col>
                                            </Row> :
                                            <ComponentUploadImage
                                                multiple
                                                showDescription
                                                isDragSort
                                                imageLength={500}
                                                handleType="balance"
                                                imageUrlList={item.images}
                                                minFileSize={500}
                                                maxFileSize={2048}
                                                minSizeWidth={1920}
                                                maxSizeWidth={1920}
                                                minSizeHeight={1280}
                                                maxSizeHeight={1280}
                                                getImageInfo={function (fileList, operateType, operateIndex) {
                                                    if(operateType === 'add') {
                                                        that.addBalanceImage(fileList, item.module)
                                                    }else if(operateType === 'delete') {
                                                        that.deleteBalanceImage(item.module, operateIndex)
                                                    }else if(operateType === 'edit') {
                                                        that.editBalanceDescription(fileList, item.module, operateIndex)
                                                    }
                                                }}
                                            />
                                    }

                                </FormItem>
                            )
                        })
                    }

                </Form>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '10px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px'
                    }}
                >
                    <Button
                        style={{
                            marginRight: 8
                        }}
                        onClick={this.props.onCloseDrawer}
                    >
                        取消
                    </Button>
                    <Button type="primary" onClick={this.handleSubmit}>下一步</Button>
                </div>
            </div>
        )
    }
}

HouseImages = Form.create()(HouseImages)
export default HouseImages
