import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'

const TimelineTrack = ({
    width,
    fillingMotion,
    backgroundColor
}) => (
    <Motion
        style={{
            tWidth: spring(width, fillingMotion)
        }}
    >
        {
            ({ tWidth }) => (
                <span
                    className="timeline-track"
                    style={{
                        position: 'absolute',
                        top: 0,
                        height: '100%',
                        width: tWidth,
                        transformOrigin: 'left center',
                        backgroundColor
                    }}
                />
            )
        }
    </Motion>
)

TimelineTrack.propTypes = {
    width: PropTypes.number,
    fillingMotion: PropTypes.shape({
        stiffness: PropTypes.number,
        damping: PropTypes.number
    }),
    backgroundColor: PropTypes.string
}

export default TimelineTrack

