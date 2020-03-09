
import React, {Component} from 'react'
import ComponentUploadImage from '../components/uploadHotelImage'

class DragImg extends Component {
    constructor (props) {
        super(props)
        this.state = {
            fileLists: this.props.lists,
            previewVisible: true,
            imagesLists: this.props.imagesLists
        }
    }

    componentWillUpdate (nextProps){
        if(!!nextProps.imagesLists && JSON.stringify(nextProps.imagesLists) !== JSON.stringify(this.state.imagesLists)) {
            this.setState({
                imagesLists: nextProps.imagesLists
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
                imgPath: item.imgPath,
                description: item.description
            })
        })
        let params = {
            module: moduleName,
            images: images
        }
        this.props.onChange(params)
    }

    //删除路客横图
    deleteBalanceImage = (item, operateIndex) => {
        this.props.onChange(item)
    }

    render () {
        const _this = this
        const {imagesLists} = this.state
        return (
            <div className="formBottom">
                <div className="padder-vb-md" style={{display:"flex",padding:"0 20px"}}>
                    <div style={{fontSize:"16px",fontWeight:600,flex:1}}>门店照片</div>
                </div>
                <div style={{padding:"10px 20px 40px"}}>
                    {
                        imagesLists.map((item,index) => {
                            return (
                              <div key={index}>
                                    <ComponentUploadImage
                                        multiple
                                        showDescription
                                        isDragSort
                                        imageUrlList={item.images}
                                        imageLength={500}
                                        handleType="balance"
                                        getImageInfo={function (fileList, operateType, operateIndex) {
                                            if(operateType === 'add') {
                                                _this.addBalanceImage(fileList, item.module)
                                            }else if(operateType === 'delete') {
                                                _this.deleteBalanceImage(item, operateIndex)
                                            }
                                        }}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default DragImg
