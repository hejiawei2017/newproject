/**
 * 打开 PDF 或 world 等
 */

function saveStore(remoteURI, localPath) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: remoteURI,
      data: localPath,
      success: resolve,
      fail: reject
    });
  });
}

function loadStore(remoteURI) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: remoteURI,
      fail: reject,
      success: function(res) {
        resolve(res.data);
      }
    });
  });
}

function openDocument(localPath) {
  return new Promise((resolve, reject) => {
    wx.openDocument({
      filePath: localPath,
      fail: reject,
      success(res) {
        resolve(localPath);
      }
    });
  });
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: url,
      fail: reject,
      success(res) {
        const filePath = res.tempFilePath;
        resolve(filePath);
      }
    });
  });
}

function hanldHttps(url) {
  return /^http:/.test(url) ? url.replace('http:', 'https:') : url;
}

module.exports = originalURL => {
  const url = hanldHttps(originalURL);
  wx.showLoading({ title: '请稍等' });
  loadStore(url)
    .then(localPath => {
      return openDocument(localPath);
    })
    .catch(() => {
      return downloadFile(url);
    })
    .then(localPath => {
      return openDocument(localPath);
    })
    .then(localPath => {
      saveStore(url, localPath);
      wx.hideLoading();
    })
    .catch(error => {
      console.log('TCL: error', error);
      wx.hideLoading();
      wx.showToast({
        title: '打开内容失败',
        icon: 'none',
        duration: 1500,
        mask: true
      });
    });
};
