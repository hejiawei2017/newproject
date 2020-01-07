Page({
  data: {
    currentIndex: 0,
    agree: false,
    cards: [
      {
        id: 0,
        money: 300,
        title: '300元',
        descript: '送50券'
      },
      {
        id: 1,
        money: 800,
        title: '800元',
        descript: '送50券'
      },
      {
        id: 2,
        money: 2000,
        title: '2000元',
        descript: '送50券'
      },
      {
        id: 3,
        money: 5000,
        title: '5000元',
        descript: '送50券'
      }
    ]
  },
  selectCard(e) {
    let { index } = e.currentTarget.dataset
    this.setData({
      currentIndex: index
    })
  },
  changeAgree() {
    this.setData({
      agree: !this.data.agree
    })
  }
})