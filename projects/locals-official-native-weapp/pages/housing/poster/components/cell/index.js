const moment = require('../../../../../utils/dayjs.min.js')
Component({
    properties: {
        name: String,
        avatar: String,
        content: String,
        dateTime: String
    },
    data: {
        date: '',
        time: ''
    },
    attached: function () {
        // 在组件实例进入页面节点树时执行
        this.separateDateTime()
    },
    detached: function () {
        // 在组件实例被从页面节点树移除时执行
    },
    methods: {
        /**
         * 将dateTime 分离为date 和 time两部分，并设置到data中
         */
        separateDateTime () {
            const dateTime = this.data.dateTime
            if (!dateTime) return
            const date = moment(dateTime).format('YYYY-MM-DD')
            const time = moment(dateTime).format('HH:mm:ss')
            this.setData({
                date,
                time
            })
        }
    }
})