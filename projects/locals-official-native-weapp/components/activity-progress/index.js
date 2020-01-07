/**
 * 进度条组件
 * 说明：
 * percent: 必填，进度条百分比
 * strokeWidth: 选填，进度条线的高度
 * borderRadius: 选填，圆角大小，不选就是无圆角，使用圆角的时候建议填进度条高度的一半
 * activeColor: 选填，已选择的进度条的颜色
 * backgroundColor: 选填，未选择的进度条的颜色
 * barText: { 选填，进度条下部的最小，最大，当前进度文本
 *     min: '0元',
 *     max: '1000元',
 *     curr: '100元'
 * }
 */
Component({
    properties: {
        percent: {
            type: Number,
            value: 0,
            observer(newVal) {
                this.setData({
                    currTextleft: `${newVal - 10}%`
                })
            }
        },
        borderRadius: {
            type: String,
            value: '0rpx'
        },
        strokeWidth: {
            type: String,
            value: '36rpx'
        },
        activeColor: {
            type: String,
            value: '#E42E1B'
        },
        backgroundColor: {
            type: String,
            value: '#FFE2E0'
        },
        barText: {
            type: Object,
            value: {
                min: '',
                max: '',
                curr: ''
            }
        }
    },
    data: {
        currTextleft: '40%'
    }
})
