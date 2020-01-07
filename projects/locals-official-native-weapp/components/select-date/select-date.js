/**
 * 日历组件
 * @prop startDate 入住日期， 格式：2018-09-10
 * @prop endDate 离开日期，格式：2018-09-11
 * @prop calendarList 接口提供的房源日历,没有此属性时不会显示房源日历可选和房晚金额
 * @prop bind:getRangeDate 获取日历结果
 */

let moment = require("../../utils/dayjs.min.js")
let { getDiffDays } = require('../../utils/util')
const app = getApp()

Component({
  properties: {
    startDate: {
      type: String,
      value: '',
      observer(value) {
        if (value) {
          this.setData({
            markStartDate: true
          })
        }
        this.createDateListData()
        this.setCheckinDays()
      }
    },
    endDate: {
      type: String,
      value: '',
      observer(value) {
        if (value) {
          this.setData({
            markEndDate: true
          })
        }
        this.createDateListData()
        this.setCheckinDays()
      }
    },
    calendars: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {
        let getType = (val) => {
          return Object.prototype.toString.call(val)
        }
        if (getType(newVal) !== "[object Object]" || getType(oldVal) !== "[object Object]") {
          throw new Error(`component prop: type of calendars is not Object`)
        }
        // 判断对象是否为空
        let keys = Object.getOwnPropertyNames(newVal)
        if (keys.length > 0) {
          this.setData({
            isShowCaledarDetail: true
          })
          this.createDateListData()
        }
      }
    }
  },
  data:{
    isFullScreen: app.globalData.isFullScreen,
    maxMonth: 6, //最多渲染月数
    dateList: [],
    systemInfo: {},
    weekStr: ['日','一','二','三','四','五','六'],
    markStartDate: false, //标记开始时间是否已经选择
    markEndDate: false,   //标记结束时间是否已经选择
    // 显示日历的详情：金额、可否入住
    isShowCaledarDetail: false,
    checkinDays: 0,
    isShowView: false,
    // 日历需要特别显示的数据
    calendarData: {}
  },
  ready() {
    this.DATE_YEAR = moment().year()
    this.DATE_MONTH = moment().month() + 1
    this.DATE_DAY = moment().date()
    wx.getSystemInfo({
      success: res => {
        this.setData({
          isShowView: true,
          systemInfo: res
        })
      }
    })
    // 是否已经遇到库存为0的房源日历
    this.HAS_RUN_INTO_EMPTY_STOCK_DATE = ''
    // 获取房源特别数据
    this.getCalendarData();
    // 页面初始化
    this.createDateListData();
  },
  methods: {
    setCheckinDays() {
      this.setData({
        checkinDays: getDiffDays(this.data.startDate, this.data.endDate)
      })
    },
    getFull(num) {
      if (num < 0) {
        return num
      }
      return num > 9 ? num : `0${num}`
    },
    /**
     * calendars 房源日历 {'2018-08-27':{roomPrice: 219, stock: 1}, '2018-08-28':{roomPrice: 219, stock: 1},......}
     * roomPrice	价格	
     * stock	库存	0表示不可订
     */
    createDateListData() {
      const { isShowCaledarDetail, calendars, startDate, endDate } = this.data
      let dateList = [];

      for (let i = 0; i < this.data.maxMonth; i++) {
        let yearMonth = moment().add(i, 'month')
        let year = moment(yearMonth).year();
        let month = moment(yearMonth).month() + 1;
        let fullMonth = this.getFull(month)
        let days = [];
        let totalDay = this.getTotalDayByMonth(year, month);
        let week = this.getWeek(year, month, 1);
        let lastWeekDay = this.getWeek(year, month, totalDay);
        let paddingEndCount = 6 - lastWeekDay;
        // 填充最后的日期，使铺满一层日历
        totalDay = totalDay + paddingEndCount
        for (let day = -week + 1; day <= totalDay; day++) {
            let fullDay = this.getFull(day)
            let id = `${year}-${fullMonth}-${fullDay}`
            let className = '';
            let isPadding = false

            if(day < this.DATE_DAY && year == this.DATE_YEAR && month == this.DATE_MONTH) {
              // 当天之前的日期不可用
              className += ' unavailable';
            } else {
              className += ' nostate'
            }
            if (startDate === id) {
              className += ' active '
              if (this.data.markStartDate && this.data.markEndDate) {
                className += ' start-date '
              }
            }
            if ( startDate < id && id < endDate ) {
              className += ' through-date'
            }
            if ( endDate === id ) {
              className += ' active '
              if (this.data.markStartDate && this.data.markEndDate) {
                className += ' end-date '
              }
            }
            if (day <= 0 || day > totalDay - paddingEndCount ) {
              isPadding = true
            }
            const week = new Date(id).getDay()
            let daysObj = {
              id: id,
              special: week === 6 || week === 0 ? true : false,
              day: day,
              class: className,
              isPadding
            }
            
            // 是显示日历详情则合并日期和详情数据
            if (isShowCaledarDetail && calendars[id]) {
              // 默认不禁止
              let ban = false
              let price = calendars[id].roomPrice
              // stock不为1 和 isOpen为false 和 已经遇到了库存为0的日期之后的所有日期不可选并禁止
              if (
                calendars[id].stock < 1 
                || !calendars[id].isOpen
                || (
                  this.HAS_RUN_INTO_EMPTY_STOCK_DATE 
                  && moment(this.HAS_RUN_INTO_EMPTY_STOCK_DATE).isBefore(id)
                )
              ) {
                daysObj['class'] += ' unavailable'
                ban = true
              }

              // 当开始日期已选中时，结束日只能选择最近的库存为0的那一天, 则这一天后面的日期不可选
              if (
                startDate 
                && moment(startDate).isBefore(id) 
                && !this.HAS_RUN_INTO_EMPTY_STOCK_DATE
                && (calendars[id].stock < 1 || !calendars[id].isOpen)
              ) {
                // 遇到了库存为0的那一天，并将此天设置为可选择
                this.HAS_RUN_INTO_EMPTY_STOCK_DATE = id
                ban = false
                price = ''
                daysObj['class'] = daysObj['class'].replace('unavailable', '')
              }

              // 将结束日的金额去除
              if (endDate === id) {
                price = ''
              }
              
              daysObj = Object.assign({}, daysObj, {
                ban,
                roomPrice: price,
                stock: calendars[id].stock,
                isOpen: calendars[id].isOpen,
              })
            
            }
            days.push(daysObj)
        }
        let dateItem = {
          id: `${year}-${fullMonth}`,
          year: year,
          month: month,
          days: days
        }

        dateList.push(dateItem);
      }

      this.setData({
        dateList: dateList
      });
    },
    /*
     * 获取月的总天数
     */
    getTotalDayByMonth(year, month) {
      //month = this.getFull(month)
      //return moment(`${year}-${month}`).daysInMonth()
      let date = new Date(year, month, 0);
      return date.getDate();
    },
    /*
     * 获取月的第一天是星期几
     */
    getWeek(year, month, day) {
      /*month = this.getFull(month)
      if (day < 10) {
        day = `0${day}`
      }
      return moment(`${year}-${month}-${day}`).day()*/
      let date = new Date(year, month - 1, day)
      return date.getDay()
    },
    /**
     * 点击日期事件
     */
    onPressDate(e) {
      let { year, month, day, stock, ban, isPadding, isOpen } = e.currentTarget.dataset;
      stock = parseInt(stock)
      //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
      if ((parseInt(day, 10) < this.DATE_DAY && month === this.DATE_MONTH) || day <= 0) {
        return false
      }
      // 是否被禁止
      if (ban) {
        return false
      }

      if (isPadding) {
        return false
      }

      // 重置
      this.HAS_RUN_INTO_EMPTY_STOCK_DATE = ''

      month = this.getFull(month)
      day = this.getFull(day)
      let tempMonth = month;
      let tempDay = day;

      //let date = year + '-' + tempMonth + '-' + tempDay;
      let date = year + '-' + tempMonth + '-' + tempDay;

      if (date === this.data.startDate) {
        this.setData({
          startDate: '',
          endDate: '',
          markStartDate: false,
          markEndDate: false
        })
        return false
      }

      if (date === this.data.endDate) {
        if (stock < 1 || !isOpen) {
          this.setData({
            startDate: '',
            endDate: '',
            markStartDate: false,
            markEndDate: false
          })
          return false
        }
      }

      // 如果两个日期都选择了，再次点击某日则清空两个日期
      if (this.data.markStartDate && this.data.markEndDate) {
        this.setData({
          startDate: '',
          endDate: '',
          markStartDate: false,
          markEndDate: false
        })
      }

      // 在选择了开始日期和结束日期时，最后一个stock为0的日期时能选择的，这是会出现问题
      if (stock === 0 && !this.data.markStartDate) {
        return false
      }

      if (
        this.data.markStartDate 
        && moment(date).isBefore(this.data.startDate)
        || this.data.startDate === date
      ) {
          this.setData({
            markStartDate: false,
            markEndDate: false,
            dateList: [].concat(this.data.dateList)
          });
      };

      if (!this.data.markStartDate) {
        this.setData({
          startDate: date,
          endDate: null,
          markStartDate: true,
        });
      } else if (!this.data.markEndDate) {
        this.setData({
          endDate:date,
          markEndDate:true,
        })
      }      
    },
    //  保存
    submit() {
      if (this.data.markStartDate && this.data.markEndDate) {
        this.triggerEvent('getRangeDate', {
          startDate: this.data.startDate,
          endDate: this.data.endDate
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请选择日期'
        })
      }
    },
    /**
     * 获取日历特别显示数据
     */ 
    getCalendarData(){
      wx.request({
        url: "https://i.localhome.cn/api/wechat/specialCalendar",
        success: (res) => {
          if(res.data.success){
            const data = res.data.data
            let obj = {}
            data.forEach((item,index) => {
              obj[item.time] = item
            })
            this.setData({
              calendarData: obj
            })
          }
        }
      })
    }
  }
})
