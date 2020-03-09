import React, { Component } from 'react'
import {Upload, Icon, Modal, Input} from 'antd'
import Draggable from '../Draggable/index'
import OSS from 'ali-oss'
import './index.less'

import {createUUID} from "../../utils/utils"
import {message} from "antd/lib/index";
const env = process.env.MY_ENV || 'dev'
const { TextArea } = Input

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
        pathFile: 'aai/' //默认aai
        isDragSort: true, // 开启拖拽排序
        disabled: false, // 是否禁用上传
        disabledRemove: false, // 禁止删除
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
        minFileSize: 200,（KB） 文件大小限制，默认不传不判断
        maxFileSize: 1000,（KB） 文件大小限制，默认不传不判断
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
            imageLength: (props.imageLength === undefined || props.imageLength === null) ? 1 : props.imageLength,
            fileList: JSON.parse(JSON.stringify(props.imageUrlList)) || [],
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
                fileList: JSON.parse(JSON.stringify(nextProps.imageUrlList))
            })
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handleRemove = (file) => {
        const { disabledRemove } = this.props;
        if(!disabledRemove) { //不禁止删除
            let fileList = this.state.fileList
            let operateIndex = -1
            fileList.forEach((item,index) => {
                if(file.uid === item.uid) {
                    fileList.splice(index, 1)
                    operateIndex = index
                }
            })
            this.setState({fileList}, this.props.getImageInfo(fileList, 'delete', operateIndex))
        }
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }
    handleCustomUpload = (option) => {
        let ids = createUUID('xxxxxxxxxxxxxxxx',10)
        let that = this
        let path = this.props.pathFile || "aai/"
        let { fileList, requestMultipleCount, selectMultipleCount } = this.state;
        const { multiple } = this.props;
        const count = requestMultipleCount + 1
        that.setState({requestMultipleCount: count})
        client.put(path + ids + ".png", option.file).then(result => {
            fileList.push({
                uid: createUUID('xxxxxxxxxxxxxxxx',10),
                url: result.url,
                status: 'done',
                orderNumber: fileList.length > 0 && !!fileList[fileList.length - 1].orderNumber ? (fileList[fileList.length - 1].orderNumber + 1) : 1
            })
            //多选时进入
            if(multiple) {
                //判断当前request 是否已经到最后一次上传了，如果是，就把图片数组对象返回到父级，否则，先缓存好图片
                if(selectMultipleCount === count) {
                    that.setState({
                        requestMultipleCount: 0
                    }, () => {
                        //执行回调，返回图片信息到父级
                        that.setState({ fileList },that.props.getImageInfo(fileList, 'add', fileList.length - 1))
                    })
                }else {
                    that.setState({requestMultipleCount: count})
                }
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

    //上传前的处理
    handleBeforeUpload = (file, fileList) => {
        const { multiple } = this.props;
        // 多选上传时，需要标记一下选择了多少张图片
        if(multiple) {
            this.setState({selectMultipleCount: fileList.length})
        }
        return this.checkImageWH(file)
    }

    //checkImageWH  返回一个promise  检测通过返回resolve  失败返回reject阻止图片上传
    checkImageWH = (file) => {
        const that = this
        return new Promise(function (resolve, reject) {
            let fileReader = new FileReader();
            fileReader.onload = e => {
                let src = e.target.result;
                const image = new Image();
                image.onload = function () {
                    //校验图片信息
                    const fSize = Math.round(file.size / 1024 * 100) / 100;
                    if (!that.isSizeImage(this.width, this.height, fSize)) {
                        reject();
                    } else {
                        resolve();
                    }
                };
                image.onerror = reject;
                image.src = src;
            };
            fileReader.readAsDataURL(file);
        });
    }

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
    isSizeImage = (nw, nh, fileSize) => {
        const { handleType, minSizeWidth, maxSizeWidth, minSizeHeight, maxSizeHeight, minFileSize, maxFileSize } = this.props
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

        if(!!minFileSize && minFileSize > fileSize) {
            Modal.warning({
                title: '图片文件大小不可小于' + minFileSize + 'KB '
            })
            return false
        }
        if(!!maxFileSize && maxFileSize < fileSize) {
            Modal.warning({
                title: '图片文件大小不可大于' + Math.round(maxFileSize / 1024 * 100) / 100 + 'M '
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
    handleTextAreaChange = (event, index) => {
        let fileList = this.state.fileList
        event.persist()
        fileList[index].description = event.target.value
        this.setState({fileList})
    }
    //失焦时，把对应的描述信息返回到父级
    handleSubmitDescription = (operateIndex) => {
        this.props.getImageInfo(this.state.fileList, 'edit', operateIndex)
    }

    draggableSortDom = () => {
        const { fileList } = this.state;
        const { placeholder = '图片描述', showDescription } = this.props;
        const that = this
        return (
            <Draggable
                value={fileList}
                codeKey="uid"
                sortKey="orderNumber"
                onChange={function (item) {
                    item.sort((a, b) => {
                        return b.orderNumber - a.orderNumber
                    })
                    //执行回调，返回图片信息到父级
                    that.setState({ fileList },that.props.getImageInfo(item, 'add'))
                }}
                render={function (item, index) {
                    return (
                        <div className="upload-photo-wrapper" key={'upload-photo-wrapper-' + item.uid}>
                            <div className="upload-photo-container">
                                <div className="upload-photo-image">
                                    <img alt="图片" src={item.url} />
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
                            {
                                showDescription ?
                                    <div className="upload-photo-describe">
                                        <TextArea
                                            onChange={function (event) {
                                                that.handleTextAreaChange(event, index)
                                            }}
                                            onBlur={function () {
                                                that.handleSubmitDescription(index)
                                            }}
                                            value={item.description}
                                            placeholder={placeholder}
                                            style={{fontSize: 12, display: 'block'}}
                                        />
                                    </div> : null
                            }
                        </div>
                    )
                }}
            />
        )
    }

    //展示加描述的图片页面
    overwriteShowUploadImageView = () => {
        const { fileList } = this.state
        const { isDragSort, placeholder = '图片描述', showDescription } = this.props
        const that = this

        //isDragSort为true，就开启拖拽模式，否则不开启
        return isDragSort ? this.draggableSortDom() :
            fileList.map((item, index) => {
            return (
                <div className="upload-photo-wrapper" key={item.uid}>
                    <div className="upload-photo-container">
                        <div className="upload-photo-image">
                            <img alt="图片" src={item.url} />
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
                    {
                        showDescription ?
                            <div className="upload-photo-describe">
                                <TextArea
                                    onChange={function (event) {
                                        that.handleTextAreaChange(event, index)
                                    }}
                                    onBlur={function () {
                                        that.handleSubmitDescription(index)
                                    }}
                                    value={item.description}
                                    placeholder={placeholder}
                                    style={{fontSize: 12, display: 'block'}}
                                />
                            </div> : null
                    }

                </div>
            )
        })
    }

    render () {
        const { previewVisible, previewImage, fileList } = this.state;
        const { isDragSort, disabled = false, showDescription, imageLength = 1, placeholder = '图片描述', multiple } = this.props
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">{placeholder || '可拖拽'}</div>
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
                {
                    showDescription || isDragSort ? this.overwriteShowUploadImageView() : null
                }
                <Upload
                    onBefore
                    multiple={multiple}
                    disabled={disabled}
                    listType="picture-card"
                    fileList={fileList}
                    showUploadList={!showDescription && !isDragSort}
                    customRequest={this.handleCustomUpload}
                    beforeUpload={this.handleBeforeUpload}
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
