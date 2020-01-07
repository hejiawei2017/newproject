/**
 * 进度条组件
 * 说明：
 */
Component({
    properties: {
        list: {
            type: Array,
            value: []
        },
        autoplay: {
            type: Boolean,
            value: true
        },
        interval: {
            type: Number,
            value: 1000
        },
        duration: {
            type: Number,
            value: 500
        },
        circular: {
            type: Boolean,
            value: true
        },
        vertical: {
            type: Boolean,
            value: true
        },
        displayMultipleItems: {
            type: Number,
            value: 3
        }
    }
})
