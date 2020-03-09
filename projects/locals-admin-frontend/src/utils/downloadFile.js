
let downloadFile = {
    download (src, fileName) {
        var index = src.lastIndexOf(".");
        var fType = src.substring(index + 1, src.length);
        if (this.isImageInChromeNotEdge(fType)) {//判断是否为chrome里的图片
            this.imgtToDataURL(src, fileName, fType);
        } else {
            this.downloadNormalFile(src, fileName);
        }
    },
    isImageInChromeNotEdge (fType) {
        let bool = false;
        if (window.navigator.userAgent.indexOf("Chrome") !== -1 && window.navigator.userAgent.indexOf("Edge") === -1)
            (fType === "jpg" || fType === "gif" || fType === "png" || fType === "bmp" || fType === "jpeg" || fType === "svg") && (bool = true);
        return bool;
    },
    downloadNormalFile (src, filename) {
        var link = document.createElement('a');
        link.setAttribute("download", filename);
        link.href = src;
        document.body.appendChild(link);//添加到页面中，为兼容Firefox浏览器
        link.click();
        document.body.removeChild(link);//从页面移除
    },
    imgtToDataURL (url, filename, fileType) {
        this.getBase64(url, fileType, (_baseUrl) => {
            // 创建隐藏的可下载链接
            var eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            // 图片转base64地址
            eleLink.href = _baseUrl;
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        });

    },
    getBase64 (url, fileType, callback) {
        //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片
        var Img = new Image(),
            dataURL = '';
        Img.src = url;
        Img.setAttribute("crossOrigin", 'Anonymous');
        Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
            var canvas = document.createElement("canvas"), //创建canvas元素
                width = Img.width, //确保canvas的尺寸和图片一样
                height = Img.height;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
            dataURL = canvas.toDataURL('image/' + fileType); //转换图片为dataURL
            if(callback) {
                callback(dataURL)
            }
        };
    }
}
export default downloadFile