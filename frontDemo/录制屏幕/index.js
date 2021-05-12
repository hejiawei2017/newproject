
// const videoElem = document.getElementById("video");
// const logElem = document.getElementById("log");
// const startElem = document.getElementById("start");
// const stopElem = document.getElementById("stop");
// const downloadElem = document.getElementById("download");

// var rander = null;

// const displayMediaOptions = {
//     video: {
//         cursor: "always",
//     },
//     audio: true
// };
// var randerEvent = {
//     allChunks: [],
//     ondataavailable(e) {
//         randerEvent.allChunks.push(
//             e.data
//         );
//     },
//     download: function () {
//         var fullBlob = new Blob(randerEvent.allChunks);
//         var downloadUrl = window.URL.createObjectURL(fullBlob);
//         var link = document.createElement("a")
//         link.href = downloadUrl;
//         link.download = 'media.webm';
//         link.click()
//     },
// }

// startElem.addEventListener("click", function (evt) {
//     startCapture();

// }, false);
// stopElem.addEventListener("click", function (evt) {
//     stopCapture();
// }, false);

// downloadElem.addEventListener("click", function (evt) {
//     stopCapture();
//     randerEvent.download()

// }, false);
// console.log = msg => logElem.innerHTML += `${msg}<br>`;
// console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
// console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
// console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;



// async function startCapture() {
//     logElem.innerHTML = "";
//     try {
//         var stream = null
//         stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

//         rander = new window.MediaRecorder(stream);
//         videoElem.srcObject = stream;
//         dumpOptionsInfo();
//         rander.start(100);
//     } catch (err) {
//         console.error("Error: " + err);
//     }
//     rander.ondataavailable = randerEvent.ondataavailable
// }

// function stopCapture(evt) {
//     let tracks = videoElem.srcObject.getTracks();
//     tracks.forEach(track => track.stop());
//     videoElem.srcObject = null;
//     rander.stop()
// }


// function dumpOptionsInfo() {
//     const videoTrack = videoElem.srcObject.getVideoTracks()[0];
//     console.info("Track settings:");
//     console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
//     console.info("Track constraints:");
//     console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
// }




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
    downloadVedio() {
        this.stopCapture()
        var fullBlob = new Blob(this.allChunks);
        var downloadUrl = window.URL.createObjectURL(fullBlob);
        var link = document.createElement("a")
        link.href = downloadUrl;
        link.download = 'myVideo.webm';
        link.click()
    }
}

var cap = new Captivate()
cap.startCapture();
setTimeout(() => {
    cap.downloadVedio()
}, 10000)