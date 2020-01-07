const request = require('../../../utils/request');
const {shareDataFormat, gioTrack} = require('../../../utils/util')

const NOOP = () => undefined;
const app = getApp();

Page({
	data: {
		options: {},
		imageUrl:'',
		title:'',
		path:'',
		showSaveBtn: 'true',
		type:null
	},
	onLoad: function (options) {
		this.setData({
			options,
		})
	},

	onReady: function () {
		let { title, path, imageUrl, type = '', showSaveBtn = 'true' } = this.data.options
		this.setData({
			title: decodeURIComponent(title),
			path: decodeURIComponent(path),
			imageUrl: decodeURIComponent(imageUrl),
			type,
			showSaveBtn
		})
		// 判断是否已有海报直接显示
		if(type === 'havePoster') return
		const { userInfo } = app.globalData;
		const selfInviteCode = wx.getStorageSync('selfInviteCode')
		const qs = `scene=${encodeURIComponent(`springRalationFromUserId=${userInfo.id}`)}&path=${encodeURIComponent(path)}&inviteCode=${selfInviteCode}`;
		request.get(`https://i.localhome.cn/api/common/qrcode?${qs}`).then(res => {
			this.selectComponent('#poster').draw(
				decodeURIComponent(imageUrl),
				`https://uat.localhome.cn${res.data}`
			);
		});

	},
	onShow() {
		wx.pageScrollTo({ scrollTop: 200 });
	},
	saveToAlbum() {
		if (this.data.path.indexOf('1908011111356') > -1) {// 砍价活动统计保存图片次数
			gioTrack('bargain_save_poster')
		}

		const { imageUrl, type } = this.data
		if(type === 'havePoster') {
			this.havePosterToSave(imageUrl)
			return
		}
		this.selectComponent('#poster')
			.getPosterPath()
			.then(({ tempFilePath: filePath }) => {
				wx.saveImageToPhotosAlbum({
					filePath,
					success(res) {
						wx.showToast({
							title: '保存成功',
							icon: 'none',
							success: function () {
								wx.navigateBack()
							}
						});
					},
					fail() {
						wx.showModal({
							title: '提示',
							content: '保存失败',
							showCancel: false,
						});
					},
				});
			});
	},

	havePosterToSave(imageUrl) {
		if(!imageUrl) return
		wx.showLoading({ title: '保存中', mask: true })
		wx.getImageInfo({
      src: imageUrl,
      success (res) {
				wx.saveImageToPhotosAlbum({
					filePath:res.path,
					success() {
						wx.showToast({ title: '保存成功', icon: 'success', duration: 2000 });
						setTimeout(() => { wx.navigateBack() }, 2000)						
					},
					fail() {
						wx.showModal({ title: '提示', content: '保存失败', showCancel: false });
						wx.hideLoading()
					}
				});
      }
    })
	},

	onShareAppMessage: function () {
		const { userInfo } = app.globalData;
		let path = this.data.path;
		const matchStr = path.match(/@(\w+)@/) && path.match(/@(\w+)@/)[1] ? path.match(/@(\w+)@/)[1] : ''
		if (matchStr === "u") {
			path = path.replace(/@(\w+)@/, "https://i.localhome.cn/v/1904222209237/#/sharePage")
		}
		if (path.indexOf('1908011111356') > -1) { // 砍价活动统计分享次数
			gioTrack('bargain_share_friend')
		}
		// 用户点击右上角分享
		return shareDataFormat({
			path,
			title: this.data.title,
			imageUrl: decodeURIComponent(this.data.imageUrl)
		})
	},
});
