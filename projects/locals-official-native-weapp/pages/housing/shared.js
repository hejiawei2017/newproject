const {
  nodeApi
} = require('../../config/config')

const BASE_API = nodeApi


/**
 * 播放notices
 * @param {*} notices 
 * @param {*} index 
 */
function playNotice(notices, isCycle = false, index = 0) {
  if (index >= notices.length) {
    if (isCycle) {
      index = 0
    } else {
      this.setData({
        notice: null
      })
      return
    }
  }
  const notice = notices[index]
  const noticeTimer = setTimeout(() => {
    playNotice.call(this, notices, isCycle, index + 1)
  }, 1000)
  this.setData({
    notice: notice,
    noticeTimer
  })
}


function stopNoticeTimer() {
  const timer = this.data.noticeTimer
  clearTimeout(timer)
}

module.exports = {
  BASE_API,
  playNotice,
  stopNoticeTimer
}