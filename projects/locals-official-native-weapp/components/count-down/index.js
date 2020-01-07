/**
 * 倒计时组件
 * 用法：
 * 1.只传endTime结束时间戳
 * 2.传入startTime开始时间戳和validDuration有效期，此时结束时间=开始时间+有效期天数。
 * 如一个活动从2019-07-01 09:00:00:000开始，有效期1天，则传startTime=moment('2019-07-01 09:00:00:000'),
 * validDuration=1，endTime=moment(startTime).add(validDuration,'days')
 */
const moment = require('../../utils/dayjs.min.js')
Component({
    properties: {
        // 倒计时结束时间戳
        endTime: Number,
        // 倒计时开始时间戳
        startTime: Number,
        // 有效期天数
        validDuration: {
            type: Number,
            value: 0
        }
    },
    data: {
        intervalId: -1, // 倒计时器的id
        remaining: {
            day: '00',
            hour: '00',
            minute: '00',
            second: '00'
        }
    },
    methods: {
        /**
         * 启动倒计时器
         * @param {moment} remainingTime
         */
        startCountDownInterval(remainingTime) {
            return setInterval(() => {
                this.showRemainingTime(remainingTime--)
                if (remainingTime === -1) {
                    // console.log('倒计时结束。关闭倒计时器')
                    this.stopCountDownInterval(this.data.intervalId)
                }
            }, 1000)
        },
        /**
         * 关闭倒计时器
         * @param {Number} intervalId
         */
        stopCountDownInterval(intervalId) {
            clearInterval(intervalId)
        },
        showRemainingTime(remainingTime) {
            const day2Second = 86400
            const hour2Second = 3600
            const minute2Second = 60
            const day = parseInt(remainingTime / day2Second)
            const hour = parseInt((remainingTime - day2Second * day) / hour2Second)
            const minute = parseInt((remainingTime - day2Second * day - hour2Second * hour) / minute2Second)
            const second = parseInt(remainingTime - day2Second * day - hour2Second * hour - minute2Second * minute)
            this.setData({
                remaining: {
                    day: this.deal2Digit(day),
                    hour: this.deal2Digit(hour),
                    minute: this.deal2Digit(minute),
                    second: this.deal2Digit(second)
                }
            })
        },
        deal2Digit(num) {
            return num < 10 ? `0${num}` : num
        }
    },
    ready() {
        if (this.data.endTime === null && this.data.startTime === null) {
            throw new Error('倒计时组件调用错误，开始时间和结束时间不能同时无值！')
        }
        /**
         * 处理毫秒值，避免定时器不能正常结束
         */
        const now = moment().set('millisecond', 0)
        const endTime = this.data.endTime
            ? moment(this.data.endTime).set('millisecond', 0)
            : moment(this.data.startTime)
                  .set('millisecond', 0)
                  .add(this.data.validDuration, 'days')
        const remainingTime = endTime.diff(now, 'seconds')
        if (remainingTime < 0) {
            // console.log('该订单砍价活动时间已过期')
            return
        }
        this.setData({
            intervalId: this.startCountDownInterval(remainingTime)
        })
    }
})
