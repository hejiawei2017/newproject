// ==============业务逻辑代码==========================
/* 定义变量 */
// 用户名
var roomid = getQueryString('room');
var userName = getQueryString('name');
if (!roomid || !userName) {
  alert('检测url上无房间号或者无用户名，并赋予默认值！');
  window.location.href = window.location.protocol + '//' + window.location.host + `?room=${roomid || '10'}&name=${userName || 'aaa'}`
}
// websocket 实例
var chatSocket;
// 获取摄像头和音频配置
var mediaConstraints = { "audio": true, "video": true };
// 视频盒子
var videoBox = document.getElementById('videoBox');
// 本地视频对象
var localVideo = document.getElementById('localVideo');
// 文本消息盒子
var textBox = document.getElementById('textBox');
// 提交文本消息按钮
var textMsg = document.getElementById('textMsg');
// 本地流
var localStream = null;
// 存储用户对象
var peerList = {};

// 初始化websocket
console.log("step1")
websocketInit();
// 显示本地视频 并且加入房间
getUserMedia();







// =================websocket====================
//建立websocket链接
function websocketInit() {
  try {
    // 浏览器提供 WebSocket 对象
    console.log("step2")
    chatSocket = new ReconnectingWebSocket('ws://172.30.220.205:3000');
  } catch (error) {
    console.log('发生错误：' + error);
  }

  // 监听消息
  chatSocket.onmessage = function (evt) {
    console.log("step4", evt)
    var msg = JSON.parse(evt.data);
    switch (msg.type) {
      case "joined":
        //返回用户列表和当前用户
        userJoined(msg.userList, msg.userName);
        var p = document.createElement('p');
        p.innerText = msg.userName + ' 加入了房间';
        p.className = 'p-hint';
        textBox.append(p);
        break;
      case "__ice_candidate":
        //如果是一个ICE的候选，则将其加入到PeerConnection中
        if (msg.candidate) {
          peerList[msg.account] && peerList[msg.account].addIceCandidate(msg.candidate).catch(() => { }
          );
        }
        break;
      case "error":
        alert(msg.msg);
        break;
      case "text":
        var p = document.createElement('p');
        p.innerText = msg.userName + ': ' + msg.text;
        textBox.append(p);
        break;
      // 信令消息:这些消息用于在视频通话之前的谈判期间交换WebRTC信令信息。
      case "video-offer":  // 发送 offer
        handleVideoOfferMsg(msg);
        break;
      case "video-answer":  // Callee已经答复了我们的报价
        peerList[msg.account] && peerList[msg.account].setRemoteDescription(msg.sdp, function () { }, () => { });
        break;
      case "disconnected": // 有人挂断了电话
        console.log(msg.account);
        let dom = document.querySelector('#' + [msg.account, userName].sort().join('-'));
        if (dom) {
          dom.remove();
          var p = document.createElement('p');
          p.innerText = msg.account + ' 退出了房间';
          p.className = 'p-hint';
          textBox.append(p);
        }
        break;
      // 未知的信息;输出到控制台进行调试。
      default:
        console.log("未知的信息收到了:");
        console.log(msg);
    }
  };
  //连接成功建立的回调方法
  chatSocket.onopen = function (event) {
    console.log("onopen");
  }
  //连接关闭的回调方法
  chatSocket.onclose = function () {
    chatSocket.close();
    console.log("websocket.onclose");
  }
  //连接发生错误的回调方法
  chatSocket.onerror = function () {
    console.log("chatSocket.error");
  };
  window.onbeforeunload = function () {
    chatSocket.close();
  }
}
// 监听用户加入
//data是用户列表，account是当前用户
function userJoined(data, account) {

  // 当大于一个与用户时
  if (data.length > 1) {
    data.forEach(v => {
      let obj = {};
      let arr = [v, userName];
      console.log("arr", arr)
      obj.account = arr.sort().join('-');
      if (!peerList[obj.account] && v !== userName) {
        //其他用户建立Peer链接，加载其他用户的视频
        console.log("obj", obj)
        getPeerConnection(obj);
      }
    });
    // 当前进入的用户，告诉其他用户我加入了
    if (account === userName) {
      // k = accout，peerList[k] = peer
      for (let k in peerList) {
        createOffer(k, peerList[k]);
      }
    }
  }
}
// 发送消息
function sendMessage(msg) {
  msg.roomid = roomid;
  chatSocket.send(JSON.stringify(msg));
}

// =============================webRTC===================
// 获取本地视频流，放到本地的vedio标签上面
async function getUserMedia() {
  try {

    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    localVideo.srcObject = localStream;
    sendMessage({
      userName: userName,
      type: 'join'
    });

  } catch (error) {
    console.log('获取本地摄像头失败：' + error);
  }
}
// 创建 RTCPeerConnection
function getPeerConnection(v) {
  let iceServer = {
    "iceServers": [//中继服务器
      {
        "url": "stun:stun.l.google.com:19302"
      }
    ],
    sdpSemantics: 'plan-b'
  };
  // let iceServer = {
  //   "iceServers": [
  //     {
  //       url: 'stun:172.30.221.205:8081'
  //     }
  //   ],
  //   sdpSemantics: 'plan-b'
  // };

  console.log("iceServer", iceServer)
  // 创建
  var peer = new RTCPeerConnection(iceServer);
  //向 RTCPeerConnection 中加入需要发送的流
  peer.addStream(localStream);
  // 判断使用哪个方法监听流
  var hasAddTrack = (peer.addTrack !== undefined);
  // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
  if (hasAddTrack) {
    peer.ontrack = (event) => {
      let videos = document.querySelector('#' + v.account);
      if (videos) {
        videos.srcObject = event.streams[0];
      } else {
        let video = document.createElement('video');
        video.controls = true;
        video.autoplay = 'autoplay';
        video.srcObject = event.streams[0];
        video.id = v.account;
        video.className = 'col-md-4';
        videoBox.append(video);
      }
    }
  } else {
    peer.onaddstream = (event) => {
      let videos = document.querySelector('#' + v.account);
      if (videos) {
        videos.srcObject = event.stream;
      } else {
        let video = document.createElement('video');
        video.controls = true;
        video.autoplay = 'autoplay';
        video.srcObject = event.stream;
        video.id = v.account;
        video.className = 'col-md-4';
        videoBox.append(video);
      }
    };
  }
  //有其他人进入，对应进入的哪个人的peer会触发这个回调，然后广播给其他人，WebSocket做消息转发
  peer.onicecandidate = (event) => {

    console.log("event.candidate", event)
    //event.candidate  是其他人的证书
    if (event.candidate) {
      sendMessage({
        type: '__ice_candidate',
        candidate: event.candidate,
        account: v.account
      });
    }
  };
  peerList[v.account] = peer;
}
// createOffer
function createOffer(account, peer) {
  //发送offer，发送本地session描述
  peer.createOffer({
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  }).then((desc) => {
    console.log("createOffer", desc)
    peer.setLocalDescription(desc, () => {
      sendMessage({
        type: 'video-offer',
        sdp: peer.localDescription,
        account: account
      });
    });
  });
}
// 其他人 收到offer请求
function handleVideoOfferMsg(v) {
  peerList[v.account] && peerList[v.account].setRemoteDescription(v.sdp, () => {
    peerList[v.account].createAnswer().then((desc) => {
      // console.log('send-answer', desc);
      peerList[v.account].setLocalDescription(desc, () => {
        sendMessage({
          type: 'video-answer',
          sdp: peerList[v.account].localDescription,
          account: v.account
        });
      });
    });
  }, () => { });
}






// ==============================其他方法==================
// 根据url 获取用户名和房间号创建多人视频聊天室 http://localhost:3001/?room=10&name=abc
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

// 点击按钮发送消息
function sendTextMsg() {
  if (textMsg.value) {
    sendMessage({
      type: 'text',
      userName: userName,
      text: textMsg.value
    });
    textMsg.value = '';
  }
}

// 键盘事件处理程序。这用于拦截返回和输入键，以便我们可以调用send()将输入的文本传输到服务器。
function handleKey(evt) {
  if (evt.keyCode === 13 || evt.keyCode === 14) {
    sendTextMsg();
  }
}