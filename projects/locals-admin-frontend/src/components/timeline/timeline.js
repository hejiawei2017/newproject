import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TimelineTrack from './timelineTrack'
import TimelinePoints from './timelinePoints'

export default class Timeline extends Component {
    static propTypes = {
        // Selected index
        index: PropTypes.number,
        // Array containing the sorted date strings
        values: PropTypes.array,
        // Function that takes the index of the array as argument
        // indexClick: PropTypes.func,
        // Function to calculate the label on the date string
        getLabel: PropTypes.func,
        // Padding at the front and back of the line
        linePadding: PropTypes.number,
        // The width of the label
        labelWidth: PropTypes.number,
        styles: PropTypes.object
    }

    render = () => {
        // props.containerWidth generated from react-dimensions
        const {
            width,
            height,
            totalWidth,
            fillingMotion,
            styles,
            indexClick,
            index,
            labelWidth,
            points
        } = this.props

        const filledWidth = index === 0
            ? 0
            : index === points.length
                ? totalWidth
                : index * (totalWidth / (points.length - 1))
        return (
            <div
                style={{
                    width,
                    height
                }}
            >
                <div
                    className="timeline-wrapper"
                    style={{
                        position: 'relative',
                        height: '100%'
                    }}
                >
                    {/* timeline background-color */}
                    <TimelineTrack
                        width={totalWidth}
                        fillingMotion={fillingMotion}
                        backgroundColor={styles.outline}
                    />
                    {/* timeline foreground-color */}
                    <TimelineTrack
                        width={filledWidth}
                        fillingMotion={fillingMotion}
                        backgroundColor={styles.foreground}
                    />
                    <TimelinePoints
                        points={points}
                        selectedIndex={index}
                        styles={styles}
                        totalWidth={totalWidth}
                        handleDateClick={indexClick}
                        labelWidth={labelWidth}
                    />
                </div>
            </div>
        )
    }
}

