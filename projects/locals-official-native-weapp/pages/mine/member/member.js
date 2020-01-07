Page({
  data: {
    tabs: ['银卡会员', '金卡会员', '黑卡会员'],
    dataSource: {
      activeIndex: 0, //tab当前索引
      //银卡会员，金卡会员，黑卡会员数据源
      silverCard: [
        {
          id: '1',
          serviceName: '行李寄存',
          countNum: 2,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E8%A1%8C%E6%9D%8E%E5%AF%84%E5%AD%98.png'
        },
        {
          id: '2',
          serviceName: '现场接待',
          countNum: 2,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E7%8E%B0%E5%9C%BA%E6%8E%A5%E5%BE%85.png'
        },
        {
          id: '3',
          serviceName: '延迟退房',
          countNum: 2,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E5%BB%B6%E8%BF%9F%E9%80%80%E6%88%BF.png'
        },
        {
          id: '4',
          serviceName: '免费保洁',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E5%85%8D%E8%B4%B9%E4%BF%9D%E6%B4%81.png'
        },
        {
          id: '5',
          serviceName: '9.6折',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine80/96.png'
        },
        {
          id: '6',
          serviceName: '专属管家',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E4%B8%93%E5%B1%9E%E7%AE%A1%E5%AE%B6.png'
        },
        {
          id: '7',
          serviceName: '生日红包',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E7%94%9F%E6%97%A5%E7%BA%A2%E5%8C%85.png'
        },
        {
          id: '8',
          serviceName: '欢迎水果',
          countNum: -10,
          isNoRight: true,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E6%AC%A2%E8%BF%8E%E6%B0%B4%E6%9E%9C.png'
        }
      ],
      goldenCard: [
        {
          id: '9',
          serviceName: '行李寄存',
          countNum: 4,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E8%A1%8C%E6%9D%8E%E5%AF%84%E5%AD%98.png'
        },
        {
          id: '10',
          serviceName: '现场接待',
          countNum: 4,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E7%8E%B0%E5%9C%BA%E6%8E%A5%E5%BE%85.png'
        },
        {
          id: '11',
          serviceName: '延迟退房',
          countNum: 4,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E5%BB%B6%E8%BF%9F%E9%80%80%E6%88%BF.png'
        },
        {
          id: '12',
          serviceName: '免费保洁',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E5%85%8D%E8%B4%B9%E4%BF%9D%E6%B4%81.png'
        },
        {
          id: '13',
          serviceName: '9.2折',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine80/92.png'
        },
        {
          id: '14',
          serviceName: '专属管家',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E4%B8%93%E5%B1%9E%E7%AE%A1%E5%AE%B6.png'
        },
        {
          id: '15',
          serviceName: '生日红包',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E7%94%9F%E6%97%A5%E7%BA%A2%E5%8C%85.png'
        },
        {
          id: '16',
          serviceName: '欢迎水果',
          countNum: -10,
          isNoRight: true,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E6%AC%A2%E8%BF%8E%E6%B0%B4%E6%9E%9C.png'
        }
      ],
      blackCard: [
        {
          id: '17',
          serviceName: '行李寄存',
          countNum: -1,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E8%A1%8C%E6%9D%8E%E5%AF%84%E5%AD%98.png'
        },
        {
          id: '18',
          serviceName: '现场接待',
          countNum: -1,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E7%8E%B0%E5%9C%BA%E6%8E%A5%E5%BE%85.png'
        },
        {
          id: '19',
          serviceName: '延迟退房',
          countNum: -1,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E5%BB%B6%E8%BF%9F%E9%80%80%E6%88%BF.png'
        },
        {
          id: '20',
          serviceName: '免费保洁',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E5%85%8D%E8%B4%B9%E4%BF%9D%E6%B4%81.png'
        },
        {
          id: '21',
          serviceName: '8.8折',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/8.8%E6%8A%98.png'
        },
        {
          id: '22',
          serviceName: '专属管家',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E4%B8%93%E5%B1%9E%E7%AE%A1%E5%AE%B6.png'
        },
        {
          id: '23',
          serviceName: '生日红包',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E7%94%9F%E6%97%A5%E7%BA%A2%E5%8C%85.png'
        },
        {
          id: '24',
          serviceName: '欢迎水果',
          countNum: -10,
          src:
            'https://locals-house-prod.oss-cn-shenzhen.aliyuncs.com//localhomeqy/mine08/%E6%AC%A2%E8%BF%8E%E6%B0%B4%E6%9E%9C.png'
        }
      ]
    },
    dataList: [] //当前组件渲染的数据
  },
  onLoad() {
    this.setData({
      dataList: [...this.data.dataSource.silverCard]
    })
    this.setData({
      activeIndex: 0
    })
  },

  tabClick(e) {
    let activeIndex = e.detail.activeIndex
    console.log(activeIndex)
    this.setData({
      activeIndex: activeIndex
    })
    if (activeIndex == 0) {
      this.setData({
        dataList: [...this.data.dataSource.silverCard]
      })
    } else if (activeIndex == 1) {
      this.setData({
        dataList: [...this.data.dataSource.goldenCard]
      })
    } else if (activeIndex == 2) {
      this.setData({
        dataList: [...this.data.dataSource.blackCard]
      })
    }
  }
})
