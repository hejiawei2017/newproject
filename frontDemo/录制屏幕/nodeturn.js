
var path = require("path")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var proc = new ffmpeg({ source: path.join(__dirname, './test2.fsv') })
    .withVideoCodec('mjpeg')
    .toFormat('mp4')
    .saveToFile('my_target.mp4', function (retcode, error) {
        console.log('file has been converted succesfully');
    });