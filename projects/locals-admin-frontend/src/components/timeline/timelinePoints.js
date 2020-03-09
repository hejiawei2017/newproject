import React from 'react'
import PropTypes from 'prop-types'
import TimelinePoint from './timelinePoint'

const TimelinePoints = ({
    points,
    selectedIndex,
    styles,
    totalWidth,
    handleDateClick,
    labelWidth
}) => (
    <ol
        className="timeline-points"
        style={{
            listStyle: 'none'
        }}
    >
        {
            points.map((point, index) => {
                return (
                    <TimelinePoint
                        key={point.label + index}
                        totalWidth={totalWidth}
                        label={point.label}
                        date={point.date}
                        index={index}
                        points={points}
                        onClick={handleDateClick}
                        selected={selectedIndex}
                        styles={styles}
                        labelWidth={labelWidth}
                    />
                )
            })
        }
    </ol>
)

TimelinePoints.propTypes = {
    width: PropTypes.number,
    fillingMotion: PropTypes.shape({
        stiffness: PropTypes.number,
        damping: PropTypes.number
    }),
    backgroundColor: PropTypes.string
}

export default TimelinePoints