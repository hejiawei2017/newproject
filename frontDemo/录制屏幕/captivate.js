const config = require('@/p.config.js');
import axios from 'axios';
class Captivate {
    constructor() {
        this.rander = null;
        this.innerTimer = 100;
        this.stream = null;
        this.displayMediaOptions = {
            video: {
                cursor: "always",
            },
            audio: true
        }
        this.allChunks = [];

    }
    startCapture() {
        try {
            this.initDisplayMedia()
        } catch (err) {
            console.error("Error: " + err);
        }
    }
    async initDisplayMedia() {
        this.stream = await navigator.mediaDevices.getDisplayMedia(this.displayMediaOptions);
        this.MediaRecorder(this.stream)
        this.initRanderEvent()
    }
    MediaRecorder(stream) {
        this.rander = new window.MediaRecorder(stream);
        this.rander.start(this.innerTimer);
    }
    initRanderEvent() {
        var _this = this
        this.rander.ondataavailable = function (event) {
            _this.allChunks.push(event.data)
        }
    }
    stopCapture() {
        let tracks = this.stream.getTracks();
        tracks.forEach(track => track.stop());
        this.rander.stop()
        this.stream = null;
    }
    downloadVideo() {
        this.stopCapture()
        var fullBlob = new Blob(this.allChunks);
        var downloadUrl = window.URL.createObjectURL(fullBlob);
        var link = document.createElement("a")
        link.href = downloadUrl;
        link.download = 'myVideo.webm';
        link.click()
    }
    uploadVideo(fn) {
        var blob = new Blob(this.allChunks, { type: "video/webm" });
        var file = new File(
            [blob],
            "msr-" + new Date().toISOString().replace(/:|\./g, "-") + ".webm",
            {
                type: "video/webm"
            }
        );
        var formData = new FormData();
        let formData = new FormData();
        formData.append('fileName', file.name);
        formData.append('attachData', file);
        let url =
            config.apphead + '/access/form/FRONT-COMM/GTCCOMMATTACH11'; //你的后台上传地址
        axios
            .post(url, formData)
            .then((res) => {
                console.log(res);
                if (res.data && res.data.status == 'success') {
                    fn && fn(res)
                }
            })
            .catch((error) => {
                vm.$message.error('抱歉截图上传失败，请稍后重试');
            });

    }
}

// var cap = new Captivate()
// cap.startCapture();
// setTimeout(() => {
//     cap.downloadVideo()
// }, 10000)

export default Captivate