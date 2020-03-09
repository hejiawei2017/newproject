import React, { Component } from 'react'
import { notification, Icon, Upload } from 'antd'
import XLSX from 'xlsx'
import { uploadImportService } from "../../services";
import {createUUID} from "../../utils/utils"
/**
 * 插件说明：
 * version：1.0
 * 实例：<ExcelUpload stateChange={_this.stateChange} changeKey="tableData" exportKey={exportKey}>
 *   1、<Icon type="cloud-upload-o" />上传Execl文件  // 子集Dom --选填
 * </ExcelUpload>
 * stateChange 上传完改变事件
 * changeKey 改动的状态
 * exportKey excel 取值head数组
 * exportKey = {
 *  'key': {
 *      key: '手机', //【必填】name
 *      required: true, //【可选】必填bol
 *      rules: /^[1][3,4,5,7,8][0-9]{9}$/, //【可选】正则
 *      pros: _state.payTypeNum, // 【可选】对象取值
 *      toFixed: 2 // [可选] 数据取值格式
 *  }
 *}
 * type= "big|objToUrl" big,转换xlsx 后上传，objToUrl 上传返回url
 * changeFileName="fileUrl"  url 改变的键
  extraKey={extraKey} [选填]额外参数
 */

class ExcelUpload extends Component {
    uploadCustomRequest = ({file})=>{
        if(this.props.getFileName){
            this.props.getFileName(file.name)
        }
        const isXls = (/\.(csv|xls|xlsx)$/).test(file.name)
        const _this = this
        if (!isXls) {
            notification.error({
                message: '请上传Excel!'
            })
            return
        }
        let wb
        var reader = new FileReader()
        if(_this.props.type === 'objToUrl'){
            const uuid = createUUID('xxxxxxxxxxxxxxxx',10)
            uploadImportService.upload(file, uuid, uuid + '.xlsx').then((data)=>{
                _this.props.stateChange({
                    [_this.props.changeFileName || 'fileUrl']: data.filePath
                })
            })
        }
        reader.onload = function (e) {
            let {exportKey, extraKey, type} = _this.props
            var data = e.target.result
            var customerList = []
            wb = XLSX.read(data, {type: 'binary'})
            const xlsxList = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
            //表格没有数据
            if (xlsxList.length === 0) {
                notification.error({message:'导入表格没有内容'})
                return
            }
            let oHeader = []
            extraKey = extraKey || {}
            if(!exportKey){
                // notification.error({message:'文档格式和参数不一致'})
                console.error('没有设置导出参数')
                return false
            }
            xlsxList.map((data, index) => {
                let params = {}
                let bol = false
                for (const i in exportKey){
                    index === 0 && oHeader.push(i)
                    const item = exportKey[i]
                    let ItemData = data[item.key]
                    // 判断 Excel 值判断格式
                    if( (!item.required) ||
                        (item.required && ((item.rules && item.rules.test(ItemData) || ( (!item.rules) && ItemData))))
                    ){
                        params[i] = item.pros ? item.pros[ItemData] : ItemData
                        if(item.toFixed){
                            if(ItemData && ItemData > 0){
                                // 出现浮点值漏出
                                // const pow = Math.pow(10, item.toFixed)
                                // ItemData = parseInt(ItemData * pow, 10) / pow
                                // params[i] = Number(ItemData).toFixed(item.toFixed)
                                params[i] = Number(ItemData).toFixed(item.toFixed)
                            }else{
                                params[i] = ItemData
                            }
                        }
                    }else{
                        bol = true
                    }
                }
                if (bol) {
                    notification.error({message:`第${data.__rowNum__}行，不符合参数规范，请检查`})
                }else{
                    customerList.push({...extraKey,...params})
                }
                return data
            })
            if(type === 'big'){
                var blod = _this.downloadExl(customerList, oHeader)
                // var blod = _this.uploadXLSX(customerList, oHeader)
                const uuid = createUUID('xxxxxxxxxxxxxxxx',10)
                uploadImportService.upload(blod, uuid, uuid + '.xlsx').then((data)=>{
                    // console.log(data)
                    _this.props.stateChange({
                        [_this.props.changeFileName || 'fileUrl']: data.filePath
                    })
                })
            }else{
                _this.props.stateChange({
                    [_this.props.changeKey || 'tableData']: customerList
                })
            }
        }
        reader.readAsBinaryString(file)
    }
    uploadXLSX = (data, oHeader) => {
        // console.log('uploadXLSX', data, oHeader)
        if(this.props.type === 'big'){
            let header = {header:oHeader}
            const ws = XLSX.utils.json_to_sheet(data,header)
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
            return XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'binary' })
        }
    }
    downloadExl = (json, oHeader) => {
        let tmpDown
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        tmpdata = []; //用来保存转换好的json
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
            v: v[k],
            position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var tmpWB = {
            SheetNames: ['mySheet'], //保存的表标题
            Sheets: {
                'mySheet': Object.assign({},
                    tmpdata, //内容
                    {
                        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                    })
            }
        };
        tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
            { bookType: 'xlsx', bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
        ))], {
            type: ""
            // name: "测试.xlsx"
        }); //创建二进制对象写入转换好的字节流
        console.log("tmpDown", tmpDown)
        return tmpDown;
    }
    s2ab = (s) => { //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
    getCharCol = (n) => {
        let
            s = '',
            m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
    }
    render () {
        const uploadProps = {
            customRequest: this.uploadCustomRequest,
            showUploadList: false
        }
        return (
            <div className="excel-upload">
                <Upload {...uploadProps}>
                    {
                        this.props.children ? this.props.children :
                            (<span><Icon type="cloud-upload-o" />上传Execl文件</span>)
                    }
                </Upload>
            </div>
        )
    }
}

export default ExcelUpload
