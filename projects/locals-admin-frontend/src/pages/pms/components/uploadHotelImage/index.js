import React, { Component } from 'react'
import {Upload, Icon, Modal} from 'antd'
import Draggable from '../../../../components/Draggable'
import OSS from 'ali-oss'
import './index.less'
import {createUUID} from "../../../../utils/utils"
import {message} from "antd/lib/index";
const env = process.env.MY_ENV || 'dev'

const client = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: 'LTAI51rz55fhjUzU',
    accessKeySecret: 'QETpJ124TfYfP801ZA5Mco0djKvXtx',
    bucket: (env === 'pre' || env === 'prod') ? 'locals-house-prod' : 'locals-house-test', //locals-house-prod(生产) locals-house-test(测试)
    secure: true // https访问
});

/**
 *  @property
 *
    props: {
        imageUrlList: [{ 图片数组
            uid: xxxxxxxxxxxxxxxx,
            url: '',
            status: 'done',
            description: '我是主图啦' 描述，
            orderNumber: 0  //根据当前字段进行排序，需要拖拽排序时，将该字段传入
        }]，
        isDragSort: true, // 开启拖拽排序
        imageLength： 1， 限制图片张数
        getImageInfo: function(fileList,operateType, operateIndex){ //父组件回调获取图片信息（拖拽排序时，返回时没有operateIndex参数）

            @params fileList 图片信息数组
            @params operateType 当前返回的操作类型 如：新增（add） 删除（delete）修改（edit）
            注：【修改（edit）一般针对修改图片描述】
            @params index 当前操作的对象下标，比如删除了数组的某个对象，则返回该对象的下标

        },
        handleType: 'vertical', 竖图 vertical  横图 balance （根据当前值判断横图或竖图，默认不传就不判断）
        minSizeWidth: 200, 判断图片最小宽度，默认不传不进行判断
        maxSizeWidth: 1000, 判断图片最大宽度，默认不传不进行判断
        minSizeHeight: 200, 判断图片最小高度，默认不传不进行判断
        maxSizeHeight: 1000, 判断图片最大高度，默认不传不进行判断
        multiple: false, //开启后按住 ctrl 可选择多个文件。 默认单选
        showDescription: false, //开启输入图片描述框（通过该字段判断是否需要重写上传组件的图片展示模块）
        placeholder: '请输入XXX',

    }
 *
 *
 *
 * */
class UploadImage extends Component {
    constructor (props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            imageLength: props.imageLength || 1,
            fileList: props.imageUrlList || [],
            multiple: !!props.multiple,
            showDescription: !!props.showDescription,
            placeholder: props.placeholder || '图片描述',
            selectMultipleCount: 0,
            requestMultipleCount: 0
        }
    }

    componentWillReceiveProps (nextProps) {
        /**
         * 通过数组索引对比，如果索引不一致，就重新渲染组件
         *
         * */
        if(!!nextProps.imageUrlList && JSON.stringify(nextProps.imageUrlList) !== JSON.stringify(this.state.fileList)) {
            this.setState({
                fileList: nextProps.imageUrlList
            })
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handleRemove = (file) => {
        let fileList = this.state.fileList
        let operateIndex = -1
        fileList.forEach((item,index) => {
            if(file.id === item.id) {
                fileList.splice(index, 1)
                operateIndex = index
            }
        })
        this.setState({fileList}, this.props.getImageInfo(fileList, 'delete', operateIndex))
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.imgPath || file.thumbUrl,
            previewVisible: true
        });
    }
    handleCustomUpload = (option) => {
        let ids = createUUID('xxxxxxxxxxxxxxxx',10)
        let that = this
        let { fileList, requestMultipleCount, multiple, selectMultipleCount } = this.state
        const count = requestMultipleCount + 1
        that.setState({requestMultipleCount: count})
        client.put("aai/" + ids + ".png", option.file).then(result => {
            fileList.push({
                id: createUUID('xxxxxxxxxxxxxxxx',10),
                imgPath: result.url,
                status: 'done',
                orderNumber: fileList.length > 0 && !!fileList[fileList.length - 1].orderNumber ? (fileList[fileList.length - 1].orderNumber + 1) : 1
            })
            // console.log('fileListfileListfileListfileListfileList',fileList)
            // that.setState({ fileList },that.props.getImageInfo(fileList, 'add'))
            //多选时进入
            if(multiple) {
                //判断当前request 是否已经到最后一次上传了，如果是，就把图片数组对象返回到父级，否则，先缓存好图片
                // if(selectMultipleCount === count) {
                //     that.setState({
                //         requestMultipleCount: 0
                //     }, () => {
                        //执行回调，返回图片信息到父级
                        that.setState({ fileList },that.props.getImageInfo(fileList, 'add', fileList.length - 1))
                //     })
                // }else {
                //     that.setState({requestMultipleCount: count})
                // }
            }else {
                //执行回调，返回图片信息到父级
                that.setState({ fileList },that.props.getImageInfo(fileList, 'add', fileList.length - 1))
            }
        }).catch((err) =>{
            if(multiple) {
                //抛异常也算是一次请求了，只是没有成功
                if(count === selectMultipleCount) {
                    that.setState({
                        requestMultipleCount: 0
                    }, () => {
                        //执行回调，返回图片信息到父级
                        that.setState({ fileList },that.props.getImageInfo(fileList, 'add', fileList.length - 1))
                    })
                }else {
                    that.setState({
                        requestMultipleCount: count
                    })
                }
                message.error('某张图片上传失败，请检查网络问题，再上传一次')
            }else {
                message.error('图片上传失败')
            }

            console.log(err);
        });
    }

    // //上传前的处理
    // handleBeforeUpload = (file, fileList) => {
    //     // 多选上传时，需要标记一下选择了多少张图片
    //     if(this.state.multiple) {
    //         this.setState({selectMultipleCount: fileList.length})
    //     }
    //     return this.checkImageWH(file)
    // }

    //checkImageWH  返回一个promise  检测通过返回resolve  失败返回reject阻止图片上传
    // checkImageWH = (file) => {
    //     const that = this
    //     return new Promise(function (resolve, reject) {
    //         let fileReader = new FileReader();
    //         fileReader.onload = e => {
    //             let src = e.target.result;
    //             const image = new Image();
    //             image.onload = function () {
    //                 //校验图片信息
    //                 if (!that.isSizeImage(this.width, this.height)) {
    //                     reject();
    //                 } else {
    //                     resolve();
    //                 }
    //             };
    //             image.onerror = reject;
    //             image.src = src;
    //         };
    //         fileReader.readAsDataURL(file);
    //     });
    // }

    /**
     *
     * 判断图片尺寸
     *
     * @params nw 现图宽度
     * @params nh 现图高度
     *
     * @props handleType 竖图 vertical  横图 balance
     * @props minSizeWidth
     * @props maxSizeWidth
     * @props minSizeHeight
     * @props maxSizeHeight
     *
     * */
    isSizeImage = (nw, nh) => {
        const { handleType, minSizeWidth, maxSizeWidth, minSizeHeight, maxSizeHeight } = this.props
        if(!!minSizeWidth && minSizeWidth > nw) {
            Modal.warning({
                title: '图片宽度不能小于' + minSizeWidth + '像素（px）'
            })
            return false
        }
        if(!!maxSizeWidth && maxSizeWidth < nw) {
            Modal.warning({
                title: '图片宽度不能大于' + maxSizeWidth + '像素（px）'
            })
            return false
        }
        if(!!minSizeHeight && minSizeHeight > nh) {
            Modal.warning({
                title: '图片高度不能小于' + minSizeHeight + '像素（px）'
            })
            return false
        }
        if(!!maxSizeHeight && maxSizeHeight < nh) {
            Modal.warning({
                title: '图片高度不能大于' + maxSizeHeight + '像素（px）'
            })
            return false
        }

        let flag = true
        if(!!handleType && handleType === 'vertical') {
            if(nw > nh) {
                flag = false
                Modal.warning({
                    title: '请上传竖图'
                })
            }
            return flag
        }else if(!!handleType && handleType === 'balance') {
            if(nw < nh) {
                flag = false
                Modal.warning({
                    title: '请上传横图'
                })
            }
            return flag
        }else {
            return flag
        }

    }

    draggableSortDom = () => {
        const { fileList} = this.state
        const that = this
        return (
            <Draggable
                value={fileList}
                codeKey="id"
                sortKey="orderNumber"
                onChange={function (item) {
                    item.sort((a, b) => {
                        return b.orderNumber - a.orderNumber
                    })
                    console.log('onchange------------', item)
                    //执行回调，返回图片信息到父级
                    that.setState({ fileList },that.props.getImageInfo(item, 'add'))
                }}
                render={function (item, index) {
                    return (
                        <div className="upload-photo-wrapper" key={'upload-photo-wrapper-' + item.id}>
                            <div className="pms-upload-photo-container">
                                <div className="upload-photo-image">
                                    <img alt="图片" src={item.imgPath} />
                                    <div className="upload-photo-layer">
                                        <Icon
                                            type="eye"
                                            style={{color: '#ffffff', fontSize: 16, cursor: 'pointer'}}
                                            onClick={function () {
                                                that.handlePreview(item)
                                            }}
                                        />
                                        <Icon
                                            type="delete"
                                            style={{color: '#ffffff', fontSize: 16, marginLeft: 10, cursor: 'pointer'}}
                                            onClick={function () {
                                                that.handleRemove(item)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }}
            />
        )
    }

    render () {
        const { previewVisible, previewImage, fileList, imageLength, showDescription } = this.state
        const { isDragSort } = this.props
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">{this.props.placeholder || '可拖拽'}</div>
            </div>
        )
        //删掉uploading 对象
        fileList.forEach((item,index) => {
            if(!!item.status && item.status === 'uploading'){
                fileList.splice(index, 1)
            }
        })
        return (
            <div className="clearfix">
                {this.draggableSortDom()}
                <Upload
                    onBefore
                    listType="picture-card"
                    fileList={fileList}
                    showUploadList={!showDescription && !isDragSort}
                    multiple={this.state.multiple}
                    customRequest={this.handleCustomUpload}
                    // beforeUpload={this.handleBeforeUpload}
                    onPreview={this.handlePreview}
                    onRemove={this.handleRemove}
                >
                    {fileList.length >= imageLength ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%', padding: 15 }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}
export default UploadImage
