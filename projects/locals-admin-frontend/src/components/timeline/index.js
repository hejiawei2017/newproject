import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import dimensions from 'react-dimensions'
import Timeline from './timeline'

const POINT_PADDING = 20
const LABEL_WIDTH = 100

const defaultGetLabel = (date, index) => (new Date(date)).toDateString().substring(4)

const calculatePointWidth = (dates, labelWidth, pointPadding) => {
    const distances = new Array(dates.length)
    const seperation = labelWidth + pointPadding

    for (let i = 0; i < distances.length; ++i) {
        distances[i] = seperation
    }

    return distances
}

@Radium
@dimensions({
    elementResize: true
})
export default class TimelineWrapper extends Component {
    static propTypes = {
        // Selected index
        index: PropTypes.number,
        // Array containing the sorted date strings
        values: PropTypes.array,
        // Function that takes the index of the array as argument
        // indexClick: PropTypes.func,
        // Function to calculate the label on the date string
        getLabel: PropTypes.func,
        pointPadding: PropTypes.number,
        // The width of the label
        labelWidth: PropTypes.number,
        // Styles of timeline foreground and background
        styles: PropTypes.object,
        // react-motion spring function's configuration
        fillingMotion: PropTypes.object
    }

    static defaultProps = {
        getLabel: defaultGetLabel,
        pointPadding: POINT_PADDING,
        labelWidth: LABEL_WIDTH,
        styles: {
            outline: '#dfdfdf',
            background: '#f8f8f8',
            foreground: '#7b9d6f'
        },
        fillingMotion: {
            stiffness: 150,
            damping: 25
        },
        values: [],
        index: 0
    }

    render = () => {
        // props.containerWidth generated from react-dimensions
        const {
            containerWidth,
            containerHeight,
            styles,
            indexClick,
            index,
            labelWidth,
            values,
            getLabel,
            pointPadding
        } = this.props

        if (!containerWidth) return false

        const dates = values.map(value => new Date(value))
        const distances = calculatePointWidth(
            dates,
            labelWidth,
            pointPadding
        )
        // convert the distances to points array
        const points = distances.map((distance, index) => ({
            distance,
            label: getLabel(values[index], index),
            date: values[index]
        }))
        return (
            <Timeline
                width={containerWidth}
                height={containerHeight}
                index={index}
                indexClick={indexClick}
                styles={styles}
                points={points}
                labelWidth={containerWidth / points.length}
                totalWidth={containerWidth}
            />
        )
    }
}

